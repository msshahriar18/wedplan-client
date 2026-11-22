import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/shared/social-icons"
import { Logo } from "@/components/shared/logo"
import { CATEGORIES, categoryHref } from "@/lib/constants"

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Become a Vendor", href: "/sign-up" },
]

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#2a1219] text-white/75">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            WedPlan brings couples and trusted wedding vendors together. Compare services, check
            prices and send booking requests without the endless phone calls.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-gold hover:text-gold"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold tracking-wide text-white uppercase">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold tracking-wide text-white uppercase">
            Categories
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((category) => (
              <li key={category.name}>
                <Link href={categoryHref(category.name)} className="hover:text-gold">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold tracking-wide text-white uppercase">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              House 12, Road 5, Dhanmondi, Dhaka 1209
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href="tel:+8801700000000" className="hover:text-gold">
                +880 1700-000000
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href="mailto:hello@wedplan.com" className="hover:text-gold">
                hello@wedplan.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>&copy; {new Date().getFullYear()} WedPlan. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
