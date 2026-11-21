import { requireRole } from "@/lib/core/server"

// server side guard, a vendor typing /dashboard/admin gets sent to /unauthorized
export default async function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole("vendor")
  return children
}
