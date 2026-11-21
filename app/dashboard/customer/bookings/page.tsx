import type { Metadata } from "next"
import Link from "next/link"
import { CalendarHeart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatusTabs } from "@/components/dashboard/status-tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { getMyBookings } from "@/lib/api/bookings"
import { BOOKING_STATUSES } from "@/lib/types/booking"
import { MyBookingCard } from "./_components/my-booking-card"

export const metadata: Metadata = { title: "My Bookings" }

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const current = BOOKING_STATUSES.includes(status as never) ? status : undefined
  const all = await getMyBookings()
  const bookings = current ? all.filter((b) => b.status === current) : all
  const count = (s: string) => all.filter((b) => b.status === s).length

  return (
    <div>
      <PageHeader
        title="My Bookings"
        description="Track every request you've sent. Pending requests can be cancelled any time."
        action={
          <Button className="h-10 px-4" render={<Link href="/services" />} nativeButton={false}>
            Find more vendors
          </Button>
        }
      />

      <StatusTabs
        basePath="/dashboard/customer/bookings"
        current={current}
        options={[
          { value: "", label: "All", count: all.length },
          { value: "pending", label: "Pending", count: count("pending") },
          { value: "accepted", label: "Accepted", count: count("accepted") },
          { value: "rejected", label: "Rejected", count: count("rejected") },
          { value: "cancelled", label: "Cancelled", count: count("cancelled") },
        ]}
      />

      {bookings.length ? (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <MyBookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarHeart}
          title={current ? `No ${current} bookings` : "You haven't booked anything yet"}
          description="Browse services, open one you like and send a booking request for your date."
          action={
            <Button render={<Link href="/services" />} nativeButton={false}>
              Browse services
            </Button>
          }
        />
      )}
    </div>
  )
}
