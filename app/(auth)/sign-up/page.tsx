import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/core/server"
import { SignUpForm } from "./_components/sign-up-form"

export const metadata: Metadata = { title: "Create Account" }

export default async function SignUpPage() {
  const session = await getSession()
  if (session?.user) redirect("/dashboard")

  return <SignUpForm />
}
