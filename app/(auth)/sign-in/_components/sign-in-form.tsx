"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/shared/field"
import { GoogleButton } from "@/components/shared/google-button"
import { signIn } from "@/lib/auth-client"
import { notify } from "@/lib/notify"
import { dashboardPath } from "@/lib/types/user"

export function SignInForm({ redirectTo }: { redirectTo: string | null }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!email.trim() || !password) {
      setError("Please enter your email and password")
      return
    }

    setLoading(true)
    const { data, error } = await signIn.email({ email: email.trim(), password })
    setLoading(false)

    if (error) {
      const message =
        error.status === 401 ? "Email or password is incorrect" : error.message || "Sign in failed"
      setError(message)
      notify.error("Sign in failed", message)
      return
    }

    notify.success(`Welcome back, ${data.user.name.split(" ")[0]}!`)
    router.replace(redirectTo || dashboardPath(data.user.role))
    router.refresh()
  }

  return (
    <div>
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Sign in to WedPlan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick up where you left off with your bookings and services.
      </p>

      <div className="mt-8">
        <GoogleButton redirectTo={redirectTo || "/dashboard"} />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or sign in with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-card"
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </Field>

        {error ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        ) : null}

        <Button type="submit" disabled={loading} className="h-11 text-sm">
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to WedPlan?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
