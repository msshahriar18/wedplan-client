"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Crown, DollarSign, Loader2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/shared/field"
import { MultiImageUpload } from "@/components/shared/multi-image-upload"
import { createService, updateService } from "@/lib/actions/services"
import { CATEGORY_NAMES } from "@/lib/constants"
import { notify } from "@/lib/notify"
import type { Service } from "@/lib/types/service"

type FormState = {
  serviceName: string
  category: string
  description: string
  price: string
  location: string
  images: string[]
}

type Errors = Partial<Record<keyof FormState, string>>

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const isEdit = Boolean(service)
  const [form, setForm] = useState<FormState>({
    serviceName: service?.serviceName ?? "",
    category: service?.category ?? "",
    description: service?.description ?? "",
    price: service ? String(service.price) : "",
    location: service?.location ?? "",
    images: service?.images ?? [],
  })
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [limitReached, setLimitReached] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next: Errors = {}
    const name = form.serviceName.trim()
    if (name.length < 3 || name.length > 100) next.serviceName = "Use 3 to 100 characters"
    if (!form.category) next.category = "Choose a category"
    if (form.description.trim().length < 20) next.description = "Write at least 20 characters"
    const price = Number(form.price)
    if (!form.price || !Number.isFinite(price) || price <= 0) next.price = "Enter a price above 0"
    if (!form.location.trim()) next.location = "Where do you offer this service?"
    if (form.images.length === 0) next.images = "Upload at least one photo"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      notify.error("Please fix the highlighted fields")
      return
    }

    setSaving(true)
    const payload = {
      serviceName: form.serviceName.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      location: form.location.trim(),
      images: form.images,
    }
    const result = isEdit
      ? await updateService(service!._id, payload)
      : await createService(payload)
    setSaving(false)

    if (!result.ok) {
      if (result.status === 403 && result.message.includes("Upgrade")) setLimitReached(true)
      notify.error(isEdit ? "Could not update service" : "Could not add service", result.message)
      return
    }

    notify.success(
      isEdit ? "Service updated" : "Service submitted",
      "It will be visible to customers after admin approval."
    )
    router.push("/dashboard/vendor/services")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {limitReached ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-gold/50 bg-gold/15 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Crown className="mt-0.5 size-5 shrink-0 text-gold-foreground" />
            <div>
              <p className="font-semibold">You&apos;ve reached the free plan limit</p>
              <p className="text-sm text-muted-foreground">
                Free vendors can keep 3 active services. Upgrade to Premium for unlimited listings,
                or pause one of your services first.
              </p>
            </div>
          </div>
          <Button render={<Link href="/dashboard/vendor/subscription" />} nativeButton={false} className="h-10 shrink-0">
            Upgrade to Premium
          </Button>
        </div>
      ) : null}

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="font-sans text-base font-semibold">Basic details</h2>
        <div className="mt-5 grid gap-5">
          <Field label="Service name" htmlFor="serviceName" error={errors.serviceName} required>
            <Input
              id="serviceName"
              value={form.serviceName}
              onChange={(e) => set("serviceName", e.target.value)}
              placeholder="e.g. Full Day Wedding Photography"
              aria-invalid={Boolean(errors.serviceName)}
              className="h-11"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" error={errors.category} required>
              <Select
                value={form.category || null}
                onValueChange={(value) => set("category", String(value ?? ""))}
                items={CATEGORY_NAMES.map((c) => ({ value: c, label: c }))}
              >
                <SelectTrigger className="h-11 w-full" aria-invalid={Boolean(errors.category)} aria-label="Category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_NAMES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Starting price (USD)" htmlFor="price" error={errors.price} required>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  min={1}
                  step="any"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="1200"
                  aria-invalid={Boolean(errors.price)}
                  className="h-11 pl-9"
                />
              </div>
            </Field>
          </div>

          <Field label="Location" htmlFor="location" error={errors.location} required>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Dhaka"
                aria-invalid={Boolean(errors.location)}
                className="h-11 pl-9"
              />
            </div>
          </Field>

          <Field
            label="Description"
            htmlFor="description"
            error={errors.description}
            hint={`${form.description.trim().length} characters · what's included, duration, extras`}
            required
          >
            <Textarea
              id="description"
              rows={6}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe your package so couples know exactly what they get."
              aria-invalid={Boolean(errors.description)}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="font-sans text-base font-semibold">Photos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Up to 6 photos. The first one is used as the cover image.
        </p>
        <div className="mt-5">
          <MultiImageUpload
            value={form.images}
            onChange={(images) => set("images", images)}
            invalid={Boolean(errors.images)}
            onUploadingChange={setUploading}
          />
          {errors.images ? <p className="mt-2 text-xs font-medium text-destructive">{errors.images}</p> : null}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 px-6"
          render={<Link href="/dashboard/vendor/services" />}
          nativeButton={false}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving || uploading} className="h-11 px-6">
          {saving ? <Loader2 className="animate-spin" /> : null}
          {saving ? "Saving..." : uploading ? "Uploading photos..." : isEdit ? "Save changes" : "Submit for review"}
        </Button>
      </div>
    </form>
  )
}
