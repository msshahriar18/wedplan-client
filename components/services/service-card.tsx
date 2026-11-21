import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Crown, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatPrice, vendorDisplayName } from "@/lib/formatters"
import type { Service } from "@/lib/types/service"

export function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  const vendor = service.vendor

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={service.images[0]}
          alt={service.serviceName}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
            {service.category}
          </span>
          {vendor?.isPremium ? (
            <span className="flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-gold-foreground">
              <Crown className="size-3" /> Featured
            </span>
          ) : null}
        </div>
        <span className="absolute right-3 bottom-3 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow">
          {formatPrice(service.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg leading-snug font-semibold">{service.serviceName}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">{service.location}</span>
        </p>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <UserAvatar src={vendor?.image} name={vendorDisplayName(vendor)} className="size-8" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{vendorDisplayName(vendor)}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {vendor?.isPremium ? (
                  <>
                    <BadgeCheck className="size-3.5 text-gold-foreground" /> Premium vendor
                  </>
                ) : (
                  "Wedding vendor"
                )}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 shrink-0 gap-1 group-hover:border-primary group-hover:text-primary"
            render={<Link href={`/services/${service._id}`} />}
            nativeButton={false}
          >
            View Details <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between border-t pt-4">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}
