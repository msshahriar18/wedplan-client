"use server"

import { revalidatePath } from "next/cache"
import { protectedMutation } from "@/lib/core/server"
import type { Profile } from "@/lib/types/user"

export const chooseRole = async (role: "customer" | "vendor", businessName?: string) => {
  return protectedMutation<Profile>("/users/me/role", "PATCH", { role, businessName })
}

export type ProfileInput = {
  name: string
  image?: string | null
  phone?: string
  bio?: string
  businessName?: string
}

export const updateProfile = async (data: ProfileInput) => {
  const result = await protectedMutation<Profile>("/users/me", "PATCH", data)
  if (result.ok) revalidatePath("/", "layout")
  return result
}
