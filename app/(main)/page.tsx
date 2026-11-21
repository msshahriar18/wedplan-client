import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedServices } from "@/components/home/featured-services"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { Testimonials } from "@/components/home/testimonials"
import { VendorCta } from "@/components/home/vendor-cta"
import { WhyChoose } from "@/components/home/why-choose"
import { getCategoryCounts, getFeaturedServices } from "@/lib/api/services"

export default async function HomePage() {
  const [featured, counts] = await Promise.all([getFeaturedServices(), getCategoryCounts()])

  return (
    <>
      <Hero />
      <FeaturedServices services={featured} />
      <CategoriesSection counts={counts} />
      <WhyChoose />
      <HowItWorks />
      <Testimonials />
      <VendorCta />
    </>
  )
}
