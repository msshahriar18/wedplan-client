"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CircleAlert, Clock, Crown, Loader2 } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { getPaymentStatus, type PaymentStatus } from "@/lib/actions/payments"
import { formatDate, formatDateTime, formatPrice } from "@/lib/formatters"

const MAX_TRIES = 8

export function PaymentStatusCard({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<PaymentStatus | null>(null)
  const [error, setError] = useState("")
  const [gaveUp, setGaveUp] = useState(false)

  useEffect(() => {
    let cancelled = false
    let tries = 0
    let timer: ReturnType<typeof setTimeout>

    // the webhook can land a few seconds after stripe redirects back, so poll a little
    const check = async () => {
      tries += 1
      const result = await getPaymentStatus(sessionId)
      if (cancelled) return

      if (!result.ok) {
        setError(result.message)
        return
      }
      setStatus(result.data)
      if (result.data.status === "paid") {
        router.refresh()
        return
      }
      if (result.data.status === "processing" && tries < MAX_TRIES) {
        timer = setTimeout(check, 2500)
      } else if (result.data.status === "processing") {
        setGaveUp(true)
      }
    }
    check()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [sessionId, router])

  if (error) {
    return (
      <Card>
        <CircleAlert className="mx-auto size-14 text-destructive" />
        <h1 className="mt-5 text-2xl font-semibold">We couldn&apos;t verify this payment</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-6 h-11 w-full" render={<Link href="/dashboard/vendor/subscription" />} nativeButton={false}>
          Back to subscription
        </Button>
      </Card>
    )
  }

  if (!status || status.status === "processing") {
    return (
      <Card>
        {gaveUp ? <Clock className="mx-auto size-14 text-warning" /> : <Loader2 className="mx-auto size-14 animate-spin text-primary" />}
        <h1 className="mt-5 text-2xl font-semibold">
          {gaveUp ? "Payment received, activation pending" : "Confirming your payment..."}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {gaveUp
            ? "Stripe is still sending us the confirmation. Your Premium plan will switch on automatically in a moment — you can safely leave this page."
            : "Waiting for Stripe to confirm the payment. This usually takes a few seconds."}
        </p>
        {gaveUp ? (
          <Button className="mt-6 h-11 w-full" render={<Link href="/dashboard/vendor/subscription" />} nativeButton={false}>
            Go to subscription
          </Button>
        ) : null}
      </Card>
    )
  }

  if (status.status !== "paid") {
    return (
      <Card>
        <CircleAlert className="mx-auto size-14 text-destructive" />
        <h1 className="mt-5 text-2xl font-semibold">Payment was not completed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {status.status === "expired" ? "This checkout session expired." : "The payment failed."} You
          haven&apos;t been charged for Premium.
        </p>
        <Button className="mt-6 h-11 w-full" render={<Link href="/dashboard/vendor/subscription" />} nativeButton={false}>
          Try again
        </Button>
      </Card>
    )
  }

  return (
    <Card>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold text-gold-foreground"
      >
        <Crown className="size-8" />
      </motion.div>
      <p className="eyebrow mt-6">Payment successful</p>
      <h1 className="mt-2 text-3xl font-semibold">Welcome to Premium!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your account is upgraded. You can now publish unlimited services and your listings carry the
        Premium badge.
      </p>
      <dl className="mt-6 divide-y rounded-xl border text-left text-sm">
        <Row label="Plan" value="Premium (monthly)" />
        {status.amount !== undefined ? <Row label="Amount paid" value={formatPrice(status.amount, status.currency)} /> : null}
        {status.createdAt ? <Row label="Date" value={formatDateTime(status.createdAt)} /> : null}
        {status.subscriptionExpiresAt ? <Row label="Next renewal" value={formatDate(status.subscriptionExpiresAt)} /> : null}
      </dl>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button variant="outline" className="h-11" render={<Link href="/dashboard/vendor" />} nativeButton={false}>
          Dashboard
        </Button>
        <Button className="h-11" render={<Link href="/dashboard/vendor/services/new" />} nativeButton={false}>
          Add a service
        </Button>
      </div>
    </Card>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-10">{children}</div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
