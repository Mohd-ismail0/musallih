import { Link } from "react-router-dom";
import { cn } from "@musallih/shared";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-card border border-border">
        <h1 className="text-2xl font-bold mb-2">Musallih Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Sign in to manage organizations, authority, and services.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Firebase Auth integration coming soon.
        </p>
        <Link
          to="/"
          className={cn(
            "inline-flex items-center justify-center w-full px-4 py-2 rounded-lg",
            "bg-accent text-accent-foreground font-medium",
            "hover:bg-accent/90 transition-colors"
          )}
        >
          Continue to Dashboard (placeholder)
        </Link>
      </div>
    </div>
  );
}
