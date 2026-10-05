import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Health Dashboard | My Medical Sanctuary",
  description:
    "See how MMS organises baselines, trends, health categories and follow-up into a clearer longitudinal health view.",
};

const categories = [
  ["Heart health", "Blood pressure, lipid-related measures and cardiovascular context."],
  ["Metabolic health", "Glucose-related patterns, liver health and metabolic risk context."],
  ["Body composition", "Muscle, fat distribution, visceral fat and related measurements."],
  ["Hormonal health", "Clinically relevant hormonal information interpreted in context."],
  ["Inflammation", "Selected inflammatory and immune-related markers where appropriate."],
  ["Cognitive health", "Relevant wellbeing, sleep, focus and cognitive-health context."],
];

export default function HealthDashboardPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Your health dashboard"
        title="From scattered results to a clearer health story."
        lead="Health information is often spread across blood reports, scans, consultations and different providers. MMS is designed to organise relevant information so that meaningful change can be understood over time."
        image="/mms-health-trends.webp"
        imageAlt="MMS longitudinal health trends and monitoring dashboard."
        primaryLabel="Start health discovery"
        primaryHref="/health-discovery"
        secondaryLabel="Meet Ling"
        secondaryHref="/ling"
        imagePosition="50% center"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="editorial-kicker mb-5 text-deep-green">Longitudinal health</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              One result is a snapshot. Trends can add context.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              A dashboard is useful when it helps organise the health information that matters: what your baseline looked like, what changed, how quickly it changed and what deserves professional review.
            </p>
            <p className="mt-4 text-sm leading-7 text-warm-gray/80">
              It is not a diagnostic engine. Clinical meaning still belongs with qualified medical professionals.
            </p>
          </div>
          <ImagePanel
            src="/mms-health-trends.webp"
            alt="Illustrative MMS health trend visual."
            className="min-h-[430px] rounded-[1.8rem] shadow-premium"
            objectPosition="50% center"
          />
        </div>
      </section>

      <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="editorial-kicker mb-5 text-gold-light">Connected categories</p>
          <h2 className="max-w-4xl text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
            See the bigger picture without losing the detail.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(([title, text]) => (
              <div key={title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-6">
                <h3 className="font-serif text-2xl text-gold-light">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ivory/58">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee5] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-5 text-deep-green">How it helps</p>
          <h2 className="max-w-4xl text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            A clearer record can support better conversations.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              ["Baseline", "Know where you started before deciding what changed."],
              ["Trend", "Compare repeated measurements rather than reacting to one isolated value."],
              ["Review", "Bring meaningful changes into a doctor-led conversation."],
              ["Follow-up", "Track agreed next steps and reassess when appropriate."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[1.6rem] border border-gold/20 bg-white/70 p-7">
                <h3 className="font-serif text-3xl text-navy">{title}</h3>
                <p className="mt-4 leading-7 text-warm-gray">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs leading-6 text-warm-gray/70">
            Dashboard visuals shown on this website are illustrative. Available data, integrations and monitoring views depend on the MMS service and clinical context.
          </p>
        </div>
      </section>

      <FinalInvitation title="Build a health story that becomes more useful over time." />
    </main>
  );
}
