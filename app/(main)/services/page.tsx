import type { Metadata } from "next"
import Link from "next/link"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { ServiceCard } from "@/components/services/service-card"
import { getServices } from "@/lib/api/services"
import { ServiceFilters, type FilterValues } from "./_components/service-filters"

export const metadata: Metadata = {
  title: "Browse Wedding Services",
  description: "Search approved wedding photographers, venues, decorators, caterers and stylists.",
}

type SearchParams = Partial<Record<keyof FilterValues | "page", string | string[]>>

const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value) ?? ""

export default async function BrowseServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const filters: FilterValues = {
    search: first(params.search),
    category: first(params.category),
    location: first(params.location),
    sort: first(params.sort),
    minPrice: first(params.minPrice),
    maxPrice: first(params.maxPrice),
  }
  const page = Math.max(Number(first(params.page)) || 1, 1)

  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => value && query.set(key, value))
  query.set("page", String(page))
  query.set("limit", "9")

  const data = await getServices(query.toString())

  const makeHref = (p: number) => {
    const next = new URLSearchParams(query)
    next.delete("limit")
    next.set("page", String(p))
    return `/services?${next}`
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="eyebrow">Curated marketplace</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">Browse Wedding Services</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every listing here is reviewed by our team. Search by name, narrow it down by category and
        city, and sort by price to find what fits your budget.
      </p>

      <div className="mt-8">
        {/* key resets the inputs when the url changes from outside, e.g. a category link */}
        <ServiceFilters key={JSON.stringify(filters)} initial={filters} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {data.total > 0
          ? `Showing ${data.services.length} of ${data.total} approved services`
          : "No services found"}
        {filters.category ? ` in ${filters.category}` : ""}
      </p>

      {data.services.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.services.map((service, i) => (
            <ServiceCard key={service._id} service={service} priority={i < 3} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-4"
          icon={SearchX}
          title="No services match your search"
          description="Try a different keyword, pick another category or clear the location filter."
          action={
            <Button variant="outline" render={<Link href="/services" />} nativeButton={false}>
              Clear filters
            </Button>
          }
        />
      )}

      <Pagination page={data.page} totalPages={data.totalPages} makeHref={makeHref} />
    </div>
  )
}
