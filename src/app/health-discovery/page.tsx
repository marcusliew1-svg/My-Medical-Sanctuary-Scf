import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";
import { DiscoverySignalMap } from "@/components/DiscoverySignalMap";

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
        lead="Discovery turns vague concerns into a structured starting picture: what changed, what shaped your risk, what may deserve measurement and what needs professional review."
        image="/ling-mms-guide.png"
        imageAlt="Ling, the MMS virtual health spokesperson, helping patients begin with health discovery."
        primaryLabel="Start discovery"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="72% center"
        spokespersonName="Ling"
        spokespersonMessage="Tell me what has changed or what you are concerned about. I’ll help organise the right questions before your MMS clinical review."
      />

      <DiscoverySignalMap />

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
        title="Good care should reduce uncertainty before it increases intervention."
        lead="MMS discovery is designed to surface what deserves attention, what may need measurement and what can reasonably wait for clinical review."
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor-led discussion of health priorities."
        dark
      />

      <FinalInvitation title="Bring your questions. We will help organise the next step." />
    </main>
  );
}
