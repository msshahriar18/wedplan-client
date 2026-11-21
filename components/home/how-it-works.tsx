import { CalendarHeart, PartyPopper, Search } from "lucide-react"
import { SectionHeading } from "./section-heading"
import { Stagger, StaggerItem } from "./reveal"

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    text: "Browse approved services by category, city and budget. Open any listing to see photos and full details.",
  },
  {
    icon: CalendarHeart,
    title: "Request a booking",
    text: "Pick your event date, add the venue and a short note. Your request goes straight to the vendor.",
  },
  {
    icon: PartyPopper,
    title: "Get confirmed",
    text: "The vendor accepts or declines. Track every request from your dashboard and celebrate.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-[#2a1219] py-20 text-white sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title={<span className="text-white">How WedPlan Works</span>}
          description="Three simple steps from scrolling to signed-and-sorted."
          className="[&_p:last-child]:text-white/70"
        />
        <Stagger className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          <div aria-hidden className="absolute top-8 right-[16%] left-[16%] hidden h-px border-t border-dashed border-white/20 md:block" />
          {STEPS.map((step, i) => (
            <StaggerItem key={step.title} className="relative text-center">
              <span className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-gold text-gold-foreground shadow-lg">
                <step.icon className="size-7" />
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-white/70">{step.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
