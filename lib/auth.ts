import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { ObjectId } from "mongodb"
import { db, mongoClient } from "@/lib/db"

const PUBLIC_ROLES = ["customer", "vendor"]

// fields users must never be able to set themselves
const PROTECTED_FIELDS = [
  "role",
  "isBlocked",
  "subscriptionPlan",
  "subscriptionExpiresAt",
  "roleSelected",
] as const

export const passwordRules = (password: string) => {
  if (password.length < 6) return "Password must be at least 6 characters"
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter"
  if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter"
  return null
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL as string],
  database: mongodbAdapter(db, { client: mongoClient }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        input: true,
        defaultValue: "customer",
      },
      businessName: { type: "string", required: false, input: true },
      phone: { type: "string", required: false, input: true },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      subscriptionPlan: {
        type: ["free", "premium"],
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
      roleSelected: { type: "boolean", defaultValue: true, input: false },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return

      const problem = passwordRules(String(ctx.body?.password ?? ""))
      if (problem) throw new APIError("BAD_REQUEST", { message: problem })

      if (!PUBLIC_ROLES.includes(ctx.body?.role)) {
        throw new APIError("BAD_REQUEST", { message: "Please choose customer or vendor" })
      }
      if (ctx.body.role === "vendor" && String(ctx.body.businessName ?? "").trim().length < 2) {
        throw new APIError("BAD_REQUEST", { message: "Business name is required for vendors" })
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const fromEmailSignUp = ctx?.path === "/sign-up/email"

          // admin can never come from public registration
          const role = fromEmailSignUp && PUBLIC_ROLES.includes(user.role as string)
            ? (user.role as string)
            : "customer"

          return {
            data: {
              ...user,
              role,
              businessName: role === "vendor" ? String(user.businessName ?? "").trim() : "",
              isBlocked: false,
              subscriptionPlan: "free",
              subscriptionExpiresAt: null,
              // google users choose their role on the onboarding page
              roleSelected: fromEmailSignUp,
            },
          }
        },
      },
      update: {
        before: async (user) => {
          const data: Record<string, unknown> = { ...user }
          PROTECTED_FIELDS.forEach((field) => delete data[field])
          return { data }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await db
            .collection("user")
            .findOne(
              { _id: new ObjectId(String(session.userId)) },
              { projection: { isBlocked: 1 } }
            )
          if (user?.isBlocked) {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been blocked. Please contact support.",
            })
          }
        },
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
