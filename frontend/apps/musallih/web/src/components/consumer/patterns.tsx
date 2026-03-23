import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@musallih/shared";

export function SurfaceCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm shadow-black/10", className)}>
      {children}
    </div>
  );
}

export function MetaPair({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">{label}:</span>{" "}
      <span className="font-medium text-foreground">{value}</span>
    </p>
  );
}

export function SectionHeader({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {trailing}
    </div>
  );
}

export function StatusBadge({ openNow }: { openNow?: boolean }) {
  return <Badge variant={openNow ? "default" : "outline"}>{openNow ? "Open now" : "Closed"}</Badge>;
}
