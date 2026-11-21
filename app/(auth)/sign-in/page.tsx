import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/core/server"
import { safeRedirect } from "@/lib/utils"
import { SignInForm } from "./_components/sign-in-form"

export const metadata: Metadata = { title: "Sign In" }

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect: redirectParam } = await searchParams
  const session = await getSession()
  if (session?.user) redirect(safeRedirect(redirectParam))

  return <SignInForm redirectTo={redirectParam ? safeRedirect(redirectParam) : null} />
}
