import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingNavbar } from "@/components/landing/navbar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      <LandingNavbar />

      <Hero />

      <Features />

      <HowItWorks />

      <CTA />

      <Footer />

    </main>
  );
}