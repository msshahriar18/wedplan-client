import type { Metadata } from "next"
import { Users } from "lucide-react"

import { FilterBar } from "@/components/dashboard/filter-bar"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { getAdminUsers } from "@/lib/api/admin"
import { UsersTable } from "./_components/users-table"

export const metadata: Metadata = { title: "Manage Users" }

export default async function ManageUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string; status?: string }>
}) {
  const params = await searchParams
  const users = await getAdminUsers(params)

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="Search accounts, check details and block anyone misusing the platform."
      />
      <FilterBar
        key={JSON.stringify(params)}
        placeholder="Search by name or email"
        initial={{ search: params.search, role: params.role, status: params.status }}
        selects={[
          {
            name: "role",
            label: "All roles",
            options: [
              { value: "customer", label: "Customers" },
              { value: "vendor", label: "Vendors" },
              { value: "admin", label: "Admins" },
            ],
          },
          {
            name: "status",
            label: "Any status",
            options: [
              { value: "active", label: "Active" },
              { value: "blocked", label: "Blocked" },
            ],
          },
        ]}
      />
      <p className="mb-3 text-sm text-muted-foreground">{users.length} users found</p>
      {users.length ? (
        <div className="overflow-x-auto">
          <UsersTable users={users} />
        </div>
      ) : (
        <EmptyState icon={Users} title="No users found" description="Try a different name, email or filter." />
      )}
    </div>
  )
}
