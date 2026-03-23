import { Link, NavLink, Outlet } from "react-router-dom";
import { Home, CalendarDays, Compass, ClipboardList, User } from "lucide-react";
import { cn, getNavItemClass } from "@musallih/shared";

const primaryNav = [
  { to: "/map", label: "Map", icon: Home },
  { to: "/prayer", label: "Prayer", icon: CalendarDays },
  { to: "/discover/services", label: "Discover", icon: Compass },
  { to: "/requests", label: "Requests", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: User },
];

export function ConsumerLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="min-w-0">
            <Link to="/map" className="text-lg font-semibold text-accent">
              Musallih
            </Link>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Discover trusted services, prayer info, and requests
            </p>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {primaryNav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  getNavItemClass(isActive ? "active" : "inactive")
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container px-4 py-5 pb-24 md:px-6 md:py-6 md:pb-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 p-2">
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center rounded-md py-2 text-[11px] transition-colors",
                  isActive
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="mb-1 h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
