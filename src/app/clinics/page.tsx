import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, SplitStory } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Locations",
  description: "MMS locations and care contexts across Bangsar, SS2 and regional care coordination.",
};

export default function ClinicsPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Locations"
        title="Each care setting should have a clear personality."
        lead="MMS is designed to feel warm, medically reliable and coordinated across the patient journey."
        image="/mms-about-hero.png"
        imageAlt="Private preventive healthcare setting."
        primaryLabel="Speak with MMS"
        secondaryLabel="Care travel"
        secondaryHref="/malaysia-thailand-care"
      />

      <SplitStory
        eyebrow="Bangsar"
        title="Warm preventive health and longevity planning."
        lead="A setting for discovery, screening conversations, health education and long-term relationship coordination."
        image="/mms-about-hero.png"
        imageAlt="Warm private healthcare consultation environment."
      />

      <SplitStory
        eyebrow="SS2"
        title="Clinical reliability and specialised care context."
        lead="SS2 should communicate medical depth, calm process and continuity without feeling cold or transactional."
        image="/mms-health-screening-hero.png"
        imageAlt="Clinical screening and medical review setting."
        dark
        reverse
      />

      <FinalInvitation title="Choose the setting after the right first conversation." />
    </main>
  );
}
