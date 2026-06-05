import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "OSOS";
const mongoOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 8000,
  tls: uri?.startsWith("mongodb+srv://") || uri?.includes("mongodb.net"),
};

if (!uri) {
  throw new Error("MONGODB_URI is not set in .env.local");
}

function createClientPromise() {
  const client = new MongoClient(uri, mongoOptions);
  return client.connect();
}

async function getClient() {
  if (process.env.NODE_ENV !== "development") {
    if (!globalThis._oneSkillsMongoClientPromise) {
      globalThis._oneSkillsMongoClientPromise = createClientPromise();
    }
    return globalThis._oneSkillsMongoClientPromise;
  }

  if (!globalThis._oneSkillsMongoClientPromise) {
    globalThis._oneSkillsMongoClientPromise = createClientPromise().catch((error) => {
      globalThis._oneSkillsMongoClientPromise = null;
      throw error;
    });
  }

  return globalThis._oneSkillsMongoClientPromise;
}

export async function getDb() {
  const client = await getClient();
  return client.db(dbName);
}

export function isMongoConnectionError(error) {
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

export function getMongoConnectionMessage() {
  return "Database is temporarily in local mode because MongoDB Atlas is not reachable from this network.";
}
