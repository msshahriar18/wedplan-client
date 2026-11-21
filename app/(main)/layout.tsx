import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavbar } from "@/components/layout/site-navbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
