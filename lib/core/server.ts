import "server-only"
import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SignJWT } from "jose"
import { auth } from "@/lib/auth"
import { dashboardPath, type UserRole } from "@/lib/types/user"

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)

export type ActionResult<T = null> =
  | { ok: true; data: T; message?: string }
  | { ok: false; message: string; status?: number }

// cached per request, so layouts and pages can both call it for free
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

export const getCurrentUser = async () => {
  const session = await getSession()
  return session?.user ?? null
}

// short lived token for the express api, signed with the shared secret
export const getToken = async () => {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")

  return new SignJWT({ role: session.user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(jwtSecret)
}

const readMessage = async (res: Response) => {
  try {
    const body = await res.json()
    return body?.message || "Request failed"
  } catch {
    return "Request failed"
  }
}

// GET with token, used by server components. Errors go to the nearest error.tsx
export const authFetch = async <T>(path: string): Promise<T> => {
  const token = await getToken()
  const res = await fetch(`${API_URL}${path}`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  if (res.status === 401) redirect("/sign-in")
  if (res.status === 403) redirect("/unauthorized")
  if (!res.ok) throw new Error(await readMessage(res))
  return res.json()
}

// POST/PATCH/DELETE with token, used inside server actions
export const protectedMutation = async <T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  data?: unknown
): Promise<ActionResult<T>> => {
  const token = await getToken()
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
    })
    if (!res.ok) {
      return { ok: false, status: res.status, message: await readMessage(res) }
    }
    return { ok: true, data: (await res.json()) as T }
  } catch {
    return { ok: false, message: "Could not reach the server. Please try again." }
  }
}

// public GET, no token needed. Always fresh so newly approved services show up right away
export const publicFetch = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" })
  if (!res.ok) throw new Error(await readMessage(res))
  return res.json()
}

export const requireUser = async () => {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")
  if (session.user.roleSelected === false) redirect("/onboarding")
  return session.user
}

export const requireRole = async (role: UserRole) => {
  const user = await requireUser()
  if (user.role !== role) redirect("/unauthorized")
  return user
}

export const redirectToDashboard = async () => {
  const user = await requireUser()
  redirect(dashboardPath(user.role))
}
