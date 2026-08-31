import type { Metadata } from "next";
import {
  CTASection,
  EditorialSplit,
  ImageFeature,
  JourneyStepRail,
  PublicHero,
  SectionHeading,
  TrustBar,
} from "@/components/PublicExperience";

export const metadata: Metadata = {
  title: "Health Intelligence",
  description:
    "MMS Health Intelligence helps patients understand preventive health, longevity science, treatment education, medicine access and regional care questions.",
};

const intelligenceAreas = [
  {
    title: "Preventive Health",
    eyebrow: "Earlier clarity",
    text: "Understand risks, screening and baseline health before problems feel urgent.",
    detail:
      "Public content should help patients ask better questions and decide when medical review is appropriate.",
    image: "/mms-diagnostics-screening.png",
    href: "/health-screening",
  },
  {
    title: "Longevity Science",
    eyebrow: "Evidence-aware",
    text: "Ageing, resilience and vitality explained with careful boundaries.",
    detail:
      "MMS should separate promising science from proven care and personal suitability.",
    image: "/mms-doctor-couple-consult.png",
    href: "/longevity-medicine",
  },
  {
    title: "Treatments Explained",
    eyebrow: "Context first",
    text: "Learn what an advanced option is, what is uncertain and what to ask.",
    detail:
      "Treatment education should point toward clinician review, not self-selection.",
    image: "/mms-doctor-results-review.png",
    href: "/treatments",
  },
  {
    title: "Medicine Intelligence",
    eyebrow: "In development",
    text: "A future way to understand international medicine cost and access questions.",
    detail:
      "No fabricated prices. Patient-specific review, saved data and uploads will require authenticated My Sanctuary access.",
    image: "/mms-medicine-access-consult.png",
    href: "/international-medicine-access",
  },
  {
    title: "Regional Care Intelligence",
    eyebrow: "Malaysia + Thailand",
    text: "Understand why care pathways, systems and access may differ by country.",
    detail:
      "Regional care content must stay jurisdiction-aware and avoid implying guaranteed availability.",
    image: "/mms-concierge-lounge.png",
    href: "/malaysia-thailand-care",
  },
];

const medicinePreview = [
  {
    title: "Same-product comparison",
    text: "Understand why the same medicine can appear under different cost structures across countries.",
  },
  {
    title: "Generic matching questions",
    text: "Learn when active ingredient, formulation, registration and prescriber review matter.",
  },
  {
    title: "Medication cost review",
    text: "Frame a responsible access question before any licensed professional or supplier conversation.",
  },
  {
    title: "Private review later",
    text: "Patient-specific documents, prescriptions and saved data belong inside future authenticated My Sanctuary access.",
  },
];

export default function HealthIntelligencePage() {
  return (
    <main>
      <PublicHero
        eyebrow="Health Intelligence"
        title="Healthcare is global. Prices aren't."
        brandLine="Understand the system before you make the next move."
        lead="MMS Health Intelligence is the public education layer for preventive health, longevity science, treatment education and regional access questions."
        image="/mms-medicine-intelligence.webp"
        imageAlt="Medicine and health intelligence visual for MMS."
        primaryLabel="Explore Medicine Intelligence"
        primaryHref="/international-medicine-access"
        secondaryLabel="Start Discovery"
        secondaryHref="/contact"
        imagePosition="58% center"
        tone="intelligence"
      />

      <TrustBar
        items={[
          {
            title: "Educational",
            text: "Designed to improve understanding, not replace consultation.",
          },
          {
            title: "No fake prices",
            text: "Release 1B does not publish invented comparison data.",
          },
          {
            title: "Review needed",
            text: "Patient-specific workflows require professional review.",
          },
          {
            title: "Jurisdiction-aware",
            text: "Country rules and licensing matter.",
          },
          {
            title: "Private later",
            text: "Saved data belongs inside future My Sanctuary access.",
          },
          {
            title: "MMS-led",
            text: "A trusted layer between curiosity and care.",
          },
        ]}
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.74fr_1.26fr]">
          <SectionHeading
            eyebrow="Editorial authority"
            title="Patients need a place to understand what they are hearing."
            lead="Health Intelligence should feel like MMS helping the patient think clearly before money, medicine or treatment decisions enter the conversation."
          />
          <ImageFeature items={intelligenceAreas} />
        </div>
      </section>

      <EditorialSplit
        eyebrow="Medicine Intelligence preview"
        title="A future revenue stream built on verified understanding, not medicine selling."
        lead="The public site can explain the problem: patients see different prices across America, Gulf markets, Australia, Singapore, Indonesia, Malaysia and Thailand. The paid value later is structured review and coordination, not a public price engine."
        image="/mms-medicine-access-consult.png"
        imageAlt="Private medicine access discussion with a professional."
        dark
        reverse
      >
        <JourneyStepRail steps={medicinePreview} dark />
      </EditorialSplit>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Patient boundary"
            title="No buy button. No self-sourcing. No personalised advice in public."
            lead="Medicine Intelligence must stay medically and legally careful. The public shell explains why questions matter; personalised review comes later through authenticated, consent-based workflows."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              "Public education remains open.",
              "Personalised medication review requires My Sanctuary later.",
              "Prescribing, dispensing, dosage and availability stay with licensed professionals.",
            ].map((item) => (
              <p
                key={item}
                className="border-t border-gold/35 pt-5 text-lg leading-8 text-warm-gray"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Start with the question you are trying to answer."
        lead="MMS can help you understand whether your next step is screening, professional review, care travel or a future private medicine-access discussion."
      />
      <section className="bg-ivory px-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
          <a
            href="/health-intelligence/medicine-prices"
            className="rounded-md border border-navy/25 px-5 py-3 text-sm font-semibold text-navy"
          >
            Explore medicine prices
          </a>
          <a
            href="/health-intelligence/generic-medicines"
            className="rounded-md border border-navy/25 px-5 py-3 text-sm font-semibold text-navy"
          >
            Explore generic medicines
          </a>
          <a
            href="/health-intelligence/medication-cost-review"
            className="rounded-md bg-navy px-5 py-3 text-sm font-semibold text-ivory"
          >
            Start a cost review
          </a>
        </div>
      </section>
    </main>
  );
}
