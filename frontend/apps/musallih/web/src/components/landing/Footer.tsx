import { Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@musallih/shared";

export function Footer() {
  return (
    <footer className="py-16 border-t border-border/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className={cn("text-2xl font-bold", "text-gradient")}>
            {siteConfig.name}
          </span>
          <div className="flex gap-6">
            {siteConfig.footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Built with <Heart className="inline h-4 w-4 fill-accent text-accent" /> for the Ummah
        </p>
      </div>
    </footer>
  );
}
