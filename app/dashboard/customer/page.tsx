import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarCheck, CalendarClock, CalendarHeart, CalendarX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { getCustomerStats } from "@/lib/api/stats"
import { requireRole } from "@/lib/core/server"
import { formatDate } from "@/lib/formatters"

export const metadata: Metadata = { title: "Dashboard" }

export default async function CustomerOverviewPage() {
  const [user, stats] = await Promise.all([requireRole("customer"), getCustomerStats()])

  return (
    <div>
      <PageHeader
        title={`Hello, ${user.name.split(" ")[0]}`}
        description="Here's how your wedding bookings are going."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Requests" value={stats.total} icon={CalendarHeart} />
        <StatCard label="Pending" value={stats.pending} icon={CalendarClock} tone="amber" />
        <StatCard label="Accepted" value={stats.accepted} icon={CalendarCheck} tone="green" />
        <StatCard label="Rejected" value={stats.rejected} icon={CalendarX} tone="red" />
      </div>

      <section className="mt-8 rounded-2xl border bg-card">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-sans text-base font-semibold">Recent requests</h2>
          <Link href="/dashboard/customer/bookings" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        {stats.recent.length ? (
          <ul className="divide-y">
            {stats.recent.map((booking) => (
              <li key={booking._id} className="flex items-center gap-3 p-4 sm:px-5">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {booking.service?.images?.[0] ? (
                    <Image src={booking.service.images[0]} alt="" fill sizes="48px" className="object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{booking.service?.serviceName ?? "Removed service"}</p>
                  <p className="text-xs text-muted-foreground">Event on {formatDate(booking.eventDate)}</p>
                </div>
                <StatusBadge status={booking.status} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">No booking requests yet.</p>
            <Button className="mt-4" render={<Link href="/services" />} nativeButton={false}>
              Explore wedding services
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
