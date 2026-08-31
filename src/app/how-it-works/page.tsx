import type { Metadata } from "next";
import {
  CTASection,
  EditorialSplit,
  ImageFeature,
  JourneyStepRail,
  PublicHero,
  SectionHeading,
} from "@/components/PublicExperience";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "The MMS journey from discovery to assessment, doctor review, personalised planning and continuity.",
};

const journey = [
  { title: "Assess", text: "We listen, screen and build a useful baseline." },
  { title: "Personalise", text: "The plan is shaped around findings, goals and suitability." },
  { title: "Care", text: "Qualified professionals guide decisions and next steps." },
  { title: "Continue", text: "MMS keeps the journey organised over time." },
];

const roles = [
  {
    title: "Ling prepares",
    eyebrow: "Education",
    text: "Understand concepts before the appointment.",
    detail: "Ling helps organise questions while staying inside educational boundaries.",
    image: "/ling-concierge.png",
  },
  {
    title: "MMS coordinates",
    eyebrow: "Concierge",
    text: "Appointments and next steps become clearer.",
    detail: "Health Relationship Manager coordination helps patients feel guided between visits.",
    image: "/mms-concierge-lounge.png",
  },
  {
    title: "Doctors decide",
    eyebrow: "Clinical review",
    text: "Personalised medical recommendations remain professional-led.",
    detail: "Doctors interpret findings and decide suitability where appropriate.",
    image: "/mms-doctor-results-review.png",
  },
  {
    title: "Continuity follows",
    eyebrow: "Long view",
    text: "The journey does not end after one visit.",
    detail: "MMS is designed around long-term preventive planning.",
    image: "/mms-doctor-couple-consult.png",
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      <PublicHero
        eyebrow="Our Approach"
        title="A thoughtful journey. Designed around you."
        brandLine="Assess. Personalise. Care. Continue."
        lead="MMS helps patients move from uncertainty into structured assessment, doctor-led review, personalised planning and continuity."
        image="/mms-concierge-lounge.png"
        imageAlt="MMS care team welcoming patients into the health journey."
        primaryLabel="Begin Your Journey"
        primaryHref="/contact"
        secondaryLabel="Explore Health Intelligence"
        secondaryHref="/health-intelligence"
        imagePosition="56% center"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="The MMS method"
              title="The order matters."
              lead="A premium health journey should not ask patients to choose treatments first. It should help them understand, assess, review and continue."
            />
          </div>
          <JourneyStepRail steps={journey} />
        </div>
      </section>

      <EditorialSplit
        eyebrow="Patient psychology"
        title="Good care helps patients feel held, not hurried."
        lead="The visual experience should reflect the actual care promise: calm guidance, thoughtful sequencing, professional judgement and continuity."
        image="/mms-doctor-couple-consult.png"
        imageAlt="Doctor and patient discussing the care journey."
        dark
        reverse
      />

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="Who does what"
              title="The right role at the right moment."
              lead="Technology supports. MMS coordinates. Qualified professionals decide."
            />
          </div>
          <ImageFeature items={roles} />
        </div>
      </section>

      <CTASection title="Start with understanding, then move with guidance." />
    </main>
  );
}
