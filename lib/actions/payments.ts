"use server"

import { revalidatePath } from "next/cache"
import { API_URL, getToken, protectedMutation, type ActionResult } from "@/lib/core/server"

export const startCheckout = async () => {
  return protectedMutation<{ url: string }>("/payments/create-checkout-session", "POST")
}

export const cancelSubscription = async () => {
  const result = await protectedMutation<{ cancelAtPeriodEnd: boolean }>(
    "/payments/cancel-subscription",
    "POST"
  )
  if (result.ok) revalidatePath("/dashboard/vendor", "layout")
  return result
}

export type PaymentStatus = {
  status: "paid" | "failed" | "processing" | "expired"
  plan?: string
  amount?: number
  currency?: string
  createdAt?: string
  subscriptionExpiresAt?: string | null
}

// only reads what the webhook already saved, it can't activate anything
export const getPaymentStatus = async (sessionId: string): Promise<ActionResult<PaymentStatus>> => {
  const token = await getToken()
  try {
    const res = await fetch(`${API_URL}/payments/session/${encodeURIComponent(sessionId)}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const body = await res.json().catch(() => null)
    if (!res.ok) return { ok: false, status: res.status, message: body?.message || "Could not check payment" }
    if (body.status === "paid") revalidatePath("/", "layout")
    return { ok: true, data: body }
  } catch {
    return { ok: false, message: "Could not reach the server" }
  }
}
