import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, getMongoConnectionMessage, isMongoConnectionError } from "@/lib/mongodb";

const allowedFields = [
  "fullName",
  "email",
  "phone",
  "institution",
  "educationLevel",
  "district",
  "skill",
  "objective",
  "skills",
  "education",
  "experience",
  "projects",
  "certifications",
  "languages",
  "references",
];

function cleanProfile(profile) {
  return allowedFields.reduce((cleaned, field) => {
    cleaned[field] = String(profile?.[field] || "").trim().slice(0, 5000);
    return cleaned;
  }, {});
}

export async function PATCH(request) {
  const session = await getSession();

  if (!session || session.role !== "user") {
    return NextResponse.json({ message: "Please login first." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const cvProfile = cleanProfile(body.cvProfile);
    const db = await getDb();
    const email = session.username?.trim().toLowerCase();

    await db.collection("users").updateOne(
      { email, role: "user" },
      {
        $set: {
          cvProfile,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ ok: true, cvProfile });
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ message: getMongoConnectionMessage() }, { status: 503 });
    }

    return NextResponse.json({ message: error.message || "Profile update failed." }, { status: 500 });
  }
}
