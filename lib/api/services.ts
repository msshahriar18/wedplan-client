import "server-only"
import { API_URL, authFetch, publicFetch } from "@/lib/core/server"
import type { CategoryCount, Service, ServiceListResponse } from "@/lib/types/service"

export const getServices = (query: string) =>
  publicFetch<ServiceListResponse>(`/services?${query}`)

export const getFeaturedServices = async () => {
  try {
    return await publicFetch<Service[]>("/services/featured")
  } catch {
    return []
  }
}

export const getCategoryCounts = async () => {
  try {
    return await publicFetch<CategoryCount[]>("/services/categories")
  } catch {
    return []
  }
}

// returns null for a missing service so the page can show a proper message
export const getServiceById = async (
  id: string
): Promise<{ service: Service | null; message?: string }> => {
  const res = await fetch(`${API_URL}/services/${encodeURIComponent(id)}`, { cache: "no-store" })
  if (res.ok) return { service: await res.json() }
  const body = await res.json().catch(() => null)
  if (res.status === 400 || res.status === 404) {
    return { service: null, message: body?.message || "Service not found" }
  }
  throw new Error(body?.message || "Could not load this service")
}

export const getVendorServices = () => authFetch<Service[]>("/vendor/services")

export const getVendorServiceById = (id: string) =>
  authFetch<Service>(`/vendor/services/${encodeURIComponent(id)}`)
