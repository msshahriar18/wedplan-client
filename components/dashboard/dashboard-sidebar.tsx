"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarCheck,
  CalendarHeart,
  Crown,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  PlusCircle,
  Receipt,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/shared/logo"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useLogout } from "@/components/layout/user-menu"
import { ROLE_LABEL, type UserRole } from "@/lib/types/user"

type NavItem = { label: string; href: string; icon: LucideIcon }

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarHeart },
    { label: "Profile Settings", href: "/dashboard/customer/profile", icon: Settings },
  ],
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "My Services", href: "/dashboard/vendor/services", icon: LayoutGrid },
    { label: "Add Service", href: "/dashboard/vendor/services/new", icon: PlusCircle },
    { label: "Booking Requests", href: "/dashboard/vendor/bookings", icon: CalendarCheck },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: Crown },
    { label: "Profile Settings", href: "/dashboard/vendor/profile", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Services", href: "/dashboard/admin/services", icon: LayoutGrid },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    { label: "Profile Settings", href: "/dashboard/admin/profile", icon: Settings },
  ],
}

type SidebarUser = {
  name: string
  email: string
  image?: string | null
  role: UserRole
  isPremium?: boolean
}

export function DashboardSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const logout = useLogout()
  const items = NAV_BY_ROLE[user.role] ?? []

  // the longest matching link wins, so "Add Service" doesn't also light up "My Services"
  const activeHref = items
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-5 pb-3">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{ROLE_LABEL[user.role]} menu</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={activeHref === item.href}
                  render={<Link href={item.href} onClick={() => setOpenMobile(false)} />}
                  className="h-10 data-active:bg-primary data-active:text-primary-foreground"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/" />} className="h-10">
                <Home />
                <span>Back to website</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout} className="h-10 text-destructive hover:text-destructive">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-1 py-1">
          <UserAvatar src={user.image} name={user.name} className="size-9" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {ROLE_LABEL[user.role]}
              {user.isPremium ? " · Premium" : ""}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
