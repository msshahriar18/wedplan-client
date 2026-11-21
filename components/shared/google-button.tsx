"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import { notify } from "@/lib/notify"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.8-5.4 3.8-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  )
}

export function GoogleButton({ redirectTo = "/dashboard", label = "Continue with Google" }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const { error } = await signIn.social({ provider: "google", callbackURL: redirectTo })
    if (error) {
      notify.error("Google sign in failed", error.message)
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={loading}
      className="h-11 w-full gap-2 bg-card text-sm"
    >
      {loading ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
      {label}
    </Button>
  )
}
