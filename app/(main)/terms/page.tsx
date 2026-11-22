import type { Metadata } from "next"
import { PolicyPage } from "@/components/shared/policy-page"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <PolicyPage title="Terms of Service" updated="November 22, 2026">
      <p>
        By using WedPlan you agree to these terms. WedPlan is a student project and is provided as
        is, without any guarantee.
      </p>

      <h2>Accounts</h2>
      <ul>
        <li>Keep your login details private. You are responsible for activity on your account.</li>
        <li>Choose the account type that fits you. It can&apos;t be changed after setup.</li>
        <li>Accounts that misuse the platform may be blocked by an admin.</li>
      </ul>

      <h2>Vendors</h2>
      <ul>
        <li>Only list services you actually offer, with honest prices and photos you own.</li>
        <li>New and edited services are reviewed by an admin before they go live.</li>
        <li>
          The free plan allows 3 active services. Premium removes the limit and renews monthly until
          cancelled. Cancelling keeps Premium until the end of the paid period.
        </li>
      </ul>

      <h2>Booking requests</h2>
      <p>
        A booking request is not a contract or payment. Final details and payment for a wedding
        service are agreed directly between the customer and the vendor.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: hello@wedplan.com</p>
    </PolicyPage>
  )
}
