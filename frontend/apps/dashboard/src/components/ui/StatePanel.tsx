import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import { cn } from "@musallih/shared";

type StateTone = "loading" | "empty" | "error";

const toneConfig: Record<
  StateTone,
  { icon: typeof LoaderCircle; title: string; iconClass: string; panelClass: string }
> = {
  loading: {
    icon: LoaderCircle,
    title: "Loading",
    iconClass: "animate-spin text-accent",
    panelClass: "border-border bg-card/80",
  },
  empty: {
    icon: Inbox,
    title: "No data yet",
    iconClass: "text-muted-foreground",
    panelClass: "border-dashed border-border bg-muted/40",
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    iconClass: "text-destructive",
    panelClass: "border-destructive/40 bg-destructive/10",
  },
};

interface StatePanelProps {
  tone: StateTone;
  title?: string;
  description: string;
  className?: string;
}

export function StatePanel({ tone, title, description, className }: StatePanelProps) {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-xl border p-6 text-sm", config.panelClass, className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconClass)} />
        <div>
          <h3 className="font-medium text-foreground">{title ?? config.title}</h3>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
