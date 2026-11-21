"use client"

import Image from "next/image"
import { useState } from "react"
import { CalendarDays, Check, Clock, Loader2, Mail, MapPin, MessageSquareText, Phone, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { respondToBooking } from "@/lib/actions/bookings"
import { formatDate, formatDateTime, formatPrice } from "@/lib/formatters"
import { notify } from "@/lib/notify"
import type { Booking } from "@/lib/types/booking"

export function BookingRequestCard({ booking }: { booking: Booking }) {
  const [loading, setLoading] = useState<"accepted" | "rejected" | null>(null)

  const respond = async (status: "accepted" | "rejected") => {
    setLoading(status)
    const result = await respondToBooking(booking._id, status)
    setLoading(null)
    if (!result.ok) {
      notify.error("Couldn't update the request", result.message)
      return
    }
    notify.success(status === "accepted" ? "Booking accepted" : "Booking rejected", `${booking.customer?.name ?? "The customer"} can see the update now.`)
  }

  return (
    <article className="rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserAvatar src={booking.customer?.image} name={booking.customer?.name} className="size-11" />
          <div>
            <p className="font-semibold">{booking.customer?.name ?? "Deleted user"}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              {booking.customer?.email ? (
                <span className="flex items-center gap-1">
                  <Mail className="size-3" /> {booking.customer.email}
                </span>
              ) : null}
              {booking.customer?.phone ? (
                <span className="flex items-center gap-1">
                  <Phone className="size-3" /> {booking.customer.phone}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
        {booking.service?.images?.[0] ? (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
            <Image src={booking.service.images[0]} alt="" fill sizes="48px" className="object-cover" />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{booking.service?.serviceName ?? "Service removed"}</p>
          <p className="text-xs text-muted-foreground">
            {booking.service?.category}
            {booking.service ? ` · ${formatPrice(booking.service.price)}` : ""}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <dt className="sr-only">Event date</dt>
          <dd>
            <span className="text-muted-foreground">Event: </span>
            <b>{formatDate(booking.eventDate)}</b>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          <dt className="sr-only">Event location</dt>
          <dd className="truncate">{booking.eventLocation}</dd>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
          <Clock className="size-4" />
          <dt className="sr-only">Requested</dt>
          <dd className="text-xs">Requested {formatDateTime(booking.createdAt)}</dd>
        </div>
      </dl>

      {booking.message ? (
        <p className="mt-4 flex gap-2 rounded-xl border border-dashed p-3 text-sm text-foreground/80">
          <MessageSquareText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-pre-line">{booking.message}</span>
        </p>
      ) : null}

      {booking.status === "pending" ? (
        <div className="mt-5 flex gap-2 border-t pt-4">
          <Button onClick={() => respond("accepted")} disabled={loading !== null} className="h-10 flex-1 sm:flex-none sm:px-5">
            {loading === "accepted" ? <Loader2 className="animate-spin" /> : <Check />} Accept
          </Button>
          <Button
            variant="outline"
            onClick={() => respond("rejected")}
            disabled={loading !== null}
            className="h-10 flex-1 text-destructive hover:text-destructive sm:flex-none sm:px-5"
          >
            {loading === "rejected" ? <Loader2 className="animate-spin" /> : <X />} Reject
          </Button>
        </div>
      ) : null}
    </article>
  )
}
