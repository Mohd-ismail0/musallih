import { cn } from "@musallih/shared";

type StatusTone = "success" | "warning" | "danger" | "neutral";

const toneClassMap: Record<StatusTone, string> = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-foreground",
  warning: "border-amber-500/40 bg-amber-500/10 text-foreground",
  danger: "border-rose-500/40 bg-rose-500/10 text-foreground",
  neutral: "border-border bg-secondary text-secondary-foreground",
};

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
}

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        toneClassMap[tone]
      )}
    >
      {label}
    </span>
  );
}
