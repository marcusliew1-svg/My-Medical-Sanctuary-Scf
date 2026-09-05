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
import { CareTeamStrip } from "@/components/ExperienceCards";

export const metadata: Metadata = {
  title: "Health Screening | My Medical Sanctuary",
  description:
    "Comprehensive health screening in Malaysia to understand your baseline, detect risks earlier and support doctor-led planning.",
};

const pathway = [
  { title: "Book", text: "Choose a suitable screening conversation and appointment window." },
  { title: "Assess", text: "Complete selected checks that may fit your context." },
  { title: "Review", text: "Discuss results with a doctor, not a generic report." },
  { title: "Plan", text: "Translate findings into priorities and next steps." },
  { title: "Continue", text: "Consider membership only after doctor review." },
];

const includes = [
  {
    title: "Blood investigations",
    eyebrow: "Baseline",
    text: "Markers that help frame the health conversation.",
    detail: "Panels are selected and interpreted in context; results should be reviewed with qualified professionals.",
    image: "/mms-diagnostics-screening.png",
  },
  {
    title: "ECG & ultrasound",
    eyebrow: "Imaging",
    text: "Selected checks may help identify areas for follow-up.",
    detail: "Screening components may evolve and should be confirmed during booking and doctor review.",
    image: "/mms-doctor-results-review.png",
  },
  {
    title: "Body composition",
    eyebrow: "Metabolic picture",
    text: "A more useful view than weight alone.",
    detail: "Body composition can support discussions around muscle, fat distribution, lifestyle and metabolic health.",
    image: "/mms-doctor-couple-consult.png",
  },
  {
    title: "Doctor consultation",
    eyebrow: "Review",
    text: "Results become meaningful through professional interpretation.",
    detail: "MMS keeps recommendations doctor-led and suitability-aware, not automated from a report.",
    image: "/mms-concierge-lounge.png",
  },
];

export default function HealthScreeningPage() {
  return (
    <main>
      <PublicHero
        eyebrow="Health Screening"
        title="Your health journey starts with understanding."
        brandLine="Baseline first. Recommendations later."
        lead="A personalised screening helps identify current health status, detect potential risks earlier and provide a doctor-led foundation for your wellness plan."
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor-led health screening consultation."
        primaryLabel="Book Health Screening"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="58% center"
      />

      <TrustBar
        items={[
          { title: "Early", text: "Understand risk before concerns become urgent." },
          { title: "Baseline", text: "Know where your health stands today." },
          { title: "Personal", text: "Findings make sense only in context." },
          { title: "Doctor-led", text: "Review comes before recommendations." },
          { title: "Actionable", text: "Translate findings into next steps." },
          { title: "Continuity", text: "Membership comes after review." },
        ]}
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
          <SectionHeading
            eyebrow="Why it matters"
            title="Understand before problems become more serious."
            lead="Screening is not about selling treatment. It builds a baseline, gives context and helps you make better decisions with a doctor."
          />
          <ImageFeature
            items={[
              {
                title: "Detect early",
                eyebrow: "Risk",
                text: "Identify potential health risks before symptoms develop.",
                detail: "Earlier detection can create time for monitoring, lifestyle change, referral or doctor-led planning.",
                image: "/mms-diagnostics-screening.png",
              },
              {
                title: "Build your baseline",
                eyebrow: "Clarity",
                text: "Know where your health stands today.",
                detail: "A baseline becomes more useful when repeated over time and interpreted alongside your goals and history.",
                image: "/mms-doctor-results-review.png",
              },
              {
                title: "Plan ahead",
                eyebrow: "Next step",
                text: "Make informed decisions with your doctor.",
                detail: "The screening discussion can prioritise what deserves follow-up, what can wait and what needs specialist review.",
                image: "/mms-doctor-couple-consult.png",
              },
              {
                title: "Continue wisely",
                eyebrow: "Journey",
                text: "Consider programmes only after review.",
                detail: "Membership or advanced care should follow suitability assessment, not replace it.",
                image: "/mms-concierge-lounge.png",
              },
            ]}
          />
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker mb-4 text-gold-light">May include</p>
              <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
                Screening should create clarity, not confusion.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ivory/66">
              Hover each area to understand how it supports the patient conversation.
            </p>
          </div>
          <ImageFeature items={includes} />
        </div>
      </section>

      <EditorialSplit
        eyebrow="Doctor-led next step"
        title="Membership comes after doctor review."
        lead="The screening result should guide the next step. It should not pressure patients into programmes before the findings are understood."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor discussing screening next steps."
        reverse
      >
        <JourneyStepRail steps={pathway} />
      </EditorialSplit>

      <CareTeamStrip
        image="/mms-doctor-couple-consult.png"
        eyebrow="After screening"
        title="The value is not the test alone. It is the conversation after."
        text="MMS turns screening into doctor-led interpretation, prioritised next steps and a longer health plan."
        points={["Interpret", "Prioritise", "Plan"]}
      />

      <CTASection
        title="Your future health starts with a clearer baseline."
        lead="Book a screening and begin with understanding, not pressure."
      />
    </main>
  );
}
