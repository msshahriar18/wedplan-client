import { Skeleton } from "@/components/ui/skeleton"
import { ServiceCardSkeleton } from "@/components/services/service-card"

export default function ServicesLoading() {
  return (
    <div className="container-page py-10 sm:py-14" aria-busy="true" aria-label="Loading services">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-4 h-12 w-96 max-w-full" />
      <Skeleton className="mt-4 h-5 w-[32rem] max-w-full" />
      <Skeleton className="mt-8 h-24 rounded-2xl" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
