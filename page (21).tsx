import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

const pillars = [
  "Prevention before crisis",
  "Doctor-led decision making",
  "Education before treatment",
  "Long-term health planning",
];

export default function OurPhilosophyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our Philosophy"
        title="Clearer, earlier, and more personal healthcare."
        lead="MMS believes better health decisions begin with understanding, screening, doctor review, and a roadmap that evolves with the patient."
      />
      <Section
        eyebrow="Principles"
        title="Premium care is calm, structured, and clinically grounded."
        lead="We do not lead with isolated treatments. We lead with health understanding and doctor-led planning."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-xl font-semibold">{pillar}</h2>
            </div>
          ))}
        </div>
      </Section>
      <ConversionPanel title="Build your health plan on understanding." />
    </main>
  );
}
