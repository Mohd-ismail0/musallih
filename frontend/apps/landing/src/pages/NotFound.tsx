import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: Page not found", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-8xl font-bold text-muted-foreground">404</h1>
        <p className="text-xl text-muted-foreground">Oops! Page not found.</p>
        <Button asChild variant="outline">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
