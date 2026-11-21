import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  Crown,
  Info,
  Mail,
  MapPin,
  Phone,
  SearchX,
  ShieldCheck,
  Tag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { UserAvatar } from "@/components/shared/user-avatar"
import { getServiceById } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"
import { formatDate, formatPrice, vendorDisplayName } from "@/lib/formatters"
import { categoryHref } from "@/lib/constants"
import { BookingDialog } from "./_components/booking-dialog"
import { ServiceGallery } from "./_components/service-gallery"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { service } = await getServiceById(id).catch(() => ({ service: null }))
  return { title: service?.serviceName ?? "Service details" }
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params
  const session = await getSession()
  if (!session?.user) redirect(`/sign-in?redirect=/services/${id}`)

  const { service, message } = await getServiceById(id)

  if (!service) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={SearchX}
          title="We couldn't find this service"
          description={`${message}. It may have been removed, is waiting for approval, or the link is wrong.`}
          action={
            <Button render={<Link href="/services" />} nativeButton={false}>
              Browse other services
            </Button>
          }
        />
      </div>
    )
  }

  const user = session.user
  const vendor = service.vendor
  const isOwner = user.id === service.vendorId

  let bookingBlock: React.ReactNode
  if (user.role === "customer") {
    bookingBlock = (
      <BookingDialog
        serviceId={service._id}
        serviceName={service.serviceName}
        defaultLocation={service.location}
      />
    )
  } else {
    const note = isOwner
      ? "This is your own service. Vendors can't book their own listings."
      : user.role === "vendor"
        ? "You're signed in as a vendor. Only customer accounts can send booking requests."
        : "Admin accounts can't submit booking requests."
    bookingBlock = (
      <div className="flex gap-2.5 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <div>
          <p>{note}</p>
          {isOwner ? (
            <Link
              href={`/dashboard/vendor/services/${service._id}/edit`}
              className="mt-1 inline-block font-medium text-primary hover:underline"
            >
              Edit this service
            </Link>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to services
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <ServiceGallery images={service.images} name={service.serviceName} />

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">About this service</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-line text-foreground/80">
              {service.description}
            </p>
          </section>

          <section className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Reviewed listing", text: "Checked by our team before going live" },
              { icon: CalendarCheck, title: "Date based requests", text: "Vendor confirms availability for your date" },
              { icon: Tag, title: "Clear pricing", text: "Starting price shown upfront" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border bg-card p-4">
                <item.icon className="size-5 text-primary" />
                <p className="mt-2 text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Link
              href={categoryHref(service.category)}
              className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/70"
            >
              {service.category}
            </Link>
            <h1 className="mt-4 text-2xl leading-tight font-semibold sm:text-3xl">
              {service.serviceName}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" /> {service.location}
            </p>

            <div className="mt-5 flex items-end gap-2 border-y py-5">
              <span className="font-heading text-4xl font-semibold text-primary">
                {formatPrice(service.price)}
              </span>
              <span className="pb-1 text-sm text-muted-foreground">starting price</span>
            </div>

            <div className="mt-5">{bookingBlock}</div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Listed on {formatDate(service.createdAt)}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border bg-card p-6">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Offered by
            </p>
            <div className="mt-4 flex items-center gap-3">
              <UserAvatar src={vendor?.image} name={vendorDisplayName(vendor)} className="size-12" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-semibold">
                  <span className="truncate">{vendorDisplayName(vendor)}</span>
                  {vendor?.isPremium ? <BadgeCheck className="size-4 shrink-0 text-gold-foreground" /> : null}
                </p>
                {vendor?.businessName ? (
                  <p className="truncate text-sm text-muted-foreground">by {vendor.name}</p>
                ) : null}
              </div>
            </div>
            {vendor?.isPremium ? (
              <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-gold/20 px-3 py-2 text-xs font-medium text-gold-foreground">
                <Crown className="size-3.5" /> Premium vendor on WedPlan
              </p>
            ) : null}
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {vendor?.email ? (
                <li className="flex items-center gap-2">
                  <Mail className="size-4" /> {vendor.email}
                </li>
              ) : null}
              {vendor?.phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="size-4" /> {vendor.phone}
                </li>
              ) : null}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
