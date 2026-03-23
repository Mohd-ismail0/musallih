import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, Shield, Menu, X } from "lucide-react";
import { cn, focusRingClass, getNavItemClass, interactiveBaseClass } from "@musallih/shared";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Overview" },
  { to: "/organizations", icon: Building2, label: "Organizations" },
  { to: "/authority", icon: Shield, label: "Authority" },
];

export function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSignOut() {
    window.localStorage.removeItem("musallih.dashboard.auth");
    navigate("/login", { replace: true });
  }

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
            className={cn(
              interactiveBaseClass,
              focusRingClass,
              "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground lg:hidden"
            )}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="dashboard-primary-nav"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden items-center gap-3 text-sm text-muted-foreground lg:flex">
            <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent">
              Role aware
            </span>
            <span>Admin and authority workspace</span>
            <button
              type="button"
              onClick={handleSignOut}
              className={cn(
                interactiveBaseClass,
                focusRingClass,
                "rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:bg-secondary"
              )}
            >
              Sign out
            </button>
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
          <nav id="dashboard-primary-nav" className="space-y-1 p-3 sm:p-4" aria-label="Dashboard navigation">
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
            <button
              type="button"
              onClick={handleSignOut}
              className={cn(
                interactiveBaseClass,
                focusRingClass,
                "mt-3 w-full justify-start rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary lg:hidden"
              )}
            >
              Sign out
            </button>
          </nav>
        </aside>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
