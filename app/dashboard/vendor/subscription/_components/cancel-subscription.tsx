"use client"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { cancelSubscription } from "@/lib/actions/payments"
import { notify } from "@/lib/notify"

export function CancelSubscription({ endsOn }: { endsOn: string }) {
  const handleCancel = async () => {
    const result = await cancelSubscription()
    if (!result.ok) {
      notify.error("Couldn't cancel", result.message)
      return false
    }
    notify.success("Subscription cancelled", `Premium stays active until ${endsOn}.`)
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" className="h-9 text-sm text-muted-foreground hover:text-destructive">
          Cancel subscription
        </Button>
      }
      title="Cancel Premium?"
      description={`You keep Premium until ${endsOn}. After that your account moves to the free plan and only your 3 newest active services stay live.`}
      confirmLabel="Cancel subscription"
      destructive
      onConfirm={handleCancel}
    />
  )
}
