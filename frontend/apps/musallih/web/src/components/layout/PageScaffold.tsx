import type { ReactNode } from "react";

interface PageScaffoldProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageScaffold({
  title,
  description,
  actions,
  children,
}: PageScaffoldProps) {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="rounded-xl border border-border/60 bg-card/40 p-4">{children}</div>
    </section>
  );
}
