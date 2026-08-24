import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { EditorialHero, FinalInvitation, SplitStory } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "SCF Lab Roadmap | My Medical Sanctuary",
  description:
    "Learn how MMS frames future clinical and lab capability through a careful roadmap subject to regulatory, licensing and professional requirements.",
};

const roadmap = [
  {
    title: "Clinical need first",
    text: "Future capability should support patient education, screening and doctor-led review rather than distract from them.",
  },
  {
    title: "Governance before expansion",
    text: "Licensing, qualified professionals, quality systems and regulatory pathways must come before operational claims.",
  },
  {
    title: "ASEAN-ready thinking",
    text: "Malaysia comes first, with future regional planning shaped by each market's professional and legal requirements.",
  },
];

export default function SCFLabRoadmapPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="SCF Lab Roadmap"
        title="Future capability, built with restraint."
        lead="MMS is the patient-facing health journey. SCF represents a longer-term clinical and laboratory capability roadmap that must develop carefully."
        image="/mms-health-screening-hero.png"
        imageAlt="Clinical review and diagnostic planning."
        primaryLabel="Start discovery"
        primaryHref="/contact"
        secondaryLabel="Understand MMS"
        secondaryHref="/about-mms"
      />

      <SplitStory
        eyebrow="Positioning"
        title="Ambition should increase trust, not outpace governance."
        lead="This page exists to explain direction without overstating what exists today. A world-class health platform earns credibility by naming its boundaries clearly."
        image="/mms-about-hero.png"
        imageAlt="Doctor-led healthcare planning discussion."
        reverse
      >
        <div className="grid gap-6">
          {roadmap.map((item) => (
            <article key={item.title} className="border-t border-gold/40 pt-5">
              <h2 className="font-serif text-3xl text-navy">{item.title}</h2>
              <p className="mt-3 leading-7 text-warm-gray">{item.text}</p>
            </article>
          ))}
        </div>
      </SplitStory>

      <section className="bg-warm-white px-4 py-20 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="editorial-kicker mb-4 text-deep-green">Roadmap boundary</p>
          <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
            The right language matters.
          </h2>
          <p className="mt-6 text-lg leading-8 text-warm-gray">
            This is readiness planning. It is not a claim of current manufacturing, product approval
            or confirmed advanced laboratory operations.
          </p>
          <div className="mt-10">
            <DisclaimerBox title="Clinical and lab roadmap">
              <p>
                MMS aims to develop deeper clinical and lab capability in 2027, subject to regulatory,
                licensing, funding, technical and professional requirements.
              </p>
            </DisclaimerBox>
          </div>
        </div>
      </section>

      <FinalInvitation
        title="Future capability should serve patient clarity."
        lead="Start with the MMS health journey today; let future infrastructure develop under the right governance."
      />
    </main>
  );
}
