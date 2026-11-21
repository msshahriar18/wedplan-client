import type { Metadata } from "next"
import Link from "next/link"
import { Crown, LayoutGrid, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { getVendorServices } from "@/lib/api/services"
import { requireRole } from "@/lib/core/server"
import { FREE_SERVICE_LIMIT } from "@/lib/constants"
import { isPremiumActive } from "@/lib/types/user"
import { ServicesTable } from "./_components/services-table"

export const metadata: Metadata = { title: "My Services" }

export default async function MyServicesPage() {
  const [user, services] = await Promise.all([requireRole("vendor"), getVendorServices()])
  const isPremium = isPremiumActive(user)
  const activeCount = services.filter((s) => s.isAvailable && s.status !== "rejected").length
  const counts = {
    pending: services.filter((s) => s.status === "pending").length,
    approved: services.filter((s) => s.status === "approved").length,
    rejected: services.filter((s) => s.status === "rejected").length,
  }

  return (
    <div>
      <PageHeader
        title="My Services"
        description="Manage your listings, check approval status and pause services when you're fully booked."
        action={
          <Button className="h-10 px-4" render={<Link href="/dashboard/vendor/services/new" />} nativeButton={false}>
            <Plus /> Add Service
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border bg-card px-3 py-1">
            Approved <b className="ml-1">{counts.approved}</b>
          </span>
          <span className="rounded-full border bg-card px-3 py-1">
            Pending <b className="ml-1">{counts.pending}</b>
          </span>
          <span className="rounded-full border bg-card px-3 py-1">
            Rejected <b className="ml-1">{counts.rejected}</b>
          </span>
        </div>
        {isPremium ? (
          <p className="flex items-center gap-1.5 text-sm font-medium text-gold-foreground">
            <Crown className="size-4" /> Premium · unlimited active services
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Free plan: <b className="text-foreground">{activeCount}</b> of {FREE_SERVICE_LIMIT} active
            services used ·{" "}
            <Link href="/dashboard/vendor/subscription" className="font-medium text-primary hover:underline">
              Upgrade
            </Link>
          </p>
        )}
      </div>

      {counts.rejected > 0 ? (
        <p className="mb-4 rounded-xl bg-destructive/5 p-3 text-sm text-destructive">
          Rejected services are hidden from customers. Edit them to fix the issue and they&apos;ll go
          back for review.
        </p>
      ) : null}

      {services.length ? (
        <ServicesTable services={services} />
      ) : (
        <EmptyState
          icon={LayoutGrid}
          title="No services yet"
          description="Add your first service so couples can find you. It goes live once an admin approves it."
          action={
            <Button render={<Link href="/dashboard/vendor/services/new" />} nativeButton={false}>
              <Plus /> Add your first service
            </Button>
          }
        />
      )}
    </div>
  )
}
