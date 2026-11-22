import type { Metadata } from "next"
import { PolicyPage } from "@/components/shared/policy-page"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy" updated="November 22, 2026">
      <p>
        This page explains what information WedPlan collects when you use the site and how it is
        used. WedPlan is a student project built to connect couples with wedding vendors.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Your name, email address and profile photo when you create an account.</li>
        <li>
          If you sign in with Google, we receive your name, email address and profile picture from
          Google. We don&apos;t get access to your Gmail, contacts or any other Google data.
        </li>
        <li>Profile details you choose to add, such as phone number, bio or business name.</li>
        <li>Services you publish, booking requests you send or receive, and their status.</li>
        <li>For vendors who upgrade, a record of the subscription payment (plan, amount, date).</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Payments are handled by Stripe. Card details are entered on Stripe&apos;s checkout page and
        are never sent to or stored on WedPlan servers.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To sign you in and keep your account secure.</li>
        <li>To show your services and booking requests to the right people.</li>
        <li>To activate and manage Premium subscriptions for vendors.</li>
      </ul>
      <p>We don&apos;t sell your information or use it for advertising.</p>

      <h2>Images</h2>
      <p>Profile and service photos you upload are hosted on ImgBB so they can be shown on the site.</p>

      <h2>Your choices</h2>
      <p>
        You can update your profile any time from Profile Settings. To delete your account and data,
        email us at the address below.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy: hello@wedplan.com</p>
    </PolicyPage>
  )
}
