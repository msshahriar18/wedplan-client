import Link from "next/link"
import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "./reveal"

export function VendorCta() {
  return (
    <section className="container-page pb-20 sm:pb-24">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#4a1020] px-6 py-12 text-white sm:px-12 lg:py-16">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-gold">
              <Crown className="size-4" /> For wedding businesses
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
              Grow your bookings with WedPlan
            </h2>
            <p className="mt-4 max-w-xl text-white/75">
              Start free with up to 3 active services. Go Premium for unlimited listings, a Premium
              badge and top placement in search.
            </p>
          </div>
          <div>
            <ul className="space-y-2 text-sm">
              {["Free plan, no card needed", "Manage requests from one dashboard", "Cancel Premium any time"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-gold" /> {item}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 h-12 w-full bg-gold text-base text-gold-foreground hover:bg-gold/85 sm:w-auto sm:px-8"
              render={<Link href="/sign-up" />}
              nativeButton={false}
            >
              List your services
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
