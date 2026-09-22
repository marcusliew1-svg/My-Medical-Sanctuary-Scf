import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel, JourneyLine, SplitStory } from "@/components/Editorial";
import { CareTeamStrip, RevealCardGrid } from "@/components/ExperienceCards";
import { ScreeningEvidence } from "@/components/ScreeningEvidence";

export const metadata: Metadata = {
  title: "Health Screening | My Medical Sanctuary",
  description:
    "Comprehensive health screening in Malaysia to understand your baseline, detect risks earlier and support doctor-led planning.",
};

const pathway = [
  { title: "Discover", text: "Clarify your goals, history and what you want to understand." },
  { title: "Measure", text: "Complete selected screening and diagnostics appropriate to your context." },
  { title: "Understand", text: "Review findings with a doctor, not just a generic report." },
  { title: "Optimise", text: "Translate findings into priorities and practical next steps." },
  { title: "Monitor", text: "Follow what changes over time and decide whether ongoing membership is useful." },
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
      <EditorialHero
        eyebrow="Health Screening"
        title="Your health journey starts with understanding."
        lead="A personalised screening helps identify current health status, detect potential risks earlier and provide a doctor-led foundation for your wellness plan."
        image="/ling-knowledge.png"
        imageAlt="Ling, the MMS virtual health spokesperson, guiding a preventive screening journey."
        primaryLabel="Book health screening"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="70% center"
        spokespersonName="Ling"
        spokespersonMessage="I can help you understand what screening is for, what questions to prepare and when your results need doctor review."
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Why it matters</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Understand before problems become more serious.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              Screening is not about selling treatment. It builds a baseline, gives context and helps you
              make better decisions with a doctor.
            </p>
          </div>
          <ImagePanel
            src="/mms-service-collage.webp"
            alt="The MMS screening journey across diagnostics, doctor review and follow-up."
            className="min-h-[420px] rounded-[1.75rem] shadow-premium"
            objectPosition="50% center"
          />
        </div>
      </section>

      <ScreeningEvidence />

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
              Each area supports a different part of the screening conversation and remains subject to individual suitability.
            </p>
          </div>
          <RevealCardGrid items={includes} />
        </div>
      </section>

      <SplitStory
        eyebrow="Doctor-led next step"
        title="Membership comes after doctor review."
        lead="The screening result should guide the next step. It should not pressure patients into programmes before the findings are understood."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor discussing screening next steps."
        reverse
      >
        <JourneyLine compact steps={pathway} />
      </SplitStory>

      <CareTeamStrip
        image="/mms-doctor-couple-consult.png"
        eyebrow="After screening"
        title="The value is not the test alone. It is the conversation after."
        text="MMS turns screening into doctor-led interpretation, prioritised next steps and a longer health plan."
        points={["Interpret", "Prioritise", "Plan"]}
      />

      <FinalInvitation
        title="Your future health starts with a clearer baseline."
        lead="Book a screening and begin with understanding, not pressure."
      />
    </main>
  );
}
