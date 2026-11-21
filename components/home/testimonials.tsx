import { Quote, Star } from "lucide-react"
import { UserAvatar } from "@/components/shared/user-avatar"
import { SectionHeading } from "./section-heading"
import { Stagger, StaggerItem } from "./reveal"

const TESTIMONIALS = [
  {
    name: "Tasnia & Rafi",
    place: "Dhaka · Married March 2026",
    text: "We found our photographer and decorator in the same evening. Seeing every request status in one dashboard saved us so many phone calls.",
  },
  {
    name: "Mehnaz & Arif",
    place: "Chattogram · Married January 2026",
    text: "Filtering by city and sorting by price made it easy to stay on budget. The caterer we booked was amazing and replied the same day.",
  },
  {
    name: "Sadia Rahman",
    place: "Makeup artist · WedPlan vendor",
    text: "As a vendor I get proper requests with the date and venue already filled in. Upgrading to Premium was worth it for the extra listings.",
  },
]

export function Testimonials() {
  return (
    <section className="container-page py-20 sm:py-24">
      <SectionHeading
        eyebrow="Love notes"
        title="Stories From Happy Couples"
        description="A few words from people who planned their day with WedPlan."
      />
      <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <StaggerItem key={item.name} className="relative flex flex-col rounded-2xl border bg-card p-6">
            <Quote className="size-8 text-primary/20" />
            <div className="mt-3 flex gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">&ldquo;{item.text}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3 border-t pt-5">
              <UserAvatar name={item.name} className="size-10" />
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.place}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
