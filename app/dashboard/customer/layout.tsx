import { requireRole } from "@/lib/core/server"

// server side guard, a vendor typing /dashboard/admin gets sent to /unauthorized
export default async function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole("customer")
  return children
}
