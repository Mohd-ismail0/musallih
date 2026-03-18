import { motion } from "framer-motion";
import { Building2, Globe, Plug, Circle } from "lucide-react";
import { siteConfig } from "@/config/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Globe,
  Plug,
  Circle,
};

const getIcon = (iconName: string) => iconMap[iconName] || Circle;

export function VisionSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {siteConfig.vision.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={item.title}
                className="group p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-accent/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors mb-4">
                  <Icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
