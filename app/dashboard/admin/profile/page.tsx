import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { getMyProfile } from "@/lib/api/dashboard"

export const metadata: Metadata = { title: "Profile Settings" }

export default async function ProfilePage() {
  const profile = await getMyProfile()

  return (
    <div>
      <PageHeader title="Profile Settings" description="Update how you appear on WedPlan." />
      <ProfileForm profile={profile} />
    </div>
  )
}
