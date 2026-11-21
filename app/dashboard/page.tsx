import { redirectToDashboard } from "@/lib/core/server"

// /dashboard just sends people to the dashboard of their role
export default async function DashboardIndexPage() {
  await redirectToDashboard()
}
