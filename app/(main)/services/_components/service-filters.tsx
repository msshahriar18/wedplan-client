"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, MapPin, Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CATEGORY_NAMES, SORT_OPTIONS } from "@/lib/constants"

export type FilterValues = {
  search: string
  category: string
  location: string
  sort: string
  minPrice: string
  maxPrice: string
}

const ALL = "all"

export function ServiceFilters({ initial }: { initial: FilterValues }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState(initial)
  const [showMore, setShowMore] = useState(Boolean(initial.minPrice || initial.maxPrice))

  const apply = (next: FilterValues) => {
    const params = new URLSearchParams()
    Object.entries(next).forEach(([key, value]) => {
      const clean = value.trim()
      if (clean && clean !== ALL && !(key === "sort" && clean === "recommended")) {
        params.set(key, clean)
      }
    })
    startTransition(() => {
      router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false })
    })
  }

  const setAndApply = (key: keyof FilterValues, value: string) => {
    const next = { ...values, [key]: value }
    setValues(next)
    apply(next)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    apply(values)
  }

  const reset = () => {
    const empty = { search: "", category: "", location: "", sort: "", minPrice: "", maxPrice: "" }
    setValues(empty)
    apply(empty)
  }

  const hasFilters = Object.values(initial).some(Boolean)

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-3 shadow-sm sm:p-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={values.search}
            onChange={(e) => setValues({ ...values, search: e.target.value })}
            placeholder="Search by name, vendor or keyword"
            aria-label="Search services"
            className="h-11 pl-9"
          />
        </div>

        <Select
          value={values.category || ALL}
          onValueChange={(value) => setAndApply("category", value === ALL ? "" : String(value))}
          items={[{ value: ALL, label: "All categories" }, ...CATEGORY_NAMES.map((c) => ({ value: c, label: c }))]}
        >
          <SelectTrigger className="h-11 w-full" aria-label="Category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {CATEGORY_NAMES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={values.location}
            onChange={(e) => setValues({ ...values, location: e.target.value })}
            placeholder="City or area"
            aria-label="Location"
            className="h-11 pl-9"
          />
        </div>

        <Select
          value={values.sort || "recommended"}
          onValueChange={(value) => setAndApply("sort", String(value))}
          items={SORT_OPTIONS}
        >
          <SelectTrigger className="h-11 w-full" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" className="h-11 px-6" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : <Search />}
          Search
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
        >
          <SlidersHorizontal className="size-3.5" />
          {showMore ? "Hide price range" : "Price range"}
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <X className="size-3.5" /> Clear all filters
          </button>
        ) : null}
      </div>

      {showMore ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={values.minPrice}
            onChange={(e) => setValues({ ...values, minPrice: e.target.value })}
            placeholder="Min $"
            aria-label="Minimum price"
            className="h-9 w-28"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={values.maxPrice}
            onChange={(e) => setValues({ ...values, maxPrice: e.target.value })}
            placeholder="Max $"
            aria-label="Maximum price"
            className="h-9 w-28"
          />
          <Button type="submit" variant="secondary" size="sm" className="h-9 px-4">
            Apply
          </Button>
        </div>
      ) : null}
    </form>
  )
}
