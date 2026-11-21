import type { Metadata } from "next"
import Link from "next/link"
import { CalendarCheck, CalendarClock, Crown, LayoutGrid, Plus, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { getVendorStats } from "@/lib/api/dashboard"
import { requireRole } from "@/lib/core/server"
import { formatDate } from "@/lib/formatters"

export const metadata: Metadata = { title: "Vendor Dashboard" }

export default async function VendorOverviewPage() {
  const [user, stats] = await Promise.all([requireRole("vendor"), getVendorStats()])
  const isPremium = stats.plan === "premium"
  const usage = Math.min((stats.activeServices / stats.freeLimit) * 100, 100)

  return (
    <div>
      <PageHeader
        title={user.businessName || user.name}
        description="Your services and booking requests at a glance."
        action={
          <Button className="h-10 px-4" render={<Link href="/dashboard/vendor/services/new" />} nativeButton={false}>
            <Plus /> Add Service
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Services" value={stats.totalServices} icon={LayoutGrid} hint={`${stats.pendingServices} waiting for approval`} />
        <StatCard label="Active Services" value={stats.activeServices} icon={Zap} tone="green" hint="Available and not rejected" />
        <StatCard label="Pending Requests" value={stats.pendingBookings} icon={CalendarClock} tone="amber" />
        <StatCard label="Accepted Bookings" value={stats.acceptedBookings} icon={CalendarCheck} tone="green" />
        <StatCard
          label="Current Plan"
          value={isPremium ? "Premium" : "Free"}
          icon={Crown}
          tone="gold"
          hint={isPremium && stats.subscriptionExpiresAt ? `Renews ${formatDate(stats.subscriptionExpiresAt)}` : `${stats.freeLimit} active services max`}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-sans text-base font-semibold">Plan usage</h2>
          {isPremium ? (
            <p className="mt-3 text-sm text-muted-foreground">
              You&apos;re on <b className="text-foreground">Premium</b> — publish as many services as you
              like. Your listings also show a Premium badge and appear first in search.
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                {stats.activeServices} of {stats.freeLimit} active services used on the free plan.
              </p>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usage}%` }} />
              </div>
              <Button variant="outline" className="mt-5 h-10" render={<Link href="/dashboard/vendor/subscription" />} nativeButton={false}>
                <Crown /> Upgrade to Premium
              </Button>
            </>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-sans text-base font-semibold">Next steps</h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Pending booking requests</span>
              <Link href="/dashboard/vendor/bookings?status=pending" className="font-medium text-primary hover:underline">
                Review {stats.pendingBookings}
              </Link>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Services waiting for approval</span>
              <Link href="/dashboard/vendor/services" className="font-medium text-primary hover:underline">
                {stats.pendingServices} pending
              </Link>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Keep your profile up to date</span>
              <Link href="/dashboard/vendor/profile" className="font-medium text-primary hover:underline">
                Edit profile
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
