import "server-only"
import { authFetch } from "@/lib/core/server"
import type { Service } from "@/lib/types/service"
import type { Transaction } from "@/lib/types/transaction"
import type { AdminUser } from "@/lib/types/user"

const qs = (params: Record<string, string | undefined>) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => value && query.set(key, value))
  return query.size ? `?${query}` : ""
}

export const getAdminUsers = (params: { search?: string; role?: string; status?: string }) =>
  authFetch<AdminUser[]>(`/admin/users${qs(params)}`)

export const getAdminServices = (params: { search?: string; status?: string; category?: string }) =>
  authFetch<(Service & { vendor?: Service["vendor"] })[]>(`/admin/services${qs(params)}`)

export const getAdminTransactions = (params: { status?: string }) =>
  authFetch<Transaction[]>(`/admin/transactions${qs(params)}`)
