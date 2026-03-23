import { cn } from "./utils";

/**
 * Shared class primitives for consistent, reusable UI building blocks.
 * Additive utilities only: consumers can adopt incrementally.
 */
export const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export const interactiveBaseClass =
  "inline-flex items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

export const navItemBaseClass =
  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors";

export const cardSurfaceClass = "rounded-lg border border-border/60 bg-background/60";

export const elevatedCardSurfaceClass = "rounded-lg border border-border bg-card";

type NavTone = "active" | "inactive";

export function getNavItemClass(tone: NavTone) {
  return cn(
    navItemBaseClass,
    tone === "active"
      ? "bg-accent/15 text-accent"
      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
  );
}
