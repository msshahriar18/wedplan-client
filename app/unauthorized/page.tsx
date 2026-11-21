import type { Metadata } from "next"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Access denied" }

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold">You don&apos;t have access to this page</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        This area belongs to a different type of account. If you think this is a mistake, sign in
        with the right account.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="h-10 px-5" render={<Link href="/" />} nativeButton={false}>
          Back to home
        </Button>
        <Button className="h-10 px-5" render={<Link href="/dashboard" />} nativeButton={false}>
          My dashboard
        </Button>
      </div>
    </div>
  )
}
