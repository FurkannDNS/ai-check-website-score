import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { PillarsDeepDive } from "@/components/sections/pillars-deep-dive";
import { InteractiveDemo } from "@/components/sections/interactive-demo";
import { HowItWorks } from "@/components/sections/how-it-works";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { FaqSection } from "@/components/sections/faq-section";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section (Exact visual match with Reference Poster & 3D Medal) */}
      <HeroSection />

      {/* 2. Key Metrics & Proof */}
      <StatsSection />

      {/* 3. Interactive Verification Simulator (aireadybusiness.ai audit & demo) */}
      <InteractiveDemo />

      {/* 4. The 3 Core Pillars Deep Dive (7/24 AI İletişim, Daha Fazla Satış, AI'da Görünürlük) */}
      <PillarsDeepDive />

      {/* 5. 3-Step Process (Nasıl Çalışır?) */}
      <HowItWorks />

      {/* 6. Verified Customer Testimonials */}
      <TestimonialsSection />

      {/* 7. Transparent Pricing Plans */}
      <PricingSection />

      {/* 8. FAQ Accordion */}
      <FaqSection />
    </div>
  );
}
