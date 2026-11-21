import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { ServiceForm } from "@/components/vendor/service-form"

export const metadata: Metadata = { title: "Add Service" }

export default function AddServicePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Add a new service"
        description="New services stay pending until an admin reviews them."
      />
      <ServiceForm />
    </div>
  )
}
