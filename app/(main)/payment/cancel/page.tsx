import type { Metadata } from "next"
import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { requireRole } from "@/lib/core/server"

export const metadata: Metadata = { title: "Payment Cancelled" }

export default async function PaymentCancelPage() {
  await requireRole("vendor")

  return (
    <div className="container-page flex justify-center py-16 sm:py-24">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-10">
        <XCircle className="mx-auto size-14 text-muted-foreground" />
        <h1 className="mt-5 text-2xl font-semibold">Checkout cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No payment was taken and your plan hasn&apos;t changed. You can upgrade whenever you&apos;re
          ready.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button variant="outline" className="h-11" render={<Link href="/dashboard/vendor" />} nativeButton={false}>
            Dashboard
          </Button>
          <Button className="h-11" render={<Link href="/dashboard/vendor/subscription" />} nativeButton={false}>
            View plans
          </Button>
        </div>
      </div>
    </div>
  )
}
