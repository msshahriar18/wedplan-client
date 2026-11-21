export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled"

export type Booking = {
  _id: string
  serviceId: string
  vendorId: string
  customerId: string
  eventDate: string
  eventLocation: string
  message: string
  status: BookingStatus
  createdAt: string
  updatedAt?: string
  service?: {
    _id: string
    serviceName: string
    category: string
    images: string[]
    price: number
    location: string
  }
  vendor?: {
    _id: string
    name: string
    email?: string
    image?: string | null
    businessName?: string
    phone?: string
    isPremium?: boolean
  }
  customer?: {
    _id: string
    name: string
    email: string
    image?: string | null
    phone?: string
  }
}

export type BookingInput = {
  serviceId: string
  eventDate: string
  eventLocation: string
  message: string
}

export const BOOKING_STATUSES: BookingStatus[] = ["pending", "accepted", "rejected", "cancelled"]
