import type { Metadata } from "next";
import {
  CTASection,
  EditorialSplit,
  HealthIntelligenceFeature,
  ImageFeature,
  JourneyStepRail,
  LocationFeature,
  PublicHero,
  SectionHeading,
  TrustBar,
} from "@/components/PublicExperience";
import { mmsLocations } from "@/data/locations";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "My Medical Sanctuary is a doctor-led preventive healthcare and personalised longevity platform built around assessment, professional review and continuity.",
};

const trustItems = [
  { title: "Physician-guided", text: "Professional review before personalised recommendations." },
  { title: "Suitability-first", text: "Programmes begin with context, not pressure." },
  { title: "Evidence-aware", text: "Clear about what is known, uncertain and worth reviewing." },
  { title: "Privacy-minded", text: "Discretion and consent are part of the experience." },
  { title: "Continuity-focused", text: "Care is organised beyond a single appointment." },
  { title: "Human-led", text: "Technology supports. Qualified professionals decide." },
];

const healthGoals = [
  {
    title: "Healthy Ageing",
    eyebrow: "Longer view",
    text: "Plan for strength, independence and resilience.",
    detail: "Begin with screening, history and a clinician-led understanding of what deserves attention.",
    image: "/mms-doctor-couple-consult.png",
    href: "/longevity-medicine",
  },
  {
    title: "Energy & Recovery",
    eyebrow: "Daily vitality",
    text: "Explore fatigue, sleep, stress and recovery patterns.",
    detail: "MMS helps organise the question before any supplement, infusion or advanced option is discussed.",
    image: "/mms-doctor-results-review.png",
    href: "/health-discovery",
  },
  {
    title: "Weight & Metabolic Health",
    eyebrow: "Metabolic clarity",
    text: "Understand glucose, body composition and lifestyle signals.",
    detail: "The pathway starts with assessment and suitability review rather than a one-size treatment plan.",
    image: "/mms-diagnostics-screening.png",
    href: "/weight-management",
  },
  {
    title: "Sleep & Stress",
    eyebrow: "Recovery systems",
    text: "Make stress, sleep and resilience part of the health conversation.",
    detail: "Patterns often matter as much as isolated results; MMS helps patients see both.",
    image: "/mms-concierge-lounge.png",
    href: "/health-concerns/poor-sleep-stress-recovery",
  },
  {
    title: "Hormone Health",
    eyebrow: "Professional review",
    text: "Discuss symptoms with appropriate testing and context.",
    detail: "Hormone conversations need careful benefit-risk review and are not based on symptoms alone.",
    image: "/mms-doctor-results-review.png",
    href: "/treatments/hormone-therapy",
  },
  {
    title: "Cancer Screening",
    eyebrow: "Early questions",
    text: "Understand what screening can and cannot answer.",
    detail: "MMS keeps cancer screening education careful: abnormal results need follow-up; normal results are not a guarantee.",
    image: "/mms-health-screening-hero.png",
    href: "/health-concerns/cancer-risk-early-detection",
  },
  {
    title: "Regenerative Recovery",
    eyebrow: "Advanced care",
    text: "Learn before considering regenerative options.",
    detail: "Advanced therapies need indication-specific evidence, product clarity and professional suitability assessment.",
    image: "/mms-medicine-access-consult.png",
    href: "/treatments",
  },
  {
    title: "Kidney Health",
    eyebrow: "Specialised care",
    text: "Bring renal risk and continuity into preventive planning.",
    detail: "Kidney health belongs inside a broader care journey, especially when long-term monitoring matters.",
    image: "/mms-diagnostics-screening.png",
    href: "/health-concerns",
  },
];

const careModel = [
  { title: "Assess", text: "Listen, screen and build a useful health baseline." },
  { title: "Personalise", text: "Shape the next step around findings, goals and suitability." },
  { title: "Care", text: "Coordinate qualified review, appointments and clear guidance." },
  { title: "Continue", text: "Keep long-term preventive health visible after the visit." },
];

export default function HomePage() {
  return (
    <main>
      <PublicHero
        eyebrow="My Medical Sanctuary"
        title="Your health deserves a longer view."
        brandLine="Preventive Care. Personalised Longevity. Physician-guided."
        lead="MMS is a doctor-led preventive healthcare and personalised longevity platform for people who want to understand their health earlier and plan with greater confidence."
        image="/mms-doctor-couple-consult.png"
        imageAlt="Doctor reviewing health goals with a patient in a private consultation room."
        imagePosition="62% center"
      />
      <TrustBar items={trustItems} />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <SectionHeading
            eyebrow="What matters most to you?"
            title="Start from the concern, not the treatment name."
            lead="A premium health journey begins by understanding what the patient is trying to protect, improve or clarify."
          />
          <ImageFeature items={healthGoals} />
        </div>
      </section>

      <EditorialSplit
        eyebrow="The MMS care model"
        title="Technology supports. MMS coordinates. Qualified professionals decide."
        lead="Ling can help patients prepare better questions. Health Relationship Managers keep the journey organised. Doctors remain responsible for personalised medical judgement."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor reviewing health information with a patient."
        dark
        reverse
      >
        <JourneyStepRail steps={careModel} dark />
      </EditorialSplit>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-8 md:grid-cols-[0.78fr_1fr] md:items-end">
            <SectionHeading
              eyebrow="MMS network"
              title="One MMS. Three specialised centres."
              lead="Each location must be presented according to its approved status, so the public experience never implies an unapproved operation."
            />
            <p className="text-sm leading-7 text-warm-gray">
              Release 1B uses a structured location model. Addresses, detailed services and operational language should be added only after owner and regulatory approval.
            </p>
          </div>
          <LocationFeature locations={mmsLocations} />
        </div>
      </section>

      <HealthIntelligenceFeature />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <SectionHeading
            eyebrow="Memberships"
            title="Four depths of ongoing health management."
            lead="Membership should feel like continuity, coordination and memory. It should not feel like a public price shelf."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {memberships.map((membership) => (
              <article key={membership.name} className="border-t border-gold/35 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{membership.accessNote}</p>
                <h3 className="mt-3 font-serif text-3xl text-navy">{membership.name}</h3>
                <p className="mt-2 font-semibold text-deep-green">{membership.tagline}</p>
                <p className="mt-4 text-sm leading-6 text-warm-gray">{membership.whoItSuits}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <EditorialSplit
        eyebrow="My Sanctuary"
        title="A future relationship layer for appointments, health journeys and trusted continuity."
        lead="My Sanctuary remains gated in production. Release 1B presents the idea tastefully without exposing an unfinished portal."
        image="/ling-mms-guide.png"
        imageAlt="MMS digital guide visual representing the future My Sanctuary patient layer."
        imagePosition="50% 20%"
      >
        <div className="grid gap-4 border-y border-gold/35 py-6 sm:grid-cols-2">
          {["Appointments", "Membership", "Health journey", "Medicine review", "Future health passport", "Ling"].map((item) => (
            <p key={item} className="text-sm font-semibold uppercase tracking-[0.12em] text-deep-green">{item}</p>
          ))}
        </div>
      </EditorialSplit>

      <CTASection />
    </main>
  );
}
