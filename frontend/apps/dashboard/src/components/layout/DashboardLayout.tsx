import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, Shield, Menu, X } from "lucide-react";
import { cn, getNavItemClass } from "@musallih/shared";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Overview" },
  { to: "/organizations", icon: Building2, label: "Organizations" },
  { to: "/authority", icon: Shield, label: "Authority" },
];

export function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-accent">Musallih</span>
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden items-center gap-3 text-sm text-muted-foreground lg:flex">
            <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent">
              Role aware
            </span>
            <span>Admin and authority workspace</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
        <aside
          className={cn(
            "border-b border-border bg-card/50 lg:min-h-[calc(100vh-4rem)] lg:w-72 lg:border-b-0 lg:border-r",
            isMenuOpen ? "block" : "hidden lg:block"
          )}
        >
          <nav className="space-y-1 p-3 sm:p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    getNavItemClass(isActive ? "active" : "inactive"),
                    "w-full justify-start gap-3 rounded-lg py-2.5"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
