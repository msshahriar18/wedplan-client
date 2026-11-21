import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Logo } from "@/components/shared/logo"
import { getSession } from "@/lib/core/server"
import { dashboardPath } from "@/lib/types/user"
import { RolePicker } from "./_components/role-picker"

export const metadata: Metadata = { title: "Finish setting up" }

export default async function OnboardingPage() {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")
  if (session.user.roleSelected !== false) redirect(dashboardPath(session.user.role))

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary/40 px-4 py-8">
      <Logo />
      <div className="mt-12 w-full max-w-xl rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
        <p className="eyebrow">One last step</p>
        <h1 className="mt-3 text-3xl font-semibold">
          Hi {session.user.name.split(" ")[0]}, how will you use WedPlan?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This sets up the right dashboard for you. It can&apos;t be changed later, so pick the one
          that fits.
        </p>
        <RolePicker />
      </div>
    </div>
  )
}
