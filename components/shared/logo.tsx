import Link from "next/link"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="WedPlan home" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Heart className="size-5 fill-current" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-xl font-semibold",
            light ? "text-white" : "text-foreground"
          )}
        >
          WedPlan
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium tracking-[0.18em] uppercase",
            light ? "text-white/60" : "text-muted-foreground"
          )}
        >
          Wedding marketplace
        </span>
      </span>
    </Link>
  )
}
