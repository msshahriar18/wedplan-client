"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Loader2, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/shared/field"
import { chooseRole } from "@/lib/actions/users"
import { notify } from "@/lib/notify"
import { dashboardPath } from "@/lib/types/user"
import { cn } from "@/lib/utils"

const OPTIONS = [
  {
    value: "customer" as const,
    title: "Planning my wedding",
    text: "Browse vendors, send booking requests and track them.",
    icon: Heart,
  },
  {
    value: "vendor" as const,
    title: "I offer wedding services",
    text: "Publish services and manage booking requests from couples.",
    icon: Store,
  },
]

export function RolePicker() {
  const router = useRouter()
  const [role, setRole] = useState<"customer" | "vendor">("customer")
  const [businessName, setBusinessName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (role === "vendor" && businessName.trim().length < 2) {
      setError("Business name is required for vendors")
      return
    }
    setError("")
    setLoading(true)
    const result = await chooseRole(role, businessName.trim())
    setLoading(false)

    if (!result.ok) {
      notify.error("Could not save", result.message)
      return
    }
    notify.success("You're all set!")
    router.replace(dashboardPath(result.data.role))
    router.refresh()
  }

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setRole(option.value)}
            aria-pressed={role === option.value}
            className={cn(
              "rounded-2xl border p-5 text-left transition-colors",
              role === option.value ? "border-primary bg-secondary/60 ring-2 ring-primary/15" : "hover:border-primary/40"
            )}
          >
            <option.icon className={cn("size-6", role === option.value ? "text-primary" : "text-muted-foreground")} />
            <p className="mt-3 font-semibold">{option.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{option.text}</p>
          </button>
        ))}
      </div>

      {role === "vendor" ? (
        <Field label="Business name" htmlFor="businessName" error={error}>
          <Input
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Golden Frame Studio"
            className="h-11"
          />
        </Field>
      ) : null}

      <Button onClick={handleContinue} disabled={loading} className="h-11">
        {loading ? <Loader2 className="animate-spin" /> : null}
        Continue to dashboard
      </Button>
    </div>
  )
}
