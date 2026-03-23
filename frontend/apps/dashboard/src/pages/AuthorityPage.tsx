import { CheckCircle2, Shield, Siren, UserRoundCheck } from "lucide-react";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";

const authorityQueue = [
  { reference: "AUT-8901", type: "License verification", organization: "Al Noor Group", priority: "High" },
  { reference: "AUT-8898", type: "Service dispute", organization: "Safa Community", priority: "Medium" },
  { reference: "AUT-8895", type: "Compliance renewal", organization: "Ihsan Trust", priority: "Low" },
];

export function AuthorityPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Authority</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Review operational requests, prioritize incidents, and keep compliance decisions transparent for authority
          teams.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Open reviews</p>
          <p className="mt-2 text-2xl font-semibold">18</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-accent" />
            Active authority backlog
          </div>
        </article>
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Critical alerts</p>
          <p className="mt-2 text-2xl font-semibold">4</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-300">
            <Siren className="h-4 w-4" />
            Requires same-day action
          </div>
        </article>
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Completed this week</p>
          <p className="mt-2 text-2xl font-semibold">31</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            SLA health within target
          </div>
        </article>
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Assigned reviewers</p>
          <p className="mt-2 text-2xl font-semibold">9</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <UserRoundCheck className="h-4 w-4 text-accent" />
            Multi-role delegation enabled
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Authority queue</h2>
          <StatusBadge label="Scope: Authority users" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-0 py-2">Reference</th>
                <th className="px-0 py-2">Type</th>
                <th className="px-0 py-2">Organization</th>
                <th className="px-0 py-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {authorityQueue.map((item) => (
                <tr key={item.reference} className="border-t border-border/70">
                  <td className="px-0 py-3 font-medium">{item.reference}</td>
                  <td className="px-0 py-3">{item.type}</td>
                  <td className="px-0 py-3 text-muted-foreground">{item.organization}</td>
                  <td className="px-0 py-3">
                    <StatusBadge
                      label={item.priority}
                      tone={item.priority === "High" ? "danger" : item.priority === "Medium" ? "warning" : "neutral"}
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
          tone="loading"
          title="Policy registry syncing"
          description="Latest policy bundles are being synchronized for downstream reviewer tools."
        />
        <StatePanel
          tone="empty"
          title="No escalations waiting"
          description="No unresolved escalations are currently assigned to authority teams."
        />
      </section>
    </div>
  );
}
