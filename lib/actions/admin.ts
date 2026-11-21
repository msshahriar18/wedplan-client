"use server"

import { revalidatePath } from "next/cache"
import { authFetch, protectedMutation } from "@/lib/core/server"
import type { AdminUser } from "@/lib/types/user"

export const setUserBlocked = async (id: string, isBlocked: boolean) => {
  const result = await protectedMutation<AdminUser>(`/admin/users/${id}/block`, "PATCH", { isBlocked })
  if (result.ok) revalidatePath("/dashboard/admin", "layout")
  return result
}

// called from the user details dialog
export const getUserDetails = async (id: string) => {
  try {
    return { ok: true as const, data: await authFetch<AdminUser>(`/admin/users/${id}`) }
  } catch (err) {
    return { ok: false as const, message: (err as Error).message || "Could not load user" }
  }
}
