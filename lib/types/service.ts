export type ServiceStatus = "pending" | "approved" | "rejected"

export type VendorInfo = {
  _id: string
  name: string
  email?: string
  image?: string | null
  businessName?: string
  phone?: string
  isPremium?: boolean
}

export type Service = {
  _id: string
  vendorId: string
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  status: ServiceStatus
  isAvailable: boolean
  createdAt: string
  updatedAt?: string
  vendor?: VendorInfo
}

export type ServiceInput = {
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
}

export type ServiceListResponse = {
  services: Service[]
  total: number
  page: number
  totalPages: number
}

export type CategoryCount = { name: string; count: number }
