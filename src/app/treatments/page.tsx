import type { Metadata } from "next";
import {
  CTASection,
  EditorialSplit,
  HealthIntelligenceFeature,
  ImageFeature,
  JourneyStepRail,
  PublicHero,
  SectionHeading,
} from "@/components/PublicExperience";

export const metadata: Metadata = {
  title: "Care & Treatments",
  description:
    "Educational treatment areas at MMS, organised around health purpose, suitability and professional review rather than self-selection.",
};

const areas = [
  {
    title: "Screening & Prevention",
    eyebrow: "Start here",
    text: "What should be measured, why it matters and what deserves follow-up.",
    detail: "Screening creates context before advanced options or programmes are considered.",
    image: "/mms-diagnostics-screening.png",
    href: "/health-screening",
  },
  {
    title: "Longevity & Cellular Wellness",
    eyebrow: "Ageing well",
    text: "Understand vitality, resilience and cellular-health conversations responsibly.",
    detail: "Longevity discussions should name uncertainty clearly and stay grounded in review.",
    image: "/mms-doctor-couple-consult.png",
    href: "/longevity-medicine",
  },
  {
    title: "Metabolic & Hormonal Health",
    eyebrow: "Clinical context",
    text: "Energy, weight, glucose, hormones and habits in context.",
    detail: "Symptoms should be connected to history, screening and professional judgement.",
    image: "/mms-doctor-results-review.png",
    href: "/weight-management",
  },
  {
    title: "Regenerative Recovery",
    eyebrow: "Educational only",
    text: "Advanced therapies require careful indication and suitability review.",
    detail: "MMS must avoid broad claims and explain evidence, product quality and clinical boundary.",
    image: "/mms-service-collage.webp",
    href: "/treatments/research",
  },
  {
    title: "Recovery & Performance",
    eyebrow: "Supportive care",
    text: "Stress, travel, fatigue and resilience need a structured question.",
    detail: "Supportive therapies should never distract from investigating unexplained symptoms.",
    image: "/mms-concierge-lounge.png",
  },
  {
    title: "Medicine Access Intelligence",
    eyebrow: "In development",
    text: "Understand why availability and cost can differ by country.",
    detail: "Public education only. Patient-specific review belongs in future authenticated workflows.",
    image: "/mms-medicine-access-consult.png",
    href: "/international-medicine-access",
  },
];

const reviewPath = [
  { title: "Purpose", text: "What are we trying to understand or improve?" },
  { title: "Evidence", text: "What is established, uncertain or indication-specific?" },
  { title: "Suitability", text: "What makes this appropriate or inappropriate for this person?" },
  { title: "Review", text: "What should a qualified professional decide?" },
];

export default function TreatmentsPage() {
  return (
    <main>
      <PublicHero
        eyebrow="Care & Treatments"
        title="Advanced care should begin with better understanding."
        brandLine="Education first. Suitability before selection."
        lead="MMS organises treatment education around patient goals, evidence boundaries and professional review, not a public menu of promises."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor and patient reviewing health information."
        primaryLabel="Start with Screening"
        primaryHref="/health-screening"
        secondaryLabel="Health Intelligence"
        secondaryHref="/health-intelligence"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <SectionHeading
            eyebrow="Health purpose"
            title="Patients need context before choices."
            lead="A world-class clinic helps people understand the question behind the treatment before asking them to choose a pathway."
          />
          <ImageFeature items={areas} />
        </div>
      </section>

      <EditorialSplit
        eyebrow="Professional boundary"
        title="No advanced-care decision should come straight from a webpage."
        lead="MMS should educate clearly, then move patients toward assessment, suitability review and human medical judgement."
        image="/mms-diagnostics-screening.png"
        imageAlt="Preventive diagnostics and screening environment."
        dark
        reverse
      >
        <JourneyStepRail steps={reviewPath} dark />
      </EditorialSplit>

      <HealthIntelligenceFeature />

      <CTASection title="Begin with what you want to understand, not what you want to buy." />
    </main>
  );
}
