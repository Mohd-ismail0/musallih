import { Building2, Plus, Search } from "lucide-react";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";

const organizations = [
  { name: "Al Noor Group", city: "Riyadh", owner: "A. Rahman", services: 12, status: "Active" },
  { name: "Safa Community", city: "Jeddah", owner: "M. Kareem", services: 7, status: "Pending Review" },
  { name: "Ihsan Trust", city: "Dammam", owner: "S. Nasser", services: 4, status: "Attention" },
];

export function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organizations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage organization profiles, ownership, and service availability across business units.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          New organization
        </button>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search organizations"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <StatusBadge label="Scope: Admin + Org users" />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-0 py-2">Name</th>
                <th className="px-0 py-2">City</th>
                <th className="px-0 py-2">Owner</th>
                <th className="px-0 py-2">Services</th>
                <th className="px-0 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((organization) => (
                <tr key={organization.name} className="border-t border-border/70">
                  <td className="px-0 py-3 font-medium">
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-accent" />
                      {organization.name}
                    </span>
                  </td>
                  <td className="px-0 py-3">{organization.city}</td>
                  <td className="px-0 py-3 text-muted-foreground">{organization.owner}</td>
                  <td className="px-0 py-3">{organization.services}</td>
                  <td className="px-0 py-3">
                    <StatusBadge
                      label={organization.status}
                      tone={
                        organization.status === "Active"
                          ? "success"
                          : organization.status === "Pending Review"
                            ? "warning"
                            : "danger"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <StatePanel
          tone="empty"
          title="No unassigned managers"
          description="All organizations currently have a designated manager in this environment."
        />
        <StatePanel
          tone="error"
          title="Sync warning"
          description="The profile validation service timed out. Existing records remain available while retrying."
        />
      </section>
    </div>
  );
}
