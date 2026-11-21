"use client"

import { useEffect } from "react"
import { RotateCcw, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-7" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t load this page. Check your connection and try again.
      </p>
      <Button onClick={reset} className="mt-6 h-10 px-5">
        <RotateCcw /> Try again
      </Button>
    </div>
  )
}
