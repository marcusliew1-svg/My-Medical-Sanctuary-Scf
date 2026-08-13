import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { JourneyVisual } from "@/components/JourneyVisual";
import { EcosystemVisual } from "@/components/EcosystemVisual";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Understand the MMS 8-step journey from discovery to review.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Hero
        eyebrow="How It Works"
        title="From first question to ongoing care."
        subtitle="See exactly who helps, who coordinates and who decides."
        primaryLabel="Start with Ling"
        primaryHref="/register"
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="The MMS Journey"
            title="Your care, moving forward."
            description="Ling organises. MMS coordinates. Doctors decide."
          />
          <JourneyVisual />
          <div className="mt-16"><SectionHeader eyebrow="The Ecosystem" title="Built around the patient." description="Four roles, one continuous relationship." /><EcosystemVisual /></div>
        </div>
      </section>
    </main>
  );
}
