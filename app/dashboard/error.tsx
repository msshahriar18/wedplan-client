"use client"

import { RotateCcw, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" />
      </span>
      <h2 className="mt-4 text-xl font-semibold">Couldn&apos;t load this data</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {error.message && !error.digest ? error.message : "The server didn't respond as expected."}
      </p>
      <Button onClick={reset} className="mt-5 h-10 px-5">
        <RotateCcw /> Try again
      </Button>
    </div>
  )
}
