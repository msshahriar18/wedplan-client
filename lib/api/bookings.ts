import "server-only"
import { authFetch } from "@/lib/core/server"
import type { Booking } from "@/lib/types/booking"

export const getMyBookings = (status?: string) =>
  authFetch<Booking[]>(`/bookings/my${status ? `?status=${status}` : ""}`)

export const getVendorBookings = (status?: string) =>
  authFetch<Booking[]>(`/vendor/bookings${status ? `?status=${status}` : ""}`)
