"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, Eye, MapPin, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { cancelBooking } from "@/lib/actions/bookings"
import { formatDate, formatDateTime, formatPrice, vendorDisplayName } from "@/lib/formatters"
import { notify } from "@/lib/notify"
import type { Booking } from "@/lib/types/booking"

const STATUS_NOTE: Record<string, string> = {
  pending: "Waiting for the vendor to respond.",
  accepted: "The vendor accepted your request. They'll reach out to finalize details.",
  rejected: "The vendor couldn't take this booking. Try another date or vendor.",
  cancelled: "You cancelled this request.",
}

function BookingDetails({ booking }: { booking: Booking }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" className="h-9" />}>
        <Eye /> Details
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{booking.service?.serviceName ?? "Booking details"}</DialogTitle>
          <DialogDescription>{STATUS_NOTE[booking.status]}</DialogDescription>
        </DialogHeader>
        <dl className="mt-2 divide-y text-sm">
          {[
            ["Status", <StatusBadge key="s" status={booking.status} />],
            ["Category", booking.service?.category ?? "—"],
            ["Price", booking.service ? formatPrice(booking.service.price) : "—"],
            ["Vendor", vendorDisplayName(booking.vendor)],
            ["Vendor email", booking.vendor?.email ?? "—"],
            ["Event date", formatDate(booking.eventDate)],
            ["Event location", booking.eventLocation],
            ["Requested on", formatDateTime(booking.createdAt)],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        {booking.message ? (
          <div className="rounded-xl bg-muted p-3 text-sm">
            <p className="text-xs font-medium text-muted-foreground">Your message</p>
            <p className="mt-1 whitespace-pre-line">{booking.message}</p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export function MyBookingCard({ booking }: { booking: Booking }) {
  const handleCancel = async () => {
    const result = await cancelBooking(booking._id)
    if (!result.ok) {
      notify.error("Couldn't cancel", result.message)
      return false
    }
    notify.success("Booking request cancelled")
  }

  return (
    <article className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:p-5">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:aspect-square sm:w-32">
        {booking.service?.images?.[0] ? (
          <Image src={booking.service.images[0]} alt="" fill sizes="(min-width: 640px) 128px, 100vw" className="object-cover" />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            {booking.service ? (
              <Link href={`/services/${booking.serviceId}`} className="line-clamp-1 font-semibold hover:text-primary">
                {booking.service.serviceName}
              </Link>
            ) : (
              <p className="font-semibold text-muted-foreground">Service no longer available</p>
            )}
            <div className="mt-1 flex items-center gap-2">
              <UserAvatar src={booking.vendor?.image} name={vendorDisplayName(booking.vendor)} className="size-5" />
              <span className="truncate text-sm text-muted-foreground">{vendorDisplayName(booking.vendor)}</span>
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-primary" /> {formatDate(booking.eventDate)}
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="size-4 shrink-0 text-primary" /> <span className="truncate">{booking.eventLocation}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:col-span-2">
            <Clock className="size-3.5" /> Requested {formatDateTime(booking.createdAt)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 sm:mt-auto sm:pt-3">
          <BookingDetails booking={booking} />
          {booking.status === "pending" ? (
            <ConfirmDialog
              trigger={
                <Button variant="outline" size="sm" className="h-9 text-destructive hover:text-destructive">
                  <XCircle /> Cancel request
                </Button>
              }
              title="Cancel this booking request?"
              description="The vendor will no longer see this as an active request. You can send a new one later."
              confirmLabel="Yes, cancel it"
              destructive
              onConfirm={handleCancel}
            />
          ) : null}
        </div>
      </div>
    </article>
  )
}
