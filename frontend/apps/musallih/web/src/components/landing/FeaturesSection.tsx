import { motion } from "framer-motion";
import { Moon, MapPin, FileText, Shield, Code, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Moon,
  MapPin,
  FileText,
  Shield,
  Code,
  Heart,
};

const getIcon = (iconName: string) => iconMap[iconName] || Moon;

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 bg-secondary/20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {siteConfig.features.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 p-5 rounded-xl bg-card/30 border border-border/30 hover:border-accent/30 hover:bg-card/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
