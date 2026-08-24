import { EditorialHero, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";
import { metadataFor } from "@/components/PatientEditorialPage";

export const metadata = metadataFor(
  "Our Philosophy",
  "MMS believes healthcare should be clearer, earlier, more personal and professionally reviewed.",
);

const principles = [
  { title: "Prevention", text: "Act earlier, before uncertainty becomes pressure." },
  { title: "Personalisation", text: "Respect the individual health profile and life context." },
  { title: "Education", text: "Help every patient leave more informed than when they arrived." },
  { title: "Judgement", text: "Keep clinical decisions with qualified professionals." },
  { title: "Continuity", text: "Support the patient after the first visit." },
];

export default function OurPhilosophyPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Our Philosophy"
        title="Clearer, earlier and more personal healthcare."
        lead="MMS believes better decisions begin with understanding, screening, doctor review and a roadmap that evolves with the patient."
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor-led preventive health review."
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="editorial-kicker mb-4 text-deep-green">Principles</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Premium care is calm because the principles are clear.
            </h2>
          </div>
          <JourneyLine steps={principles} />
        </div>
      </section>

      <SplitStory
        eyebrow="Respect"
        title="Strong systems create consistency. People create excellence."
        lead="MMS is built on humility, integrity and professionalism across patients, doctors, nurses, HRMs and staff."
        image="/mms-about-hero.png"
        imageAlt="Private consultation built around respect."
        dark
        reverse
      />

      <FinalInvitation title="Build your health plan on understanding." />
    </main>
  );
}
