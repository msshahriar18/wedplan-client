"use server"

import { revalidatePath } from "next/cache"
import { protectedMutation } from "@/lib/core/server"
import type { Booking, BookingInput } from "@/lib/types/booking"

export const createBooking = async (data: BookingInput) => {
  const result = await protectedMutation<Booking>("/bookings", "POST", data)
  if (result.ok) revalidatePath("/dashboard/customer", "layout")
  return result
}

export const cancelBooking = async (id: string) => {
  const result = await protectedMutation<Booking>(`/bookings/${id}/cancel`, "PATCH")
  if (result.ok) revalidatePath("/dashboard/customer", "layout")
  return result
}

export const respondToBooking = async (id: string, status: "accepted" | "rejected") => {
  const result = await protectedMutation<Booking>(`/vendor/bookings/${id}`, "PATCH", { status })
  if (result.ok) revalidatePath("/dashboard/vendor", "layout")
  return result
}
