import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarHeart, Clock, LayoutGrid, Receipt, Store, UserRound, Users } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { getAdminStats } from "@/lib/api/stats"
import { formatPrice } from "@/lib/formatters"

export const metadata: Metadata = { title: "Admin Dashboard" }

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  const shortcuts = [
    {
      href: "/dashboard/admin/services?status=pending",
      title: "Review pending services",
      text: `${stats.pendingServices} listing${stats.pendingServices === 1 ? "" : "s"} waiting for a decision`,
    },
    { href: "/dashboard/admin/users", title: "Manage users", text: "Search accounts and block misuse" },
    { href: "/dashboard/admin/transactions", title: "Check payments", text: `${formatPrice(stats.totalRevenue)} collected from Premium` },
  ]

  return (
    <div>
      <PageHeader title="Admin Overview" description="Platform health at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Registered Users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Total Vendors" value={stats.totalVendors} icon={Store} tone="gold" />
        <StatCard label="Total Customers" value={stats.totalCustomers} icon={UserRound} tone="slate" />
        <StatCard label="Total Services" value={stats.totalServices} icon={LayoutGrid} tone="green" hint={`${stats.approvedServices} approved`} />
        <StatCard label="Pending Services" value={stats.pendingServices} icon={Clock} tone="amber" />
        <StatCard label="Total Transactions" value={stats.totalTransactions} icon={Receipt} tone="primary" hint={`${formatPrice(stats.totalRevenue)} revenue`} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-sans text-base font-semibold">Quick actions</h2>
          <ul className="mt-4 divide-y">
            {shortcuts.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="font-medium group-hover:text-primary">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border bg-gradient-to-br from-primary to-[#5a1426] p-6 text-primary-foreground">
          <CalendarHeart className="size-8 text-gold" />
          <p className="mt-4 font-heading text-4xl font-semibold">{stats.totalBookings}</p>
          <p className="mt-1 text-sm text-white/75">booking requests sent through WedPlan so far</p>
        </section>
      </div>
    </div>
  )
}
