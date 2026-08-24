import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero, FinalInvitation, ImagePanel, SplitStory } from "@/components/Editorial";
import { CareTeamStrip, MarketSignalPanel, RevealCardGrid } from "@/components/ExperienceCards";

export const metadata: Metadata = {
  title: "Treatments Explained | My Medical Sanctuary",
  description:
    "Educational treatment areas at MMS, organised around health purpose and suitability discussion rather than self-selection.",
};

const areas = [
  {
    title: "Screening & Prevention",
    eyebrow: "Start here",
    text: "What should be measured, why it matters, and what deserves follow-up.",
    detail:
      "Screening helps MMS understand baseline health before any programme or advanced option is considered.",
    image: "/mms-diagnostics-screening.png",
    href: "/health-screening",
  },
  {
    title: "Longevity & Cellular Wellness",
    eyebrow: "Ageing well",
    text: "How people discuss vitality and advanced options responsibly.",
    detail:
      "MMS frames longevity through evidence, uncertainty and suitability review, not public promises.",
    image: "/mms-doctor-couple-consult.png",
    href: "/longevity-medicine",
  },
  {
    title: "Metabolic & Hormonal Health",
    eyebrow: "Energy context",
    text: "Energy, weight, glucose, hormones and habits in context.",
    detail:
      "The conversation should connect symptoms, lifestyle, screening results and clinical judgement.",
    image: "/mms-doctor-results-review.png",
    href: "/weight-management",
  },
  {
    title: "Recovery & Performance",
    eyebrow: "Resilience",
    text: "Supportive care questions for stress, travel, fatigue and resilience.",
    detail:
      "Supportive care should be positioned around goals, medical history and appropriateness for the individual.",
    image: "/mms-medicine-access-consult.png",
  },
  {
    title: "Regenerative Support",
    eyebrow: "Educational only",
    text: "Advanced discussions remain subject to suitability review.",
    detail:
      "MMS should educate patients on boundaries, risks, evidence and professional review before any decision.",
    image: "/mms-diagnostics-screening.png",
  },
  {
    title: "International Medicine Access",
    eyebrow: "Access intelligence",
    text: "Why availability and cost can differ between countries.",
    detail:
      "MMS can help frame access questions across Malaysia, Thailand and other markets without acting as a public medicine shop.",
    image: "/mms-concierge-lounge.png",
    href: "/international-medicine-access",
  },
];

export default function TreatmentsPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Advanced care"
        title="Beyond today. Prepared for tomorrow."
        lead="This is an educational gateway, not a treatment shop. MMS begins with baseline understanding, doctor review and suitability before discussing advanced options."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor and patient reviewing health information."
        primaryLabel="Start with screening"
        primaryHref="/health-screening"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Health purpose</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Patients need context before choices.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              A premium clinic should help people understand the question behind the treatment:
              prevention, longevity, recovery, metabolic health, medicine access or specialist review.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ImagePanel priority src="/mms-diagnostics-screening.png" alt="Preventive diagnostics and screening." className="min-h-[230px] rounded-[1.2rem] shadow-premium" objectPosition="50% center" />
            <ImagePanel priority src="/mms-doctor-couple-consult.png" alt="Doctor consultation." className="min-h-[230px] rounded-[1.2rem] shadow-premium" objectPosition="50% center" />
            <ImagePanel priority src="/mms-concierge-lounge.png" alt="Patient concierge service." className="min-h-[230px] rounded-[1.2rem] shadow-premium" objectPosition="50% center" />
            <ImagePanel priority src="/mms-doctor-results-review.png" alt="Screening review." className="min-h-[230px] rounded-[1.2rem] shadow-premium" objectPosition="50% center" />
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker mb-4 text-gold-light">Explore with guidance</p>
              <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
                Learn what each area is really asking.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ivory/66">
              Hover each image to reveal the deeper patient question.
            </p>
          </div>
          <RevealCardGrid items={areas} />
        </div>
      </section>

      <SplitStory
        eyebrow="Medicine access strategy"
        title="Sometimes the same medicine is expensive in one country and more accessible in another."
        lead="That does not mean patients should self-source or compare prices alone. It means MMS needs an education and coordination layer that explains country rules, registration, supply, prescription requirements and continuity."
        image="/mms-medicine-access-consult.png"
        imageAlt="Patient concierge supporting regional medicine access questions."
        reverse
      >
        <div className="grid gap-4 border-y border-gold/40 py-6">
          {[
            "Malaysia and Thailand may differ in registration, supply chains, taxes and licensed access pathways.",
            "MMS can help patients frame the question before involving appropriate licensed professionals.",
            "No diagnosis, prescribing, dosage or dispensing is handled through the public website.",
          ].map((item) => (
            <p key={item} className="leading-7 text-warm-gray">
              {item}
            </p>
          ))}
          <Link href="/international-medicine-access" className="inline-flex text-sm font-semibold text-deep-green underline decoration-gold/50 underline-offset-8">
            Explore medicine access intelligence
          </Link>
        </div>
      </SplitStory>

      <MarketSignalPanel
        title="Medicine access is a real patient pain point, not a small footnote."
        lead="MMS can build a compliant revenue stream by educating patients on country-level cost signals, then offering verified access-intelligence discussions before licensed coordination."
      />

      <CareTeamStrip
        image="/mms-doctor-results-review.png"
        eyebrow="Advanced care boundary"
        title="Patients should feel guided before they feel sold to."
        text="Every advanced-care conversation should move through screening, suitability and professional review before programme or access decisions."
        points={["Purpose first", "Suitability", "Review"]}
      />

      <FinalInvitation title="Begin with what you want to understand, not what you want to buy." />
    </main>
  );
}
