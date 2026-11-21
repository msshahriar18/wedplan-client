"use server"

import { revalidatePath } from "next/cache"
import { protectedMutation } from "@/lib/core/server"
import type { Service, ServiceInput, ServiceStatus } from "@/lib/types/service"

const refresh = () => {
  revalidatePath("/dashboard/vendor", "layout")
  revalidatePath("/dashboard/admin", "layout")
  revalidatePath("/services")
  revalidatePath("/")
}

export const createService = async (data: ServiceInput) => {
  const result = await protectedMutation<Service>("/services", "POST", data)
  if (result.ok) refresh()
  return result
}

export const updateService = async (id: string, data: ServiceInput) => {
  const result = await protectedMutation<Service>(`/services/${id}`, "PATCH", data)
  if (result.ok) refresh()
  return result
}

export const setServiceAvailability = async (id: string, isAvailable: boolean) => {
  const result = await protectedMutation<Service>(`/services/${id}/availability`, "PATCH", {
    isAvailable,
  })
  if (result.ok) refresh()
  return result
}

export const deleteService = async (id: string) => {
  const result = await protectedMutation<{ deleted: boolean }>(`/services/${id}`, "DELETE")
  if (result.ok) refresh()
  return result
}

// admin only, the api checks the role again
export const reviewService = async (id: string, status: ServiceStatus) => {
  const result = await protectedMutation<Service>(`/admin/services/${id}/status`, "PATCH", { status })
  if (result.ok) refresh()
  return result
}

export const adminDeleteService = async (id: string) => {
  const result = await protectedMutation<{ deleted: boolean }>(`/admin/services/${id}`, "DELETE")
  if (result.ok) refresh()
  return result
}
