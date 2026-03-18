import {
  HeroSection,
  VisionSection,
  FeaturesSection,
  OpenSourceSection,
  StatusStrip,
  Footer,
} from "@/components/landing";

export function Index() {
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
