export type UserRole = "customer" | "vendor" | "admin"

export type SubscriptionPlan = "free" | "premium"

export type Profile = {
  _id: string
  name: string
  email: string
  image: string | null
  role: UserRole
  businessName: string
  phone: string
  bio: string
  subscriptionPlan: SubscriptionPlan
  subscriptionExpiresAt: string | null
  roleSelected: boolean
  createdAt: string
}

export type AdminUser = {
  _id: string
  name: string
  email: string
  image?: string | null
  role: UserRole
  isBlocked?: boolean
  businessName?: string
  phone?: string
  subscriptionPlan?: SubscriptionPlan
  subscriptionExpiresAt?: string | null
  isPremium?: boolean
  createdAt: string
  stats?: {
    serviceCount: number
    vendorBookings: number
    customerBookings: number
    payments: number
  }
}

export const ROLE_LABEL: Record<UserRole, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
}

export const dashboardPath = (role?: string | null) => {
  if (role === "admin") return "/dashboard/admin"
  if (role === "vendor") return "/dashboard/vendor"
  return "/dashboard/customer"
}
