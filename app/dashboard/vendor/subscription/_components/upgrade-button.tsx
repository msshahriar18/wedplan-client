"use client"

import { useState } from "react"
import { Crown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { startCheckout } from "@/lib/actions/payments"
import { notify } from "@/lib/notify"

export function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    const result = await startCheckout()
    if (!result.ok) {
      setLoading(false)
      notify.error("Couldn't start checkout", result.message)
      return
    }
    // keep the spinner while the browser leaves for stripe
    window.location.href = result.data.url
  }

  return (
    <Button onClick={handleUpgrade} disabled={loading} className="h-11 w-full bg-gold text-gold-foreground hover:bg-gold/85">
      {loading ? <Loader2 className="animate-spin" /> : <Crown />}
      {loading ? "Redirecting to Stripe..." : "Upgrade to Premium"}
    </Button>
  )
}
