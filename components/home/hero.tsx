"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"

const STATS = [
  { value: "6", label: "Service categories" },
  { value: "100%", label: "Admin-reviewed listings" },
  { value: "Live", label: "Booking status tracking" },
]

export function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section className="relative isolate overflow-hidden bg-[#22090f]">
      <Image
        src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=2000&q=80"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-45"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#22090f] via-[#22090f]/85 to-[#22090f]/30" />

      <div className="container-page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr] lg:py-32">
        <div className="text-white">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold"
          >
            <Sparkles className="size-3.5" /> Trusted by couples and wedding pros
          </motion.p>
          <motion.h1
            {...rise(0.1)}
            className="mt-6 text-4xl leading-[1.1] font-semibold sm:text-6xl lg:text-[4.2rem]"
          >
            Plan your <span className="text-gold italic">dream wedding</span> without the chaos
          </motion.h1>
          <motion.p {...rise(0.2)} className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Find photographers, venues, decorators, caterers and stylists in one place. Compare
            prices, check real details and send booking requests for your date in minutes.
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-12 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/85"
              render={<Link href="/services" />}
              nativeButton={false}
            >
              Explore Wedding Services <ArrowRight />
            </Button>
            <Button
              variant="outline"
              className="h-12 border-white/30 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/sign-up" />}
              nativeButton={false}
            >
              Join as a Vendor
            </Button>
          </motion.div>
          <motion.dl {...rise(0.4)} className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-2xl font-semibold text-white sm:text-3xl">{stat.value}</dd>
                <dd className="mt-1 text-xs text-white/60">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <div className="relative ml-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border-8 border-white/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
              alt="Decorated wedding ceremony seating"
              fill
              sizes="450px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-10 -left-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
            <span className="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Verified vendors</p>
              <p className="text-xs text-muted-foreground">Every listing reviewed before going live</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
