import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, JourneyLine } from "@/components/Editorial";
import { SilentRiskStory } from "@/components/SilentRiskStory";
import { EarlyVsLateStory } from "@/components/EarlyVsLateStory";
import { LongevityIntelligence } from "@/components/LongevityIntelligence";
import { LingHealthPreview } from "@/components/LingHealthPreview";
import { MembershipDepth } from "@/components/MembershipDepth";
import { SanctuaryExperience } from "@/components/SanctuaryExperience";
import { EvidenceStandard } from "@/components/EvidenceStandard";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "My Medical Sanctuary helps people understand and monitor their health earlier through physician-led prevention, appropriate diagnostics and personalised longevity care.",
};

const method = [
  { title: "Discover", text: "What changed? What matters?" },
  { title: "Measure", text: "Check the right signals." },
  { title: "Understand", text: "Doctor-led interpretation." },
  { title: "Optimise", text: "Act where it makes sense." },
  { title: "Monitor", text: "Follow what changes." },
];

export default function HomePage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Preventive care • Personalised longevity"
        title="Know earlier. Act sooner."
        lead="MMS helps you understand and monitor your health before silent changes become serious problems."
        image="/ling-mms-guide.png"
        imageAlt="Ling, the MMS virtual health spokesperson, introducing the preventive health journey."
        imagePosition="72% center"
        primaryLabel="Check my health"
        primaryHref="/health-discovery"
        secondaryLabel="See how MMS works"
        secondaryHref="/how-it-works"
        showHealthSignals
        spokespersonName="Ling"
        spokespersonMessage="Start with me. I’ll help organise what you want to understand before your doctor reviews what matters."
        trustItems={[
          { title: "Check earlier", text: "Before symptoms force the conversation." },
          { title: "Doctor interpreted", text: "Signals need clinical context." },
          { title: "Monitor trends", text: "One result is only a snapshot." },
          { title: "Act proportionately", text: "More testing is not always better." },
        ]}
      />

      <SilentRiskStory />

      <EarlyVsLateStory />

      <section className="bg-ivory px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <p className="editorial-kicker mb-4 text-deep-green">Your MMS plan</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Five steps. One health relationship.
            </h2>
          </div>
          <JourneyLine steps={method} />
        </div>
      </section>

      <LongevityIntelligence />

      <LingHealthPreview />

      <MembershipDepth />

      <SanctuaryExperience />

      <EvidenceStandard />

      <FinalInvitation
        title="Do not wait for a health scare to start paying attention."
        lead="Start with what you want to understand. Build a baseline. Keep monitoring what matters."
      />
    </main>
  );
}
