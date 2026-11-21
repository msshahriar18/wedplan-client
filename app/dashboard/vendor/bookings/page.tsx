import type { Metadata } from "next"
import { Inbox } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatusTabs } from "@/components/dashboard/status-tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { getVendorBookings } from "@/lib/api/bookings"
import { BOOKING_STATUSES } from "@/lib/types/booking"
import { BookingRequestCard } from "./_components/booking-request-card"

export const metadata: Metadata = { title: "Booking Requests" }

export default async function VendorBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const current = BOOKING_STATUSES.includes(status as never) ? status : undefined
  const all = await getVendorBookings()
  const bookings = current ? all.filter((b) => b.status === current) : all

  const count = (s: string) => all.filter((b) => b.status === s).length

  return (
    <div>
      <PageHeader
        title="Booking Requests"
        description="Requests from couples for your services. Accept or reject pending ones — this can't be changed later."
      />

      <StatusTabs
        basePath="/dashboard/vendor/bookings"
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
        <div className="grid gap-4 xl:grid-cols-2">
          {bookings.map((booking) => (
            <BookingRequestCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title={current ? `No ${current} requests` : "No booking requests yet"}
          description="When a customer requests one of your approved services, it shows up here."
        />
      )}
    </div>
  )
}
