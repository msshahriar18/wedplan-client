export type Transaction = {
  _id: string
  vendorId: string
  plan: string
  amount: number
  currency: string
  stripeSessionId?: string
  stripeInvoiceId?: string
  status: "paid" | "failed" | "cancelled" | "refunded"
  createdAt: string
  subscriptionEndedAt?: string
  vendor?: {
    _id: string
    name: string
    email: string
    image?: string | null
    businessName?: string
    isPremium?: boolean
  }
}
