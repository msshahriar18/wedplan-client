"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { deleteService, setServiceAvailability } from "@/lib/actions/services"
import { formatDate, formatPrice } from "@/lib/formatters"
import { notify } from "@/lib/notify"
import type { Service } from "@/lib/types/service"

function AvailabilityToggle({ service }: { service: Service }) {
  const [checked, setChecked] = useState(service.isAvailable)
  const [saving, setSaving] = useState(false)

  const toggle = async (value: boolean) => {
    setSaving(true)
    setChecked(value)
    const result = await setServiceAvailability(service._id, value)
    setSaving(false)
    if (!result.ok) {
      setChecked(!value)
      notify.error("Couldn't change availability", result.message)
      return
    }
    notify.success(value ? "Service is now available" : "Service paused", value ? undefined : "Customers won't see it until you turn it back on.")
  }

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <Switch
        checked={checked}
        onCheckedChange={toggle}
        disabled={saving || service.status === "rejected"}
        aria-label="Available for booking"
      />
      {checked ? "Available" : "Paused"}
    </label>
  )
}

function RowActions({ service }: { service: Service }) {
  const handleDelete = async () => {
    const result = await deleteService(service._id)
    if (!result.ok) {
      notify.error("Delete failed", result.message)
      return false
    }
    notify.success("Service deleted")
  }

  return (
    <div className="flex items-center gap-1">
      {service.status === "approved" && service.isAvailable ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="View public page"
          render={<Link href={`/services/${service._id}`} />}
          nativeButton={false}
        >
          <Eye />
        </Button>
      ) : null}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Edit service"
        render={<Link href={`/dashboard/vendor/services/${service._id}/edit`} />}
        nativeButton={false}
      >
        <Pencil />
      </Button>
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label="Delete service" className="text-destructive hover:text-destructive">
            <Trash2 />
          </Button>
        }
        title="Delete this service?"
        description={
          <>
            <b>{service.serviceName}</b> will be removed permanently and any pending booking
            requests for it will be cancelled.
          </>
        }
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}

export function ServicesTable({ services }: { services: Service[] }) {
  return (
    <>
      {/* desktop */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card xl:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-5">Service</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell className="py-3 pl-5">
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={service.images[0]} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-xs truncate font-medium">{service.serviceName}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.category} · {service.location}
                      </p>
                      <p className="text-xs text-muted-foreground">Added {formatDate(service.createdAt)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatPrice(service.price)}</TableCell>
                <TableCell>
                  <StatusBadge status={service.status} />
                </TableCell>
                <TableCell>
                  <AvailabilityToggle service={service} />
                </TableCell>
                <TableCell className="pr-5">
                  <div className="flex justify-end">
                    <RowActions service={service} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* mobile */}
      <div className="grid gap-4 sm:grid-cols-2 xl:hidden">
        {services.map((service) => (
          <div key={service._id} className="rounded-2xl border bg-card p-4">
            <div className="flex gap-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image src={service.images[0]} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium">{service.serviceName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{service.category}</p>
                <p className="mt-1 text-sm font-semibold text-primary">{formatPrice(service.price)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <StatusBadge status={service.status} />
              <AvailabilityToggle service={service} />
            </div>
            <div className="mt-2 flex justify-end">
              <RowActions service={service} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
