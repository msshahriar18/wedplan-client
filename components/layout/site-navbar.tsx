"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Menu, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Logo } from "@/components/shared/logo"
import { UserAvatar } from "@/components/shared/user-avatar"
import { UserMenu, useLogout } from "@/components/layout/user-menu"
import { useSession } from "@/lib/auth-client"
import { dashboardPath } from "@/lib/types/user"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
]

export function SiteNavbar() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const [open, setOpen] = useState(false)
  const logout = useLogout()
  const user = session?.user

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-secondary text-primary"
                  : "text-foreground/75 hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <Skeleton className="h-10 w-32 rounded-full" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button variant="ghost" className="h-10 px-4" render={<Link href="/sign-in" />} nativeButton={false}>
                Sign In
              </Button>
              <Button className="h-10 px-5" render={<Link href="/sign-up" />} nativeButton={false}>
                Sign Up
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="outline" size="icon-lg" className="md:hidden" />}
            aria-label="Open menu"
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-sm p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="border-b p-5">
              <Logo />
            </div>

            {user ? (
              <div className="flex items-center gap-3 border-b p-5">
                <UserAvatar src={user.image} name={user.name} className="size-11" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : null}

            <nav className="flex flex-col gap-1 p-3" onClick={() => setOpen(false)}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(link.href) ? "bg-secondary text-primary" : "hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href={dashboardPath(user.role)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                  {user.role !== "admin" ? (
                    <Link
                      href={`${dashboardPath(user.role)}/profile`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                      <Settings className="size-4" /> Profile Settings
                    </Link>
                  ) : null}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" /> Logout
                  </button>
                </>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-10" render={<Link href="/sign-in" />} nativeButton={false}>
                    Sign In
                  </Button>
                  <Button className="h-10" render={<Link href="/sign-up" />} nativeButton={false}>
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
