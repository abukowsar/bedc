import { NextResponse } from "next/server";
import { getDb, getMongoConnectionMessage, isMongoConnectionError } from "@/lib/mongodb";
import { hashPassword, hashSetupToken } from "@/lib/password";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const db = await getDb();
    const tokenHash = hashSetupToken(token);
    const user = await db.collection("users").findOne({
      role: "user",
      passwordSetupTokenHash: tokenHash,
      passwordSetupExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ message: "This password setup link is invalid or expired." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash,
          passwordSetAt: new Date(),
          status: "active",
        },
        $unset: {
          passwordSetupTokenHash: "",
          passwordSetupExpiresAt: "",
        },
      },
    );

    return NextResponse.json({ ok: true, redirectTo: "/user/login" });
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ message: getMongoConnectionMessage() }, { status: 503 });
    }

    return NextResponse.json({ message: error.message || "Unable to set password." }, { status: 500 });
  }
}
