import { motion } from "framer-motion";
import { GitBranch, Zap, Users, Radio, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { cn } from "@musallih/shared";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitBranch,
  Zap,
  Users,
  Radio,
  Circle,
};

const getIcon = (iconName: string) => iconMap[iconName] || Circle;

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="grid-pattern absolute inset-0" />
      <div className="noise absolute inset-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />

      <div className="relative z-10 container px-4 md:px-6 py-24 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {siteConfig.badges.map((b) => {
              const Icon = getIcon(b.icon);
              return (
                <Badge
                  key={b.label}
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium bg-secondary/50 border border-border/50 backdrop-blur-sm"
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {b.label}
                </Badge>
              );
            })}
          </div>

          <h1
            className={cn(
              "text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight",
              "text-gradient"
            )}
          >
            {siteConfig.name}
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            {siteConfig.tagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent text-base px-8"
              asChild
            >
              <a href={siteConfig.links.github}>View on GitHub</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/50 hover:bg-secondary/50 text-base px-8"
              asChild
            >
              <a href={siteConfig.links.architecture}>Architecture</a>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
