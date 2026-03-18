import {
  HeroSection,
  VisionSection,
  FeaturesSection,
  OpenSourceSection,
  StatusStrip,
  Footer,
} from "@/components/landing";

export function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <VisionSection />
      <FeaturesSection />
      <OpenSourceSection />
      <StatusStrip />
      <Footer />
    </main>
  );
}
