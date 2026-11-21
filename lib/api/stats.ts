import "server-only"
import { authFetch } from "@/lib/core/server"
import type { Booking } from "@/lib/types/booking"

export type CustomerStats = {
  total: number
  pending: number
  accepted: number
  rejected: number
  cancelled: number
  recent: Booking[]
}

export type VendorStats = {
  totalServices: number
  activeServices: number
  approvedServices: number
  pendingServices: number
  pendingBookings: number
  acceptedBookings: number
  totalBookings: number
  plan: "free" | "premium"
  subscriptionExpiresAt: string | null
  freeLimit: number
}

export type AdminStats = {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalServices: number
  pendingServices: number
  approvedServices: number
  totalTransactions: number
  totalRevenue: number
  totalBookings: number
}

export const getCustomerStats = () => authFetch<CustomerStats>("/stats/customer")
export const getVendorStats = () => authFetch<VendorStats>("/stats/vendor")
export const getAdminStats = () => authFetch<AdminStats>("/stats/admin")

export type BillingInfo = {
  plan: "free" | "premium"
  subscriptionExpiresAt: string | null
  cancelAtPeriodEnd: boolean
  transactions: {
    _id: string
    plan: string
    amount: number
    currency: string
    status: string
    createdAt: string
  }[]
}

export const getBillingInfo = () => authFetch<BillingInfo>("/payments/my")
