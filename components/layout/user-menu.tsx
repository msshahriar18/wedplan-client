"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, Settings } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/shared/user-avatar"
import { signOut } from "@/lib/auth-client"
import { notify } from "@/lib/notify"
import { ROLE_LABEL, dashboardPath, type UserRole } from "@/lib/types/user"

type MenuUser = { name: string; email: string; image?: string | null; role: string }

export const useLogout = () => {
  const router = useRouter()
  return async () => {
    await signOut()
    notify.success("Signed out", "See you again soon!")
    router.push("/")
    router.refresh()
  }
}

export function UserMenu({ user }: { user: MenuUser }) {
  const logout = useLogout()
  const base = dashboardPath(user.role)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 transition-colors hover:border-primary/40"
      >
        <UserAvatar src={user.image} name={user.name} className="size-8" />
        <span className="max-w-28 truncate text-sm font-medium">{user.name.split(" ")[0]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60 p-1.5">
        <div className="flex items-center gap-3 px-2 py-2">
          <UserAvatar src={user.image} name={user.name} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <p className="mt-0.5 text-[11px] font-medium text-primary">
              {ROLE_LABEL[user.role as UserRole] ?? user.role}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={base} />} className="py-2">
          <LayoutDashboard /> Dashboard
        </DropdownMenuItem>
        {user.role !== "admin" ? (
          <DropdownMenuItem render={<Link href={`${base}/profile`} />} className="py-2">
            <Settings /> Profile Settings
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout} className="py-2">
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
