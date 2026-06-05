import { NextResponse } from "next/server";
import { getDb, getMongoConnectionMessage, isMongoConnectionError } from "@/lib/mongodb";
import { createPasswordSetupLink, sendPasswordSetupEmail } from "@/lib/email";
import { createSetupToken } from "@/lib/password";
import { getPendingRegistrations, savePendingRegistration } from "@/lib/localRegistrations";

const requiredFields = ["studentName", "institutionName", "email", "phone", "classLevel", "district", "skill"];
const totalSeats = 350;

async function getRegistrationCount() {
  try {
    const db = await getDb();
    return {
      totalRegistrations: await db.collection("registrations").countDocuments(),
      source: "mongodb",
    };
  } catch (error) {
    if (!isMongoConnectionError(error)) {
      throw error;
    }

    const pendingRegistrations = await getPendingRegistrations();
    return {
      totalRegistrations: pendingRegistrations.length,
      source: "local-pending",
    };
  }
}

export async function GET() {
  try {
    const { totalRegistrations, source } = await getRegistrationCount();
    const remainingSeats = Math.max(totalSeats - totalRegistrations, 0);

    return NextResponse.json({
      totalSeats,
      totalRegistrations,
      remainingSeats,
      source,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Registration count failed." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const missingField = requiredFields.find((field) => !String(body[field] || "").trim());

    if (missingField) {
      return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
    }

    const normalizedEmail = body.email.trim().toLowerCase();
    const token = createSetupToken();
    const setupLink = createPasswordSetupLink(token.rawToken);
    const now = new Date();

    const registration = {
      studentName: body.studentName.trim(),
      institutionName: body.institutionName.trim(),
      email: normalizedEmail,
      phone: body.phone.trim(),
      classLevel: body.classLevel,
      district: body.district.trim(),
      skill: body.skill,
      guardianPhone: body.guardianPhone?.trim() || "",
      message: body.message?.trim() || "",
      status: "new",
      source: "landing-page",
      createdAt: now,
      passwordSetupSentAt: now,
    };

    let db;

    try {
      db = await getDb();
    } catch (error) {
      if (isMongoConnectionError(error)) {
        console.error("Registration database connection failed. Saved locally for later sync:", error);
        const pendingRegistration = await savePendingRegistration(registration);

        return NextResponse.json({
          ok: true,
          id: pendingRegistration._id,
          pendingSync: true,
          emailSent: false,
          message: "Registration received. It is saved locally and will sync after MongoDB Atlas is connected.",
        });
      }

      throw error;
    }

    const result = await db.collection("registrations").insertOne(registration);

    await db.collection("users").updateOne(
      { email: normalizedEmail, role: "user" },
      {
        $set: {
          email: normalizedEmail,
          username: normalizedEmail,
          role: "user",
          name: registration.studentName,
          institutionName: registration.institutionName,
          phone: registration.phone,
          classLevel: registration.classLevel,
          district: registration.district,
          interestedSkill: registration.skill,
          registrationId: result.insertedId,
          passwordSetupTokenHash: token.tokenHash,
          passwordSetupExpiresAt: token.expiresAt,
          passwordSetupSentAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );

    let emailSent = true;

    try {
      await sendPasswordSetupEmail({
        to: normalizedEmail,
        studentName: registration.studentName,
        setupLink,
      });
    } catch (emailError) {
      emailSent = false;
      console.error("Registration saved, but password setup email failed:", emailError);
    }

    return NextResponse.json({ ok: true, id: result.insertedId.toString(), emailSent });
  } catch (error) {
    if (isMongoConnectionError(error)) {
      console.error("Registration database connection failed:", error);
      return NextResponse.json(
        {
          message: getMongoConnectionMessage(),
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ message: error.message || "Registration failed." }, { status: 500 });
  }
}
