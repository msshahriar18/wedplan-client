import Link from "next/link"
import { cn } from "@/lib/utils"

export function StatusTabs({
  basePath,
  current,
  options,
}: {
  basePath: string
  current?: string
  options: { value: string; label: string; count?: number }[]
}) {
  return (
    <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border bg-card p-1">
      {options.map((option) => {
        const active = (current || "") === option.value
        return (
          <Link
            key={option.value || "all"}
            href={option.value ? `${basePath}?status=${option.value}` : basePath}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {option.label}
            {option.count !== undefined ? (
              <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-white/20" : "bg-muted")}>
                {option.count}
              </span>
            ) : null}
          </Link>
        )
      })}
    </div>
  )
}
