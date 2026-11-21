import Link from "next/link"
import { ArrowRight, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { ServiceCard } from "@/components/services/service-card"
import type { Service } from "@/lib/types/service"
import { Reveal, Stagger, StaggerItem } from "./reveal"

export function FeaturedServices({ services }: { services: Service[] }) {
  return (
    <section className="container-page py-20 sm:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Handpicked for you</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Featured Wedding Services</h2>
          <p className="mt-4 text-muted-foreground">
            Approved, available services from vendors couples love — Premium partners first.
          </p>
        </Reveal>
        <Button variant="outline" className="h-11 w-fit px-5" render={<Link href="/services" />} nativeButton={false}>
          View all services <ArrowRight />
        </Button>
      </div>

      {services.length ? (
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service._id}>
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState
          className="mt-10"
          icon={Store}
          title="New services are on the way"
          description="Vendors are setting up their listings. Check back soon."
        />
      )}
    </section>
  )
}
