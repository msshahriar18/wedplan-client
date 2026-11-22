import "server-only"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient
  mongoUri?: string
}

// reuse one client in dev so hot reload doesn't open new connections,
// but make a fresh one if MONGODB_URI was changed in .env.local
if (!globalForMongo.mongoClient || globalForMongo.mongoUri !== uri) {
  globalForMongo.mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 })
  globalForMongo.mongoUri = uri
}

export const mongoClient = globalForMongo.mongoClient

export const db = mongoClient.db(process.env.DB_NAME || "wedplandb")

// If the very first connection times out, the driver closes the client and every
// later query fails with "Topology is closed". connect() reopens it, so call this
// before auth work. It returns right away when the client is already connected.
export const connectDB = async () => {
  try {
    await mongoClient.connect()
  } catch {
    await mongoClient.connect()
  }
}
