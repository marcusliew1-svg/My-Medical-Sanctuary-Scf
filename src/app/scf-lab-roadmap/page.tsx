import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "SCF Lab Roadmap | My Medical Sanctuary",
  description:
    "Learn how MMS frames future clinical and lab capability through a careful roadmap subject to regulatory, licensing and professional requirements.",
};

const roadmap = [
  {
    title: "Clinical Need First",
    text: "MMS starts from patient education, screening and doctor-led review before considering deeper diagnostic or lab capability.",
  },
  {
    title: "Governance Before Expansion",
    text: "Future lab capability must be supported by licensing, qualified professionals, quality systems and appropriate regulatory pathways.",
  },
  {
    title: "ASEAN-Ready Thinking",
    text: "The roadmap is designed so MMS can grow carefully across Malaysia first, then future ASEAN markets where requirements differ.",
  },
];

export default function SCFLabRoadmapPage() {
  return (
    <main>
      <PageHero
        eyebrow="SCF Lab Roadmap"
        title="Future capability, built carefully."
        lead="MMS is patient-facing. SCF represents a longer-term biotechnology and laboratory capability roadmap that must develop responsibly."
        primaryLabel="Start Discovery"
      />

      <Section
        eyebrow="Positioning"
        title="MMS remains the health journey. SCF supports the future platform."
        lead="The public website should build trust by showing ambition without overstating what exists today."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {roadmap.map((item) => (
            <article key={item.title} className="rounded-lg border border-stone-200 bg-white p-6">
              <h2 className="font-serif text-2xl text-navy">{item.title}</h2>
              <p className="mt-4 leading-7 text-warm-gray">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Roadmap Boundary"
        title="The right language matters."
        lead="This page describes direction and readiness planning. It does not represent current manufacturing, product approval or confirmed advanced laboratory operations."
        className="bg-warm-white"
      >
        <DisclaimerBox title="Clinical and lab roadmap">
          <p>
            MMS aims to develop deeper clinical and lab capability in 2027, subject to
            regulatory, licensing, funding, technical and professional requirements.
          </p>
        </DisclaimerBox>
      </Section>

      <section className="bg-navy px-4 py-20 text-ivory">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-6xl">Start with patient clarity.</h2>
          <p className="mt-5 text-lg leading-8 text-ivory/72">
            Future capabilities should support better journeys, stronger systems and more informed care.
          </p>
          <div className="mt-8">
            <CTAButton href="/contact">Speak With MMS</CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
