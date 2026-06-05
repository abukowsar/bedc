import crypto from "crypto";

const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey.toString("hex"));
    });
  });

  return `${salt}:${hash}`;
}

export async function verifyPassword(password, storedPassword) {
  if (!storedPassword || !storedPassword.includes(":")) {
    return false;
  }

  const [salt, storedHash] = storedPassword.split(":");
  const hash = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });

  const storedBuffer = Buffer.from(storedHash, "hex");
  return storedBuffer.length === hash.length && crypto.timingSafeEqual(storedBuffer, hash);
}

export function createSetupToken() {
  const rawToken = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  return {
    rawToken,
    tokenHash,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  };
}

export function hashSetupToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
