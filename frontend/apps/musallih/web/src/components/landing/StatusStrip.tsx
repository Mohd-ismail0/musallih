import { Construction } from "lucide-react";
import { siteConfig } from "@/config/site";

export function StatusStrip() {
  return (
    <section className="py-12 bg-accent/5 border-y border-accent/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative">
            <Construction className="h-6 w-6 text-accent" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {siteConfig.status.message}
          </p>
        </div>
      </div>
    </section>
  );
}
