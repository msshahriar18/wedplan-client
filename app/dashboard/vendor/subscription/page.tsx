import type { Metadata } from "next"
import { Check, Crown, ShieldCheck } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { getBillingInfo } from "@/lib/api/stats"
import { FREE_SERVICE_LIMIT, PREMIUM_PRICE } from "@/lib/constants"
import { formatDate, formatDateTime, formatPrice } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { CancelSubscription } from "./_components/cancel-subscription"
import { UpgradeButton } from "./_components/upgrade-button"

export const metadata: Metadata = { title: "Subscription" }

const FREE_FEATURES = [
  `Maximum ${FREE_SERVICE_LIMIT} active services`,
  "Basic vendor dashboard",
  "Booking request management",
]

const PREMIUM_FEATURES = [
  "Unlimited active services",
  "Premium vendor badge on every listing",
  "Shown first in featured and search results",
  "All free plan features",
]

export default async function SubscriptionPage() {
  const billing = await getBillingInfo()
  const isPremium = billing.plan === "premium"
  const endsOn = billing.subscriptionExpiresAt ? formatDate(billing.subscriptionExpiresAt) : null

  return (
    <div>
      <PageHeader title="Subscription" description="Choose the plan that fits your business." />

      {isPremium ? (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gold/50 bg-gold/15 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Crown className="size-6 text-gold-foreground" />
            <div>
              <p className="font-semibold">You&apos;re a Premium vendor</p>
              <p className="text-sm text-muted-foreground">
                {billing.cancelAtPeriodEnd
                  ? `Cancelled — Premium ends on ${endsOn}.`
                  : endsOn
                    ? `Renews automatically on ${endsOn}.`
                    : "Active"}
              </p>
            </div>
          </div>
          {!billing.cancelAtPeriodEnd && endsOn ? <CancelSubscription endsOn={endsOn} /> : null}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={cn("flex flex-col rounded-2xl border bg-card p-6 sm:p-8", !isPremium && "ring-2 ring-primary/20")}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Free</h2>
            {!isPremium ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Current plan</span>
            ) : null}
          </div>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold">$0</span>
            <span className="text-muted-foreground"> / forever</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Good for getting started with a few services.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <Check className="size-4 shrink-0 text-success" /> {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#4a1020] to-primary p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-gold/20 blur-2xl" />
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <Crown className="size-6 text-gold" /> Premium
            </h2>
            {isPremium ? (
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Current plan</span>
            ) : (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">Recommended</span>
            )}
          </div>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold">${PREMIUM_PRICE}</span>
            <span className="text-white/70"> / month</span>
          </p>
          <p className="mt-2 text-sm text-white/70">For studios that want to list everything they offer.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {PREMIUM_FEATURES.map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <Check className="size-4 shrink-0 text-gold" /> {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {isPremium ? (
              <p className="flex items-center gap-2 text-sm text-white/80">
                <ShieldCheck className="size-4 text-gold" /> All Premium features are unlocked
              </p>
            ) : (
              <>
                <UpgradeButton />
                <p className="mt-3 text-center text-xs text-white/60">
                  Secure payment by Stripe. Cancel any time.
                </p>
              </>
            )}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-sans text-base font-semibold">Billing history</h2>
        {billing.transactions.length ? (
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="pl-5">Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="pr-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billing.transactions.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell className="pl-5 whitespace-nowrap">{formatDateTime(tx.createdAt)}</TableCell>
                    <TableCell className="capitalize">{tx.plan}</TableCell>
                    <TableCell>{formatPrice(tx.amount, tx.currency)}</TableCell>
                    <TableCell className="pr-5">
                      <StatusBadge status={tx.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
            No payments yet.
          </p>
        )}
      </section>
    </div>
  )
}
