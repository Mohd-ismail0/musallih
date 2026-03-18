import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Building2, Shield } from "lucide-react";
import { cn } from "@musallih/shared";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Overview" },
  { to: "/organizations", icon: Building2, label: "Organizations" },
  { to: "/authority", icon: Shield, label: "Authority" },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-border bg-card/50 p-4">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <span className="text-xl font-bold text-accent">Musallih</span>
          <span className="text-sm text-muted-foreground">Dashboard</span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                "text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
