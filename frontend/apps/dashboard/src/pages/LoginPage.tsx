import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  cn,
  elevatedCardSurfaceClass,
  focusRingClass,
  interactiveBaseClass,
} from "@musallih/shared";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    const isAuthed = window.localStorage.getItem("musallih.dashboard.auth") === "true";
    if (isAuthed) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  function handleContinue() {
    window.localStorage.setItem("musallih.dashboard.auth", "true");
    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className={cn("w-full max-w-sm rounded-2xl p-8", elevatedCardSurfaceClass)}>
        <h1 className="text-2xl font-bold mb-2">Musallih Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Sign in to manage organizations, authority, and services.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Firebase Auth integration coming soon.
        </p>
        <button
          type="button"
          onClick={handleContinue}
          className={cn(
            interactiveBaseClass,
            focusRingClass,
            "w-full rounded-lg px-4 py-2",
            "bg-accent text-accent-foreground font-medium",
            "hover:bg-accent/90 transition-colors"
          )}
        >
          Continue to Dashboard (placeholder)
        </button>
      </div>
    </div>
  );
}
