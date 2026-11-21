import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireRole } from "@/lib/core/server"
import { PaymentStatusCard } from "./_components/payment-status-card"

export const metadata: Metadata = { title: "Payment Successful" }

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  await requireRole("vendor")
  if (!session_id) notFound()

  return (
    <div className="container-page flex justify-center py-16 sm:py-24">
      <PaymentStatusCard sessionId={session_id} />
    </div>
  )
}
