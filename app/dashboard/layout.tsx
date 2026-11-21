import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { UserMenu } from "@/components/layout/user-menu"
import { requireUser } from "@/lib/core/server"
import { isPremiumActive, type UserRole } from "@/lib/types/user"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const isPremium = isPremiumActive(user)

  const sidebarUser = {
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role as UserRole,
    isPremium,
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={sidebarUser} />
      <SidebarInset className="min-w-0 bg-background">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="size-9" />
          <UserMenu user={sidebarUser} />
        </header>
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
