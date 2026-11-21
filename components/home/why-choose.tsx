import Image from "next/image"
import { BadgeCheck, CalendarCheck2, LayoutDashboard, Wallet } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "./reveal"

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Every vendor is reviewed",
    text: "Our team checks each listing before it goes live, so you only see real, active services.",
  },
  {
    icon: Wallet,
    title: "Prices you can compare",
    text: "Starting prices are shown upfront. Filter by budget and sort by price in one click.",
  },
  {
    icon: CalendarCheck2,
    title: "Requests for your exact date",
    text: "Send a booking request with your date and venue. No more chasing vendors on the phone.",
  },
  {
    icon: LayoutDashboard,
    title: "Track everything in one place",
    text: "See which requests are pending, accepted or rejected from your own dashboard.",
  },
]

export function WhyChoose() {
  return (
    <section className="container-page grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
      <Reveal className="relative">
        <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem]">
          <Image
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80"
            alt="Couple walking together after their ceremony"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute -right-3 -bottom-6 max-w-[15rem] rounded-2xl bg-primary p-5 text-primary-foreground shadow-xl sm:-right-6">
          <p className="font-heading text-3xl font-semibold text-gold">3 min</p>
          <p className="mt-1 text-sm text-white/80">is all it takes to send your first booking request</p>
        </div>
      </Reveal>

      <div>
        <Reveal>
          <p className="eyebrow">Why WedPlan</p>
          <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
            Why Choose <span className="text-primary italic">WedPlan?</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Wedding planning usually means a dozen Facebook pages, unanswered calls and prices that
            change every time you ask. We built WedPlan to fix that for couples and vendors.
          </p>
        </Reveal>
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <StaggerItem key={benefit.title} className="rounded-2xl border bg-card p-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <benefit.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-sans text-base font-semibold">{benefit.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{benefit.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
