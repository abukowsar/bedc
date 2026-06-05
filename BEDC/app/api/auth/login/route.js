import { NextResponse } from "next/server";
import { createSessionToken, getLoginCredentials, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { getDb, getMongoConnectionMessage, isMongoConnectionError } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";

export async function POST(request) {
  try {
    const { role, username, password } = await request.json();

    if (role === "admin") {
      const credentials = getLoginCredentials(role);

      if (!credentials || username !== credentials.username || password !== credentials.password) {
        return NextResponse.json({ message: "Invalid username or password." }, { status: 401 });
      }

      let dbWarning = "";

      try {
        const db = await getDb();
        await db.collection("users").updateOne(
          { username, role },
          {
            $set: {
              username,
              role,
              name: credentials.name,
              lastLoginAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true },
        );
      } catch (error) {
        dbWarning = isMongoConnectionError(error) ? getMongoConnectionMessage() : error.message || "MongoDB user sync failed.";
      }

      const response = NextResponse.json({
        ok: true,
        redirectTo: "/admin/dashboard",
        dbWarning,
      });

      response.cookies.set(SESSION_COOKIE, createSessionToken({ role, username, name: credentials.name }), sessionCookieOptions);
      return response;
    }

    if (role !== "user") {
      return NextResponse.json({ message: "Invalid login role." }, { status: 400 });
    }

    try {
      const db = await getDb();
      const normalizedEmail = username.trim().toLowerCase();
      const user = await db.collection("users").findOne({ email: normalizedEmail, role: "user" });
      const fallbackCredentials = getLoginCredentials("user");
      const fallbackUsername = fallbackCredentials?.username?.trim().toLowerCase();

      if (!user || !user.passwordHash) {
        if (fallbackUsername && normalizedEmail === fallbackUsername && password === fallbackCredentials.password) {
          const response = NextResponse.json({
            ok: true,
            redirectTo: "/user/dashboard",
          });

          response.cookies.set(
            SESSION_COOKIE,
            createSessionToken({ role: "user", username: normalizedEmail, name: fallbackCredentials.name || normalizedEmail }),
            sessionCookieOptions,
          );
          return response;
        }

        return NextResponse.json({ message: "Please register and set your password first." }, { status: 401 });
      }

      const passwordMatches = await verifyPassword(password, user.passwordHash);
      if (!passwordMatches) {
        return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
      }

      await db.collection("users").updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

      const response = NextResponse.json({
        ok: true,
        redirectTo: "/user/dashboard",
      });

      response.cookies.set(
        SESSION_COOKIE,
        createSessionToken({ role: "user", username: normalizedEmail, name: user.name || normalizedEmail }),
        sessionCookieOptions,
      );
      return response;
    } catch (error) {
      if (isMongoConnectionError(error)) {
        return NextResponse.json({ message: getMongoConnectionMessage() }, { status: 503 });
      }

      return NextResponse.json({ message: error.message || "Login failed." }, { status: 500 });
    }
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ message: getMongoConnectionMessage() }, { status: 503 });
    }

    return NextResponse.json({ message: error.message || "Login failed." }, { status: 500 });
  }
}
