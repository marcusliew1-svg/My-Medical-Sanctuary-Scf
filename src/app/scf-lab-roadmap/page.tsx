import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CapabilityStatus } from "@/components/CapabilityStatus";
import Image from "next/image";

export const metadata: Metadata = {
  title: "SCF Lab Roadmap",
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
        title="The future-science engine behind MMS."
        lead="SCF develops the capability roadmap. MMS turns it into a governed patient journey."
        primaryLabel="Start Discovery"
      />

      <section className="bg-ivory px-4 py-12">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-[#06382f] text-ivory shadow-premium md:grid-cols-[.72fr_1.28fr]">
          <div className="grid min-h-[280px] place-items-center bg-black p-8">
            <div className="relative h-44 w-full max-w-sm"><Image src="/scf-logo-new.png" alt="SCF" fill className="object-contain" sizes="380px" /></div>
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Science · Care · Future capability</p>
            <h2 className="mt-4 font-serif text-4xl">SCF builds the science layer.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">{[["01","Clinical need"],["02","Governance"],["03","ASEAN readiness"]].map(([number,label])=><div key={number} className="rounded-xl border border-gold/30 bg-white/5 p-4"><span className="text-xs text-gold-light">{number}</span><p className="mt-1 font-serif text-lg">{label}</p></div>)}</div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Positioning"
        title="From scientific capability to patient value."
        lead="A staged roadmap with visible status at every level."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {roadmap.map((item, index) => (
            <article key={item.title} className="rounded-lg border border-stone-200 bg-white p-6">
              <CapabilityStatus status={index === 0 ? "development" : "roadmap"} />
              <p className="mt-4 text-xs font-bold uppercase tracking-[.16em] text-gold">Stage 0{index + 1}</p>
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
