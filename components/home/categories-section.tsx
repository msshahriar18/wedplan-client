import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { CATEGORIES, categoryHref } from "@/lib/constants"
import type { CategoryCount } from "@/lib/types/service"
import { SectionHeading } from "./section-heading"
import { Stagger, StaggerItem } from "./reveal"

export function CategoriesSection({ counts }: { counts: CategoryCount[] }) {
  return (
    <section className="bg-secondary/50 py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Explore by category"
          title="Wedding Service Categories"
          description="Everything for the big day, sorted the way you plan it. Pick a category to see who's available."
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const count = counts.find((c) => c.name === category.name)?.count ?? 0
            return (
              <StaggerItem key={category.name}>
                <Link
                  href={categoryHref(category.name)}
                  className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl p-6 text-white"
                >
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="-z-10 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#22090f]/90 via-[#22090f]/40 to-transparent" />
                  <span className="absolute top-5 left-5 flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <category.icon className="size-5" />
                  </span>
                  <span className="absolute top-5 right-5 rounded-full bg-white/15 px-2.5 py-1 text-xs backdrop-blur">
                    {count} service{count === 1 ? "" : "s"}
                  </span>
                  <p className="text-xs font-medium tracking-wider text-gold uppercase">{category.tagline}</p>
                  <h3 className="mt-1 flex items-center justify-between gap-2 text-xl font-semibold">
                    {category.name}
                    <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="mt-1 text-sm text-white/75">{category.description}</p>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
