import { cn } from "@musallih/shared";

type StatusTone = "success" | "warning" | "danger" | "neutral";

const toneClassMap: Record<StatusTone, string> = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  danger: "border-rose-500/30 bg-rose-500/10 text-rose-300",
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
