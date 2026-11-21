import type { Metadata } from "next"
import { Info } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { ServiceForm } from "@/components/vendor/service-form"
import { getVendorServiceById } from "@/lib/api/services"

export const metadata: Metadata = { title: "Edit Service" }

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getVendorServiceById(id)

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Edit service" description={service.serviceName} />
      {service.status === "approved" ? (
        <p className="mb-6 flex gap-2 rounded-xl bg-warning/10 p-4 text-sm text-[#7a4f00]">
          <Info className="mt-0.5 size-4 shrink-0" />
          Saving changes sends this service back for review, so it will be hidden from customers
          until an admin approves it again.
        </p>
      ) : null}
      <ServiceForm service={service} />
    </div>
  )
}
