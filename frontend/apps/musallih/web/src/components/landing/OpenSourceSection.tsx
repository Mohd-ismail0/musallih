import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@musallih/shared";

export function OpenSourceSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            {siteConfig.contributors.headline}
          </h2>
          <p className="text-muted-foreground text-lg">
            {siteConfig.contributors.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {siteConfig.contributors.roles.map((role) => (
              <div
                key={role}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full",
                  "bg-secondary/50 border border-border/50 text-sm font-medium",
                  "hover:border-accent/30 transition-all duration-300"
                )}
              >
                {role}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
