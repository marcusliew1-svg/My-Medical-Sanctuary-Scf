import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Health Discovery",
  description: "A calm first step for people who want to understand their health before choosing a programme.",
};

const questions = [
  { title: "What changed?", text: "Energy, weight, sleep, recovery, stress or symptoms." },
  { title: "What matters now?", text: "Family, work, travel, ageing, confidence or prevention." },
  { title: "What should be checked?", text: "Screening is chosen to support understanding." },
  { title: "Who should review it?", text: "Doctors decide clinical meaning and suitability." },
  { title: "What comes next?", text: "A practical plan, not a rushed purchase." },
];

export default function HealthDiscoveryPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Health Discovery"
        title="When you are not sure where to start, start with clarity."
        lead="Discovery reduces anxiety by turning vague concerns into better questions for screening and professional review."
        image="/mms-about-hero.png"
        imageAlt="Private consultation for health discovery."
        primaryLabel="Start discovery"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="editorial-kicker mb-4 text-deep-green">First conversation</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              The first step is not to choose a treatment.
            </h2>
          </div>
          <JourneyLine steps={questions} />
        </div>
      </section>

      <SplitStory
        eyebrow="Patient psychology"
        title="Good care helps people feel informed rather than sold to."
        lead="MMS discovery is designed to surface what deserves attention and what can wait for doctor review."
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor-led discussion of health priorities."
        dark
      />

      <FinalInvitation title="Bring your questions. We will help organise the next step." />
    </main>
  );
}
