import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number
  totalPages: number
  makeHref: (page: number) => string
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  const linkClass =
    "flex size-10 items-center justify-center rounded-lg border bg-card text-sm font-medium transition-colors hover:border-primary hover:text-primary"

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={makeHref(page - 1)} className={linkClass} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : null}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 ? <span className="px-1 text-muted-foreground">…</span> : null}
          <Link
            href={makeHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(linkClass, p === page && "border-primary bg-primary text-primary-foreground hover:text-primary-foreground")}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={makeHref(page + 1)} className={linkClass} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </nav>
  )
}
