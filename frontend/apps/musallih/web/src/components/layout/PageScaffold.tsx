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
    <section className="space-y-5 md:space-y-6">
      <header className="flex flex-col gap-3 border-b border-border/60 pb-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </header>
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 sm:p-5">{children}</div>
    </section>
  );
}
