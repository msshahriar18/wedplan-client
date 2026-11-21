"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Camera, Eye, EyeOff, Heart, Loader2, Store, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/shared/field"
import { GoogleButton } from "@/components/shared/google-button"
import { PasswordChecklist, isStrongPassword } from "@/components/shared/password-checklist"
import { signUp } from "@/lib/auth-client"
import { notify } from "@/lib/notify"
import { uploadImage } from "@/lib/upload-image"
import { dashboardPath } from "@/lib/types/user"
import { cn } from "@/lib/utils"

type Role = "customer" | "vendor"

const ROLE_OPTIONS: { value: Role; title: string; text: string; icon: typeof Heart }[] = [
  { value: "customer", title: "I'm planning a wedding", text: "Browse and book vendors", icon: Heart },
  { value: "vendor", title: "I'm a wedding vendor", text: "List services, get bookings", icon: Store },
]

type Errors = Partial<Record<"name" | "email" | "password" | "businessName" | "image", string>>

export function SignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "" })
  const [role, setRole] = useState<Role>("customer")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState("")

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please choose an image file" }))
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be smaller than 4MB" }))
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setErrors((prev) => ({ ...prev, image: undefined }))
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setImageFile(null)
  }

  const validate = () => {
    const next: Errors = {}
    if (form.name.trim().length < 2) next.name = "Please enter your full name"
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Please enter a valid email"
    if (!isStrongPassword(form.password)) next.password = "Password doesn't meet the rules below"
    if (role === "vendor" && form.businessName.trim().length < 2) {
      next.businessName = "Business name is required for vendors"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    let image: string | undefined

    if (imageFile) {
      try {
        setStep("Uploading photo...")
        image = await uploadImage(imageFile)
      } catch (err) {
        setLoading(false)
        setStep("")
        notify.error("Photo upload failed", (err as Error).message)
        return
      }
    }

    setStep("Creating account...")
    const { data, error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image,
      role,
      businessName: role === "vendor" ? form.businessName.trim() : undefined,
    })
    setLoading(false)
    setStep("")

    if (error) {
      const message =
        error.code === "USER_ALREADY_EXISTS" || error.status === 422
          ? "An account with this email already exists"
          : error.message || "Could not create your account"
      notify.error("Sign up failed", message)
      return
    }

    notify.success("Account created", "Welcome to WedPlan!")
    router.replace(dashboardPath(data.user.role))
    router.refresh()
  }

  return (
    <div>
      <p className="eyebrow">Join WedPlan</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Takes a minute. You can update your profile any time.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRole(option.value)}
              aria-pressed={role === option.value}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border bg-card p-3.5 text-left transition-colors",
                role === option.value
                  ? "border-primary ring-2 ring-primary/15"
                  : "hover:border-primary/40"
              )}
            >
              <option.icon
                className={cn(
                  "size-5",
                  role === option.value ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="mt-1 text-sm font-semibold">{option.title}</span>
              <span className="text-xs text-muted-foreground">{option.text}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <label
              htmlFor="photo"
              className="flex size-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-primary/40 bg-secondary text-primary"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Profile preview" className="size-full object-cover" />
              ) : (
                <Camera className="size-5" />
              )}
            </label>
            {preview ? (
              <button
                type="button"
                onClick={removeImage}
                aria-label="Remove photo"
                className="absolute -top-1 -right-1 rounded-full bg-foreground p-0.5 text-background"
              >
                <X className="size-3" />
              </button>
            ) : null}
            <input id="photo" type="file" accept="image/*" className="sr-only" onChange={handleImage} />
          </div>
          <div className="text-sm">
            <p className="font-medium">Profile photo</p>
            <p className={cn("text-xs", errors.image ? "text-destructive" : "text-muted-foreground")}>
              {errors.image || "Optional · JPG or PNG up to 4MB"}
            </p>
          </div>
        </div>

        <Field label="Full name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Nusrat Jahan"
            value={form.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            className="h-11 bg-card"
          />
        </Field>

        {role === "vendor" ? (
          <Field label="Business name" htmlFor="businessName" error={errors.businessName}>
            <Input
              id="businessName"
              placeholder="e.g. Golden Frame Studio"
              value={form.businessName}
              onChange={update("businessName")}
              aria-invalid={Boolean(errors.businessName)}
              className="h-11 bg-card"
            />
          </Field>
        ) : null}

        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            className="h-11 bg-card"
          />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={update("password")}
              aria-invalid={Boolean(errors.password)}
              className="h-11 bg-card pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <PasswordChecklist password={form.password} />
        </Field>

        <Button type="submit" disabled={loading} className="h-11 text-sm">
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? step : "Create Account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton redirectTo="/dashboard" label="Sign up with Google" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
