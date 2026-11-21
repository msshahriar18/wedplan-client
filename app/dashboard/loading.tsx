import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="mt-6 h-72 rounded-2xl" />
    </div>
  )
}
