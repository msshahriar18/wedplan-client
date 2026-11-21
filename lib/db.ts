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
  globalForMongo.mongoClient = new MongoClient(uri)
  globalForMongo.mongoUri = uri
}

export const mongoClient = globalForMongo.mongoClient

export const db = mongoClient.db(process.env.DB_NAME || "wedplandb")
