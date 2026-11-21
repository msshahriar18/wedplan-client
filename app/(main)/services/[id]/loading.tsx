import { Skeleton } from "@/components/ui/skeleton"

export default function ServiceDetailsLoading() {
  return (
    <div className="container-page py-8 sm:py-12" aria-busy="true" aria-label="Loading service">
      <Skeleton className="h-4 w-32" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
        <div>
          <Skeleton className="aspect-[16/10] rounded-2xl" />
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
          <Skeleton className="mt-8 h-7 w-48" />
          <Skeleton className="mt-4 h-24" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  )
}
