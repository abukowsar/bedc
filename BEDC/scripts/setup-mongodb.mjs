import fs from "node:fs";
import { MongoClient } from "mongodb";

function loadLocalEnv() {
  const envPath = ".env.local";
  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local was not found. Add MONGODB_URI before running this setup.");
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
}

function isMongoConnectionError(error) {
  const message = String(error?.message || "");
  return (
    error?.name === "MongoServerSelectionError" ||
    message.includes("SSL routines") ||
    message.includes("tlsv1 alert") ||
    message.includes("querySrv") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ETIMEDOUT")
  );
}

async function ensureCollection(db, name, options) {
  const exists = await db.listCollections({ name }).hasNext();

  if (!exists) {
    await db.createCollection(name, options);
    console.log(`created collection: ${name}`);
    return;
  }

  if (options.validator) {
    await db.command({
      collMod: name,
      validationAction: options.validationAction,
      validationLevel: options.validationLevel,
      validator: options.validator,
    });
  }

  console.log(`updated collection: ${name}`);
}

loadLocalEnv();

const mongoUri = process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not set in .env.local");
}

const dbName = process.env.MONGODB_DB || "OSOS";
const client = new MongoClient(mongoUri, {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 8000,
  tls: mongoUri.startsWith("mongodb+srv://") || mongoUri.includes("mongodb.net"),
});

try {
  await client.connect();
  const db = client.db(dbName);

  await ensureCollection(db, "registrations", {
    validationAction: "error",
    validationLevel: "moderate",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["studentName", "institutionName", "email", "phone", "classLevel", "district", "skill", "status", "source", "createdAt"],
        properties: {
          studentName: { bsonType: "string" },
          institutionName: { bsonType: "string" },
          email: { bsonType: "string" },
          phone: { bsonType: "string" },
          classLevel: { bsonType: "string" },
          district: { bsonType: "string" },
          skill: { bsonType: "string" },
          guardianPhone: { bsonType: "string" },
          message: { bsonType: "string" },
          status: { enum: ["new", "contacted", "enrolled", "rejected"] },
          source: { bsonType: "string" },
          createdAt: { bsonType: "date" },
          passwordSetupSentAt: { bsonType: "date" },
        },
      },
    },
  });

  await ensureCollection(db, "users", {
    validationAction: "warn",
    validationLevel: "moderate",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "role", "name", "createdAt"],
        properties: {
          username: { bsonType: "string" },
          email: { bsonType: "string" },
          role: { enum: ["admin", "user"] },
          name: { bsonType: "string" },
          institutionName: { bsonType: "string" },
          phone: { bsonType: "string" },
          classLevel: { bsonType: "string" },
          district: { bsonType: "string" },
          interestedSkill: { bsonType: "string" },
          passwordHash: { bsonType: "string" },
          passwordSetupTokenHash: { bsonType: "string" },
          passwordSetupExpiresAt: { bsonType: "date" },
          passwordSetupSentAt: { bsonType: "date" },
          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: "date" },
          lastLoginAt: { bsonType: "date" },
        },
      },
    },
  });

  await db.collection("registrations").createIndex({ createdAt: -1 }, { name: "registrations_createdAt_desc" });
  await db.collection("registrations").createIndex({ email: 1 }, { name: "registrations_email" });
  await db.collection("registrations").createIndex({ phone: 1 }, { name: "registrations_phone" });
  await db.collection("registrations").createIndex({ district: 1, skill: 1 }, { name: "registrations_district_skill" });
  await db.collection("registrations").createIndex({ status: 1, createdAt: -1 }, { name: "registrations_status_createdAt" });

  await db.collection("users").createIndex({ username: 1, role: 1 }, { name: "users_username_role_unique", unique: true });
  await db.collection("users").createIndex(
    { email: 1, role: 1 },
    {
      name: "users_email_role_unique",
      partialFilterExpression: { email: { $exists: true, $type: "string" } },
      unique: true,
    },
  );
  await db.collection("users").createIndex({ passwordSetupTokenHash: 1 }, { name: "users_password_setup_token" });

  console.log(`MongoDB setup complete for database: ${dbName}`);
} catch (error) {
  console.error("MongoDB setup failed.");
  if (isMongoConnectionError(error)) {
    console.error(
      "Unable to connect to MongoDB Atlas. Check MONGODB_URI/MONGODB_DIRECT_URI and the Atlas Network Access allowlist, then run npm run db:setup again.",
    );
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
