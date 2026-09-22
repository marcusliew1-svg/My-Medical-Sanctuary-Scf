import type { Metadata } from "next";
import { EditorialHero, FinalInvitation } from "@/components/Editorial";
import { SilentRiskStory } from "@/components/SilentRiskStory";
import { EarlyVsLateStory } from "@/components/EarlyVsLateStory";
import { PatientFirstFilm } from "@/components/PatientFirstFilm";
import { LingHealthPreview } from "@/components/LingHealthPreview";
import { MembershipDepth } from "@/components/MembershipDepth";
import { SanctuaryExperience } from "@/components/SanctuaryExperience";
import { EvidenceStandard } from "@/components/EvidenceStandard";
import { JourneyVisual, HealthTrendsVisual } from "@/components/CinematicHealthStories";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "My Medical Sanctuary helps people understand and monitor their health earlier through physician-led prevention, appropriate diagnostics and personalised longevity care.",
};

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

      <PatientFirstFilm />

      <JourneyVisual />

      <HealthTrendsVisual />

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
