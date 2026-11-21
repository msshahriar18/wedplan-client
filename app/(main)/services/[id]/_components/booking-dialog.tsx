"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarHeart, CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/shared/field"
import { createBooking } from "@/lib/actions/bookings"
import { notify } from "@/lib/notify"

const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

export function BookingDialog({
  serviceId,
  serviceName,
  defaultLocation,
}: {
  serviceId: string
  serviceName: string
  defaultLocation: string
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ eventDate: "", eventLocation: defaultLocation, message: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.eventDate) next.eventDate = "Pick your event date"
    else if (form.eventDate < tomorrow()) next.eventDate = "Event date must be in the future"
    if (form.eventLocation.trim().length < 3) next.eventLocation = "Where is the event happening?"
    if (form.message.length > 1000) next.message = "Keep the message under 1000 characters"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    const result = await createBooking({ serviceId, ...form })
    setLoading(false)

    if (!result.ok) {
      notify.error("Booking request failed", result.message)
      return
    }
    notify.success("Booking request sent", "The vendor will review it soon.")
    setDone(true)
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value && done) {
      setDone(false)
      setForm({ eventDate: "", eventLocation: defaultLocation, message: "" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className="h-12 w-full text-base" />}>
        <CalendarHeart /> Request Booking
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {done ? (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 className="size-14 text-success" />
            <DialogTitle className="mt-4 text-xl">Request sent!</DialogTitle>
            <DialogDescription className="mt-2">
              Your request for <b>{serviceName}</b> is pending. You&apos;ll see the vendor&apos;s
              answer in your dashboard.
            </DialogDescription>
            <div className="mt-6 flex w-full gap-2">
              <Button variant="outline" className="h-10 flex-1" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
              <Button
                className="h-10 flex-1"
                render={<Link href="/dashboard/customer/bookings" />}
                nativeButton={false}
              >
                View my bookings
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <DialogHeader>
              <DialogTitle className="text-xl">Request a booking</DialogTitle>
              <DialogDescription>
                Tell the vendor about your event. Nothing is charged now — they&apos;ll accept or
                decline your request.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 flex flex-col gap-4">
              <Field label="Event date" htmlFor="eventDate" error={errors.eventDate} required>
                <Input
                  id="eventDate"
                  type="date"
                  min={tomorrow()}
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  aria-invalid={Boolean(errors.eventDate)}
                  className="h-11"
                />
              </Field>
              <Field label="Event location" htmlFor="eventLocation" error={errors.eventLocation} required>
                <Input
                  id="eventLocation"
                  value={form.eventLocation}
                  onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
                  placeholder="Venue name, area, city"
                  aria-invalid={Boolean(errors.eventLocation)}
                  className="h-11"
                />
              </Field>
              <Field
                label="Message for the vendor"
                htmlFor="message"
                error={errors.message}
                hint="Guest count, timing, special requests…"
              >
                <Textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Hi! We're expecting around 250 guests and the ceremony starts at 5pm."
                />
              </Field>
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit" disabled={loading} className="h-11 w-full sm:w-auto sm:px-6">
                {loading ? <Loader2 className="animate-spin" /> : null}
                {loading ? "Sending request..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
