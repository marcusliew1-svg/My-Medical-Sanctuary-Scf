import type { Metadata } from "next";
import Image from "next/image";
import { EditorialHero, EditorialStatement, FinalInvitation, JourneyLine } from "@/components/Editorial";
import { RevealCardGrid } from "@/components/ExperienceCards";
import { LongevityIntelligence } from "@/components/LongevityIntelligence";
import { LingHealthPreview } from "@/components/LingHealthPreview";
import { MembershipDepth } from "@/components/MembershipDepth";
import { SanctuaryExperience } from "@/components/SanctuaryExperience";
import { IntelligenceEditorial } from "@/components/IntelligenceEditorial";
import { EvidenceStandard } from "@/components/EvidenceStandard";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "My Medical Sanctuary combines preventive care, advanced diagnostics, physician review and personalised longevity planning.",
};

const goals = [
  {
    title: "Understand my health",
    eyebrow: "Baseline",
    text: "Know where you stand before symptoms dictate the conversation.",
    detail: "Build a clearer health baseline through screening, context and physician-led review.",
    image: "/mms-diagnostics-screening.png",
    href: "/health-screening",
  },
  {
    title: "Age well",
    eyebrow: "Longevity",
    text: "Protect function, resilience and independence for the years ahead.",
    detail: "Personalised longevity begins with your history, risks, goals and trends over time.",
    image: "/mms-doctor-couple-consult.png",
    href: "/longevity-medicine",
  },
  {
    title: "Improve vitality",
    eyebrow: "Performance",
    text: "Understand the patterns behind energy, sleep and metabolic health.",
    detail: "Connect lifestyle, biomarkers and physician interpretation before choosing interventions.",
    image: "/mms-doctor-results-review.png",
    href: "/health-discovery",
  },
  {
    title: "Explore advanced care",
    eyebrow: "Suitability first",
    text: "Understand what is relevant before deciding what is appropriate.",
    detail: "Advanced options deserve evidence-aware discussion, suitability review and realistic expectations.",
    image: "/mms-concierge-lounge.png",
    href: "/treatments",
  },
];

const method = [
  { title: "Discover", text: "Your goals, concerns, history and priorities come first." },
  { title: "Measure", text: "Screening and diagnostics build a more complete baseline." },
  { title: "Understand", text: "Doctors interpret the signals, context and what deserves attention." },
  { title: "Optimise", text: "A personalised plan turns findings into practical next steps." },
  { title: "Monitor", text: "Longitudinal review helps you see what is changing over time." },
];

export default function HomePage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Preventive care • Personalised longevity"
        title="Know earlier. Live better."
        lead="Advanced diagnostics, physician-guided prevention and personalised longevity care — built around you."
        image="/ling-mms-guide.png"
        imageAlt="Ling, the MMS virtual health spokesperson, introducing the preventive health journey."
        imagePosition="72% center"
        primaryLabel="Start my health assessment"
        primaryHref="/health-discovery"
        secondaryLabel="Explore MMS"
        secondaryHref="/how-it-works"
        showHealthSignals
        spokespersonName="Ling"
        spokespersonMessage="I’ll help you understand where to begin, what your results mean in plain language, and when it is time to speak with your MMS doctor."
        trustItems={[
          { title: "Discover earlier", text: "Build a clearer picture before symptoms define the story." },
          { title: "Doctors interpret", text: "Clinical judgement remains at the centre of every decision." },
          { title: "Personalised care", text: "Your risks, priorities and goals shape the pathway." },
          { title: "Follow the trend", text: "Longitudinal monitoring adds context that one-off tests cannot." },
        ]}
      />

      <EditorialStatement
        eyebrow="Why earlier matters"
        title="Most healthcare starts when something goes wrong. MMS starts before that."
        lead="Risk can develop quietly for years. MMS is designed to help you understand more of the picture, identify what deserves attention and make better-informed health decisions with your doctor."
      />

      <LongevityIntelligence />

      <EvidenceStandard />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Start with you</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              You do not need to arrive with a treatment in mind.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              Begin with what you want to understand about your health. MMS helps turn that question into the right assessment,
              medical review and next step.
            </p>
          </div>
          <RevealCardGrid items={goals} />
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="editorial-kicker mb-4 text-deep-green">The MMS journey</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Discover. Measure. Understand. Optimise. Monitor.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-warm-gray">
              One connected health relationship designed to become more useful as your history, results and trends become clearer.
            </p>
          </div>
          <JourneyLine steps={method} />
        </div>
      </section>

      <MembershipDepth />

      <LingHealthPreview />

      <SanctuaryExperience />

      <IntelligenceEditorial />

      <section className="relative overflow-hidden bg-navy px-4 py-20 text-ivory md:py-28">
        <Image src="/mms-medicine-access-consult.png" alt="" fill className="-z-0 object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-navy/82" />
        <div className="relative mx-auto max-w-6xl">
          <p className="editorial-kicker mb-4 text-gold-light">Continuity across borders</p>
          <h2 className="max-w-4xl text-balance font-serif text-4xl leading-tight md:text-6xl">
            Your health relationship should remain understandable wherever care takes you.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["Malaysia", "Your core MMS preventive-health relationship and continuity of care."],
              ["Thailand", "Selected specialist and regional-care pathways where appropriate."],
              ["MMS", "One organised patient story across assessments, conversations and next steps."],
            ].map(([title, text]) => (
              <div key={title} className="border-t border-gold/45 pt-5">
                <h3 className="font-serif text-3xl">{title}</h3>
                <p className="mt-3 leading-7 text-ivory/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalInvitation
        title="Your future health starts with what you understand today."
        lead="Begin with an assessment. Build clarity with your doctor. Keep following what changes."
      />
    </main>
  );
}
