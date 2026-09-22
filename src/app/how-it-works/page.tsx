import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel, JourneyLine, SplitStory } from "@/components/Editorial";
import { CareTeamStrip, RevealCardGrid } from "@/components/ExperienceCards";

export const metadata: Metadata = {
  title: "Our Approach | My Medical Sanctuary",
  description: "The MMS journey from discovery to assessment, doctor review, personalised planning and continuity.",
};

const journey = [
  { title: "Discover", text: "We listen to your story, concerns and health goals." },
  { title: "Measure", text: "Screening and diagnostics create a useful baseline." },
  { title: "Understand", text: "Your physician interprets findings and explains what matters." },
  { title: "Optimise", text: "A personalised plan is shaped around context and suitability." },
  { title: "Monitor", text: "Ongoing support follows trends and keeps the journey connected." },
];

const roles = [
  {
    title: "Ling prepares",
    eyebrow: "Education",
    text: "Understand concepts before the appointment.",
    detail: "Ling helps organise questions and reduce uncertainty, while staying inside educational boundaries.",
    image: "/mms-doctor-results-review.png",
  },
  {
    title: "MMS coordinates",
    eyebrow: "Concierge",
    text: "Appointments, reminders and next steps are made clearer.",
    detail: "Health Relationship Manager coordination helps patients feel guided after the first conversation.",
    image: "/mms-concierge-lounge.png",
  },
  {
    title: "Doctors decide",
    eyebrow: "Clinical review",
    text: "Personalised medical recommendations remain professional-led.",
    detail: "Doctors interpret findings, diagnose where appropriate and decide suitability for personalised pathways.",
    image: "/mms-doctor-couple-consult.png",
  },
  {
    title: "Continuity follows",
    eyebrow: "Long view",
    text: "The journey does not end after one visit.",
    detail: "MMS is designed around long-term preventive planning, not isolated treatment selection.",
    image: "/mms-diagnostics-screening.png",
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Our approach"
        title="A thoughtful journey. Designed around you."
        lead="MMS helps you move from uncertainty to discovery, assessment, doctor review, personalised planning and continuity."
        image="/ling-mms-guide.png"
        imageAlt="Ling, the MMS virtual health spokesperson, introducing the MMS health journey."
        primaryLabel="Begin your journey"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="72% center"
        spokespersonName="Ling"
        spokespersonMessage="I’ll guide you through each step—discover, measure, understand, optimise and monitor—while your doctor remains responsible for clinical decisions."
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">The MMS method</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              The order matters.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              A premium health journey should not ask patients to choose treatments first.
              It should help them understand, assess, review, personalise and continue.
            </p>
          </div>
          <ImagePanel priority src="/mms-service-collage.webp" alt="The connected MMS care journey across discovery, diagnostics, physician review and continuity." className="min-h-[420px] rounded-[1.6rem] shadow-premium" objectPosition="50% center" />
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-5 text-gold-light">Journey sequence</p>
          <h2 className="max-w-4xl text-balance font-serif text-4xl leading-tight md:text-6xl">
            Discover, measure, understand, optimise, monitor.
          </h2>
          <div className="mt-12">
            <JourneyLine dark steps={journey} />
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker mb-4 text-deep-green">Who does what</p>
              <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
                The right role at the right moment.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-warm-gray">
              Hover each image to see how the role supports the patient journey.
            </p>
          </div>
          <RevealCardGrid items={roles} />
        </div>
      </section>

      <SplitStory
        eyebrow="Patient psychology"
        title="Good care helps patients feel held, not hurried."
        lead="The visual experience should reflect the actual care promise: calm guidance, thoughtful sequencing, professional judgement and continuity."
        image="/mms-doctor-couple-consult.png"
        imageAlt="Doctor and patient discussing the care journey."
        dark
        reverse
      />

      <CareTeamStrip
        image="/mms-concierge-lounge.png"
        eyebrow="Guided journey"
        title="The patient should never feel abandoned between steps."
        text="A Health Relationship Manager keeps the experience understandable while doctors remain responsible for medical recommendations."
        points={["Listen", "Coordinate", "Follow up"]}
      />

      <FinalInvitation />
    </main>
  );
}
