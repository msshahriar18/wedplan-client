import { cn } from "@/lib/utils"

const STYLES: Record<string, string> = {
  pending: "bg-warning/15 text-[#8a5800] border-warning/30",
  approved: "bg-success/12 text-success border-success/25",
  accepted: "bg-success/12 text-success border-success/25",
  paid: "bg-success/12 text-success border-success/25",
  active: "bg-success/12 text-success border-success/25",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  blocked: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border-border",
  hidden: "bg-muted text-muted-foreground border-border",
  refunded: "bg-muted text-muted-foreground border-border",
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        STYLES[status] ?? "bg-muted text-muted-foreground",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
