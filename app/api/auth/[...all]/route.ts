import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { toNextJsHandler } from "better-auth/next-js"

const handler = toNextJsHandler(auth.handler)

export const GET = async (request: Request) => {
  await connectDB()
  return handler.GET(request)
}

export const POST = async (request: Request) => {
  await connectDB()
  return handler.POST(request)
}
