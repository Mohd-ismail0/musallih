export function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <p className="text-muted-foreground">
        Staff dashboard for admin, authority, and organization management.
        Role-gated UI will show different sections based on permissions.
      </p>
    </div>
  );
}
