import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const dataDir = path.join(process.cwd(), "data");
const pendingFile = path.join(dataDir, "pending-registrations.jsonl");

export async function savePendingRegistration(registration) {
  await mkdir(dataDir, { recursive: true });

  const pendingRegistration = {
    ...registration,
    _id: `pending-${randomUUID()}`,
    createdAt: registration.createdAt instanceof Date ? registration.createdAt.toISOString() : registration.createdAt,
    passwordSetupSentAt:
      registration.passwordSetupSentAt instanceof Date ? registration.passwordSetupSentAt.toISOString() : registration.passwordSetupSentAt,
    storageStatus: "pending-mongodb-sync",
  };

  await appendFile(pendingFile, `${JSON.stringify(pendingRegistration)}\n`, "utf8");
  return pendingRegistration;
}

export async function getPendingRegistrations() {
  try {
    const content = await readFile(pendingFile, "utf8");
    return content
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .reverse();
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}
