import type { Metadata } from "next";
import { EditorialHero, EditorialStatement, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "About MMS",
  description:
    "Why My Medical Sanctuary exists: preventive healthcare, personalised longevity, medical responsibility and continuity.",
};

const thinking = [
  { title: "Earlier", text: "Understand risks and patterns before decisions become urgent." },
  { title: "Clearer", text: "Translate screening, symptoms and goals into useful next questions." },
  { title: "Safer", text: "Keep recommendations inside professional review and suitability boundaries." },
  { title: "Longer", text: "Build continuity instead of one-off wellness purchases." },
  { title: "Closer", text: "Coordinate care with human attention, privacy and follow-through." },
];

export default function AboutMMSPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="About MMS"
        title="A private institution for the health journey before illness."
        lead="MMS exists to move people from random health purchases into structured understanding, professional review and long-term continuity."
        image="/mms-about-hero.png"
        imageAlt="Doctor and patient in a private consultation."
        primaryLabel="Begin with discovery"
        secondaryLabel="Our method"
        secondaryHref="/how-it-works"
      />

      <EditorialStatement
        eyebrow="Why we exist"
        title="People should not have to wait for fear, symptoms or confusion before getting clarity."
        lead="MMS brings screening, doctor review, education, wellness programmes and care coordination into one quieter relationship."
      />

      <SplitStory
        eyebrow="How MMS thinks"
        title="Care should feel considered, not transactional."
        lead="Premium service matters, but the centre of gravity is medical responsibility: understand first, recommend later, follow up over time."
        image="/mms-health-screening-hero.png"
        imageAlt="Preventive health consultation with screening results."
        reverse
        imagePosition="60% center"
      >
        <JourneyLine compact steps={thinking} />
      </SplitStory>

      <section className="bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="editorial-kicker mb-4 text-gold-light">Responsibility</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              Boundaries create trust.
            </h2>
          </div>
          <div className="grid gap-7 text-lg leading-8 text-ivory/72">
            <p>Ling can explain, organise and prepare. Ling does not diagnose, prescribe or decide suitability.</p>
            <p>Advanced options are discussed individually and remain subject to professional review.</p>
            <p>Clinical and lab capability may develop over time, but only within regulatory, licensing, funding, technical and professional requirements.</p>
          </div>
        </div>
      </section>

      <FinalInvitation
        title="A better health journey starts with understanding."
        lead="Speak with MMS about the right first step for your goals, concerns and stage of life."
      />
    </main>
  );
}
