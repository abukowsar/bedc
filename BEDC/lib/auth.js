import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "osos_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.AUTH_SECRET || "change-me-local-secret";
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function createSessionToken(user) {
  const payload = {
    role: user.role,
    username: user.username,
    name: user.name || user.username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const body = encode(payload);
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [body, signature] = token.split(".");
  if (!timingSafeEqual(sign(body), signature)) {
    return null;
  }

  const payload = decode(body);
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export function getLoginCredentials(role) {
  if (role === "admin") {
    return {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      name: "Admin",
    };
  }

  if (role === "user") {
    return {
      username: process.env.REGISTERED_USERS_USERNAME || process.env.REGISTERED_USERS_EMAIL,
      password: process.env.REGISTERED_USERS_PASSWORD,
      name: "User",
    };
  }

  return null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
