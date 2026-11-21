import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { LayoutGrid } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { getAdminServices } from "@/lib/api/admin"
import { CATEGORY_NAMES } from "@/lib/constants"
import { formatDate, formatPrice, vendorDisplayName } from "@/lib/formatters"
import { ReviewActions } from "./_components/review-actions"

export const metadata: Metadata = { title: "Manage Services" }

export default async function ManageServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; category?: string }>
}) {
  const params = await searchParams
  const services = await getAdminServices(params)
  const pending = services.filter((s) => s.status === "pending").length

  return (
    <div>
      <PageHeader
        title="Manage Services"
        description="Review new submissions and keep the marketplace clean. Only approved and available services are public."
      />
      <FilterBar
        key={JSON.stringify(params)}
        placeholder="Search by service, vendor or location"
        initial={{ search: params.search, status: params.status, category: params.category }}
        selects={[
          {
            name: "status",
            label: "All statuses",
            options: [
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ],
          },
          {
            name: "category",
            label: "All categories",
            options: CATEGORY_NAMES.map((c) => ({ value: c, label: c })),
          },
        ]}
      />

      <p className="mb-3 text-sm text-muted-foreground">
        {services.length} services{pending ? ` · ${pending} waiting for review` : ""}
      </p>

      {services.length ? (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-5">Service</TableHead>
                <TableHead className="hidden xl:table-cell">Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={service.images[0]} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        {service.status === "approved" && service.isAvailable ? (
                          <Link href={`/services/${service._id}`} className="block max-w-[14rem] truncate font-medium hover:text-primary">
                            {service.serviceName}
                          </Link>
                        ) : (
                          <p className="max-w-[14rem] truncate font-medium">{service.serviceName}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {service.category} · {service.location}
                        </p>
                        <p className="text-xs text-muted-foreground xl:hidden">
                          by {vendorDisplayName(service.vendor)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {formatDate(service.createdAt)}
                          {!service.isAvailable ? " · paused by vendor" : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <p className="max-w-[10rem] truncate text-sm font-medium">{vendorDisplayName(service.vendor)}</p>
                    <p className="max-w-[10rem] truncate text-xs text-muted-foreground">{service.vendor?.email}</p>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(service.price)}</TableCell>
                  <TableCell>
                    <StatusBadge status={service.status} />
                  </TableCell>
                  <TableCell className="pr-5">
                    <ReviewActions service={service} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState icon={LayoutGrid} title="No services found" description="Nothing matches these filters right now." />
      )}
    </div>
  )
}
