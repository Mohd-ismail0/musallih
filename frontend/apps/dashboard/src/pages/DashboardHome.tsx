import { Activity, Building2, Clock4, Shield, Users } from "lucide-react";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";

const metrics = [
  {
    label: "Organizations",
    value: "42",
    hint: "Across registered sectors",
    icon: Building2,
  },
  {
    label: "Authority requests",
    value: "18",
    hint: "4 require urgent review",
    icon: Shield,
  },
  {
    label: "Active staff",
    value: "127",
    hint: "Signed in this week",
    icon: Users,
  },
];

const recentActivity = [
  { id: "ACT-1043", event: "Organization profile approved", actor: "Authority Team", status: "Completed" },
  { id: "ACT-1042", event: "New admin invited to Riyadh branch", actor: "System Admin", status: "In review" },
  { id: "ACT-1041", event: "Business location submitted", actor: "Org Manager", status: "Pending" },
];

export function DashboardHome() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Operational snapshot for admins, authority teams, and organization managers. The interface stays role-aware
          while preserving existing route and auth behavior.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((item) => (
          <article key={item.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <item.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">{item.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.hint}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              <h2 className="text-base font-semibold">Recent activity</h2>
            </div>
            <StatusBadge label="Live data soon" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <caption className="sr-only">Recent dashboard activity by reference, event, actor, and status</caption>
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-0 py-2">Reference</th>
                  <th scope="col" className="px-0 py-2">Event</th>
                  <th scope="col" className="px-0 py-2">Actor</th>
                  <th scope="col" className="px-0 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-t border-border/70">
                    <td className="px-0 py-3 font-medium">{activity.id}</td>
                    <td className="px-0 py-3">{activity.event}</td>
                    <td className="px-0 py-3 text-muted-foreground">{activity.actor}</td>
                    <td className="px-0 py-3">
                      <StatusBadge
                        label={activity.status}
                        tone={
                          activity.status === "Completed"
                            ? "success"
                            : activity.status === "In review"
                              ? "warning"
                              : "neutral"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock4 className="h-4 w-4 text-accent" />
            <h2 className="text-base font-semibold">Queue health</h2>
          </div>
          <StatePanel
            tone="loading"
            title="Authority feed syncing"
            description="Role-specific queue details are being fetched. Existing permissions remain unchanged."
          />
          <StatePanel
            tone="empty"
            title="No escalations"
            description="There are no escalated incidents for the current role scope."
          />
        </article>
      </section>
    </div>
  );
}
