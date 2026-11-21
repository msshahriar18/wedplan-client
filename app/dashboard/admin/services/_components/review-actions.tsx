"use client"

import { useState } from "react"
import { Check, Loader2, MoreHorizontal, RotateCcw, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { adminDeleteService, reviewService } from "@/lib/actions/services"
import { notify } from "@/lib/notify"
import type { Service, ServiceStatus } from "@/lib/types/service"

const MESSAGES: Record<ServiceStatus, string> = {
  approved: "Service approved and visible to customers",
  rejected: "Service rejected and hidden from customers",
  pending: "Service moved back to pending review",
}

export function ReviewActions({ service }: { service: Service }) {
  const [loading, setLoading] = useState<ServiceStatus | null>(null)

  const changeStatus = async (status: ServiceStatus) => {
    setLoading(status)
    const result = await reviewService(service._id, status)
    setLoading(null)
    if (!result.ok) {
      notify.error("Couldn't update status", result.message)
      return
    }
    notify.success(MESSAGES[status])
  }

  const handleDelete = async () => {
    const result = await adminDeleteService(service._id)
    if (!result.ok) {
      notify.error("Delete failed", result.message)
      return false
    }
    notify.success("Service deleted")
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {service.status === "pending" ? (
        <>
          <Button size="sm" className="h-8" onClick={() => changeStatus("approved")} disabled={loading !== null}>
            {loading === "approved" ? <Loader2 className="animate-spin" /> : <Check />} Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-destructive hover:text-destructive"
            onClick={() => changeStatus("rejected")}
            disabled={loading !== null}
          >
            {loading === "rejected" ? <Loader2 className="animate-spin" /> : <X />} Reject
          </Button>
        </>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="More actions" />}>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {service.status !== "approved" ? (
            <DropdownMenuItem onClick={() => changeStatus("approved")}>
              <Check /> Approve
            </DropdownMenuItem>
          ) : null}
          {service.status !== "rejected" ? (
            <DropdownMenuItem onClick={() => changeStatus("rejected")}>
              <X /> Reject
            </DropdownMenuItem>
          ) : null}
          {service.status !== "pending" ? (
            <DropdownMenuItem onClick={() => changeStatus("pending")}>
              <RotateCcw /> Move to pending
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label="Delete service" className="text-destructive hover:text-destructive">
            <Trash2 />
          </Button>
        }
        title="Delete this service?"
        description={
          <>
            <b>{service.serviceName}</b> will be removed for good. Use this for spam or inappropriate
            listings — otherwise rejecting is usually enough.
          </>
        }
        confirmLabel="Delete service"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}
