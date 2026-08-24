import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel, SplitStory } from "@/components/Editorial";
import { RevealCardGrid } from "@/components/ExperienceCards";
import { LingPanel } from "@/components/LingPanel";
import { lingDisclaimer, lingOptions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ling | My Medical Sanctuary",
  description: "Ling is the MMS AI Health Education Companion for learning, organising questions and preparing for doctor-led care.",
};

const lingRoles = [
  {
    title: "Welcoming guide",
    eyebrow: "Begin",
    text: "Helps you name what brought you here.",
    detail: "Ling can turn a vague worry into a clearer first question for MMS.",
    image: "/ling-concierge.png",
  },
  {
    title: "Knowledge companion",
    eyebrow: "Learn",
    text: "Explains concepts in plain language.",
    detail: "Ling can explain screening, longevity, metabolic health and medicine access concepts without diagnosing.",
    image: "/ling-knowledge.png",
  },
  {
    title: "Regional care guide",
    eyebrow: "Navigate",
    text: "Helps frame cross-country healthcare questions.",
    detail: "Ling can explain why systems, prices and access pathways may differ before licensed review.",
    image: "/ling-regional.png",
  },
  {
    title: "Continuity guide",
    eyebrow: "Continue",
    text: "Helps you prepare for follow-up.",
    detail: "Ling can organise questions for your next MMS conversation and remind you where doctor review is needed.",
    image: "/ling-continuity.png",
  },
];

export default function LingPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Ling"
        title="Your personal health concierge for better questions."
        lead="Ask. Understand. Prepare. Ling helps you organise what matters before doctor-led care."
        image="/ling-knowledge.png"
        imageAlt="Ling, the MMS AI Health Education Companion."
        primaryLabel="Ask Ling"
        secondaryLabel="Speak with MMS"
        secondaryHref="/contact"
        imagePosition="52% center"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">What brings you here?</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Start with the question, not the programme.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              Ling is best for orientation. Personal medical advice belongs with an MMS doctor.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {lingOptions.slice(0, 6).map((option) => (
              <div key={option} className="rounded-[1rem] border border-gold-light/45 bg-white/80 p-5 text-lg text-charcoal shadow-[0_18px_44px_rgba(11,26,46,0.06)]">
                {option}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker mb-4 text-gold-light">Ling visual system</p>
              <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
                One guide, different moments in the journey.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ivory/66">
              Hover each role to see how Ling should support patients without replacing care.
            </p>
          </div>
          <RevealCardGrid items={lingRoles} />
        </div>
      </section>

      <SplitStory
        eyebrow="Boundary"
        title="Ling is useful because the boundary is clear."
        lead={lingDisclaimer}
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor-led consultation remains central to MMS care."
        dark
        reverse
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-t border-gold/45 pt-5">
            <h3 className="font-serif text-3xl text-ivory">Ling can</h3>
            <p className="mt-3 leading-7 text-ivory/70">Explain concepts, organise questions and prepare you for consultation.</p>
          </div>
          <div className="border-t border-gold/45 pt-5">
            <h3 className="font-serif text-3xl text-ivory">Ling cannot</h3>
            <p className="mt-3 leading-7 text-ivory/70">Diagnose, prescribe, interpret personal results or replace an MMS doctor.</p>
          </div>
        </div>
      </SplitStory>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <ImagePanel src="/ling-concierge.png" alt="Ling welcoming patients." className="min-h-[440px] rounded-[1.5rem] shadow-premium" objectPosition="50% center" />
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Prototype panel</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-5xl">
              A simple education layer, not a medical decision engine.
            </h2>
            <div className="mt-10">
              <LingPanel />
            </div>
          </div>
        </div>
      </section>

      <FinalInvitation title="You can begin with a question." lead="Ling can help you prepare, then MMS can guide the next step." />
    </main>
  );
}
