"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/shared/field"
import { UserAvatar } from "@/components/shared/user-avatar"
import { updateProfile } from "@/lib/actions/users"
import { useSession } from "@/lib/auth-client"
import { formatDate } from "@/lib/formatters"
import { notify } from "@/lib/notify"
import { uploadImage } from "@/lib/upload-image"
import { ROLE_LABEL, type Profile } from "@/lib/types/user"

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const { refetch } = useSession()
  const isVendor = profile.role === "vendor"

  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone,
    bio: profile.bio,
    businessName: profile.businessName,
  })
  const [image, setImage] = useState(profile.image)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploading(true)
    try {
      setImage(await uploadImage(file))
      notify.info("Photo uploaded", "Click save to keep it.")
    } catch (err) {
      notify.error("Photo upload failed", (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters"
    if (form.phone && !/^[+\d][\d\s-]{6,18}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number"
    if (isVendor && form.businessName.trim().length < 2) next.businessName = "Business name is required"
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    const result = await updateProfile({
      name: form.name.trim(),
      image,
      phone: form.phone.trim(),
      bio: form.bio.trim(),
      ...(isVendor ? { businessName: form.businessName.trim() } : {}),
    })
    setSaving(false)

    if (!result.ok) {
      notify.error("Couldn't save profile", result.message)
      return
    }
    notify.success("Profile updated")
    await refetch()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-2xl border bg-card p-6 text-center">
        <div className="relative mx-auto w-fit">
          <UserAvatar src={image} name={form.name} className="size-28 text-2xl" />
          <label
            className="absolute right-0 bottom-0 flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow"
            aria-label="Change photo"
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            <input type="file" accept="image/*" className="sr-only" onChange={handleImage} disabled={uploading} />
          </label>
        </div>
        <p className="mt-4 font-semibold">{profile.name}</p>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
        <div className="mt-4 space-y-1 border-t pt-4 text-xs text-muted-foreground">
          <p>
            Account type: <b className="text-foreground">{ROLE_LABEL[profile.role]}</b>
          </p>
          {isVendor ? (
            <p>
              Plan: <b className="text-foreground capitalize">{profile.subscriptionPlan}</b>
            </p>
          ) : null}
          <p>Member since {formatDate(profile.createdAt)}</p>
        </div>
      </aside>

      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-sans text-base font-semibold">Personal information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" error={errors.name} required>
            <Input id="name" value={form.name} onChange={update("name")} className="h-11" aria-invalid={Boolean(errors.name)} />
          </Field>
          <Field label="Phone" htmlFor="phone" error={errors.phone}>
            <Input id="phone" value={form.phone} onChange={update("phone")} placeholder="+880 1XXX-XXXXXX" className="h-11" aria-invalid={Boolean(errors.phone)} />
          </Field>
          {isVendor ? (
            <Field label="Business name" htmlFor="businessName" error={errors.businessName} required className="sm:col-span-2">
              <Input id="businessName" value={form.businessName} onChange={update("businessName")} className="h-11" aria-invalid={Boolean(errors.businessName)} />
            </Field>
          ) : null}
          <Field label="Email" htmlFor="email" hint="Email can't be changed" className="sm:col-span-2">
            <div className="relative">
              <Input id="email" value={profile.email} disabled className="h-11 pr-9" />
              <Lock className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </Field>
          <Field
            label={isVendor ? "About your business" : "About you"}
            htmlFor="bio"
            hint={`${form.bio.length}/300`}
            className="sm:col-span-2"
          >
            <Textarea id="bio" rows={4} maxLength={300} value={form.bio} onChange={update("bio")} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end border-t pt-5">
          <Button type="submit" disabled={saving || uploading} className="h-11 px-6">
            {saving ? <Loader2 className="animate-spin" /> : null}
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </section>
    </form>
  )
}
