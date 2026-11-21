import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const TONES = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-gold/25 text-gold-foreground",
  green: "bg-success/12 text-success",
  amber: "bg-warning/15 text-[#9a6200]",
  red: "bg-destructive/10 text-destructive",
  slate: "bg-muted text-muted-foreground",
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  tone?: keyof typeof TONES
  hint?: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex size-10 items-center justify-center rounded-xl", TONES[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 font-heading text-3xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
