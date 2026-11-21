import type { Metadata } from "next"
import { Lock, Receipt } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatusTabs } from "@/components/dashboard/status-tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { getAdminTransactions } from "@/lib/api/admin"
import { formatDateTime, formatPrice, vendorDisplayName } from "@/lib/formatters"

export const metadata: Metadata = { title: "Transactions" }

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const current = ["paid", "failed"].includes(status ?? "") ? status : undefined
  const transactions = await getAdminTransactions({ status: current })
  const revenue = transactions.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Premium subscription payments recorded from verified Stripe webhooks."
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusTabs
          basePath="/dashboard/admin/transactions"
          current={current}
          options={[
            { value: "", label: "All" },
            { value: "paid", label: "Paid" },
            { value: "failed", label: "Failed" },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Collected in view: <b className="text-foreground">{formatPrice(revenue)}</b>
        </p>
      </div>

      <p className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3.5" /> Payment records are read only. Status comes from Stripe and
        can&apos;t be edited here.
      </p>

      {transactions.length ? (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-5">Vendor</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <UserAvatar src={tx.vendor?.image} name={vendorDisplayName(tx.vendor)} />
                      <div className="min-w-0">
                        <p className="max-w-[14rem] truncate font-medium">{vendorDisplayName(tx.vendor)}</p>
                        <p className="max-w-[14rem] truncate text-xs text-muted-foreground">{tx.vendor?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{tx.plan}</TableCell>
                  <TableCell className="font-medium">{formatPrice(tx.amount, tx.currency)}</TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell className="pr-5 text-sm whitespace-nowrap text-muted-foreground">
                    {formatDateTime(tx.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="When a vendor upgrades to Premium, the payment shows up here."
        />
      )}
    </div>
  )
}
