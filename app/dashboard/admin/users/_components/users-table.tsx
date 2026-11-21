"use client"

import { useState } from "react"
import { Ban, Crown, Eye, Loader2, ShieldCheck, Unlock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { getUserDetails, setUserBlocked } from "@/lib/actions/admin"
import { formatDate } from "@/lib/formatters"
import { notify } from "@/lib/notify"
import { ROLE_LABEL, type AdminUser } from "@/lib/types/user"
import { cn } from "@/lib/utils"

const ROLE_STYLE = {
  admin: "bg-primary/10 text-primary",
  vendor: "bg-gold/25 text-gold-foreground",
  customer: "bg-secondary text-secondary-foreground",
}

type DetailsState = { open: boolean; data: AdminUser | null; error: string }

function UserDetails({ state, onClose }: { state: DetailsState; onClose: () => void }) {
  const { data, error } = state

  return (
    <Dialog open={state.open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
          <DialogDescription className="sr-only">Account information</DialogDescription>
        </DialogHeader>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : !data ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              <UserAvatar src={data.image} name={data.name} className="size-14" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{data.name}</p>
                <p className="truncate text-sm text-muted-foreground">{data.email}</p>
              </div>
            </div>
            <dl className="mt-5 divide-y text-sm">
              {[
                ["Role", ROLE_LABEL[data.role]],
                ["Status", <StatusBadge key="s" status={data.isBlocked ? "blocked" : "active"} />],
                ...(data.role === "vendor"
                  ? [
                      ["Business", data.businessName || "—"],
                      ["Plan", data.isPremium || data.subscriptionPlan === "premium" ? "Premium" : "Free"],
                      ["Services", data.stats?.serviceCount ?? 0],
                      ["Booking requests received", data.stats?.vendorBookings ?? 0],
                      ["Payments", data.stats?.payments ?? 0],
                    ]
                  : []),
                ...(data.role === "customer"
                  ? [["Booking requests sent", data.stats?.customerBookings ?? 0]]
                  : []),
                ["Phone", data.phone || "—"],
                ["Joined", formatDate(data.createdAt)],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function BlockButton({ user }: { user: AdminUser }) {
  if (user.role === "admin") {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" /> Protected
      </span>
    )
  }

  const nextBlocked = !user.isBlocked
  const handle = async () => {
    const result = await setUserBlocked(user._id, nextBlocked)
    if (!result.ok) {
      notify.error("Action failed", result.message)
      return false
    }
    notify.success(nextBlocked ? `${user.name} is blocked` : `${user.name} is unblocked`)
  }

  return (
    <ConfirmDialog
      trigger={
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8", nextBlocked ? "text-destructive hover:text-destructive" : "text-success hover:text-success")}
        >
          {nextBlocked ? <Ban /> : <Unlock />}
          {nextBlocked ? "Block" : "Unblock"}
        </Button>
      }
      title={nextBlocked ? `Block ${user.name}?` : `Unblock ${user.name}?`}
      description={
        nextBlocked
          ? "They will be signed out right away and won't be able to log in or use any protected feature until unblocked."
          : "They will be able to sign in and use the platform again."
      }
      confirmLabel={nextBlocked ? "Block user" : "Unblock user"}
      destructive={nextBlocked}
      onConfirm={handle}
    />
  )
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [details, setDetails] = useState<DetailsState>({ open: false, data: null, error: "" })

  const openDetails = async (id: string) => {
    setDetails({ open: true, data: null, error: "" })
    const result = await getUserDetails(id)
    setDetails((prev) =>
      prev.open
        ? { open: true, data: result.ok ? result.data : null, error: result.ok ? "" : result.message }
        : prev
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-5">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="py-3 pl-5">
                  <div className="flex items-center gap-3">
                    <UserAvatar src={user.image} name={user.name} />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 font-medium">
                        <span className="max-w-[12rem] truncate">{user.name}</span>
                        {user.isPremium ? <Crown className="size-3.5 text-gold-foreground" /> : null}
                      </p>
                      <p className="max-w-[14rem] truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", ROLE_STYLE[user.role])}>
                    {ROLE_LABEL[user.role]}
                  </span>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.isBlocked ? "blocked" : "active"} />
                </TableCell>
                <TableCell className="pr-5">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon-sm" aria-label="View details" onClick={() => openDetails(user._id)}>
                      <Eye />
                    </Button>
                    <BlockButton user={user} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UserDetails state={details} onClose={() => setDetails({ open: false, data: null, error: "" })} />
    </>
  )
}
