import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@musallih/shared";

interface StateBlockProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  action?: ReactNode;
  role?: "status" | "alert";
  live?: "polite" | "assertive";
}

function StateBlock({ title, description, icon, className, action, role, live }: StateBlockProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/60 p-6 text-center",
        "flex min-h-40 flex-col items-center justify-center gap-3",
        className
      )}
      role={role}
      aria-live={live}
    >
      <div className="text-muted-foreground">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}

export function LoadingState({
  title = "Loading",
  description = "Fetching latest data...",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <StateBlock
      title={title}
      description={description}
      icon={<Loader2 className="h-5 w-5 animate-spin" />}
      role="status"
      live="polite"
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please retry in a moment.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <StateBlock
      title={title}
      description={description}
      icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
      action={action}
      role="alert"
      live="assertive"
    />
  );
}

export function EmptyState({
  title = "No results yet",
  description = "Try adjusting filters or search.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <StateBlock title={title} description={description} icon={<Inbox className="h-5 w-5" />} action={action} />
  );
}
