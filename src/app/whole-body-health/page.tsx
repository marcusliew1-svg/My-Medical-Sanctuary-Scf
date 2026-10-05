import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Whole-Body Health | My Medical Sanctuary",
  description:
    "Explore the MMS whole-body view across brain, heart, metabolic, hormonal, musculoskeletal, respiratory, digestive and immune health.",
};

const systems = [
  ["Brain & cognitive health", "Memory, focus, mood, sleep and neurological wellbeing can interact with wider metabolic and cardiovascular health."],
  ["Heart & cardiovascular health", "Blood pressure, lipid patterns, glucose regulation, exercise capacity and family history can all shape cardiovascular context."],
  ["Metabolic health", "Glucose regulation, insulin sensitivity, liver health, visceral fat and muscle are connected parts of metabolic health."],
  ["Hormonal health", "Thyroid and other hormonal changes can influence energy, body composition, sleep, mood and recovery."],
  ["Respiratory health", "Breathing, oxygenation, sleep quality and exercise tolerance can be relevant to overall health and recovery."],
  ["Musculoskeletal health", "Muscle, bone, joints, strength and mobility become increasingly important for healthspan with age."],
  ["Digestive health", "Nutrition, gastrointestinal symptoms and microbiome-related factors may interact with metabolism and wellbeing."],
  ["Immune & inflammatory health", "Inflammation and immune function need careful interpretation because many markers are non-specific on their own."],
];

export default function WholeBodyHealthPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Whole-body health"
        title="Your health is a system."
        lead="MMS looks at the bigger picture because the body does not operate in isolated departments. Useful preventive care connects the signals that matter and interprets them in context."
        image="/mms-diagnostics-screening.png"
        imageAlt="Whole-body preventive health assessment and diagnostic review."
        primaryLabel="Start health discovery"
        primaryHref="/health-discovery"
        secondaryLabel="How MMS works"
        secondaryHref="/how-it-works"
        imagePosition="50% center"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="editorial-kicker mb-5 text-deep-green">Connected systems</p>
          <h2 className="max-w-4xl text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            The value is in seeing relationships, not just isolated results.
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {systems.map(([title, text]) => (
              <div key={title} className="rounded-[1.5rem] border border-gold/20 bg-white/75 p-6 shadow-[0_18px_50px_rgba(11,26,46,0.05)]">
                <h3 className="font-serif text-3xl text-navy">{title}</h3>
                <p className="mt-4 leading-7 text-warm-gray">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <ImagePanel
            src="/mms-doctor-results-review.png"
            alt="Doctor reviewing connected health information with a patient."
            className="min-h-[470px] rounded-[1.8rem] border border-white/10 shadow-[0_42px_120px_rgba(0,0,0,0.28)]"
            objectPosition="50% center"
          />
          <div>
            <p className="editorial-kicker mb-5 text-gold-light">Clinical context</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
              Connection does not mean over-testing.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ivory/66">
              The whole-body view is a framework for understanding health, not a reason to order every available test. Appropriate assessment should still be guided by history, symptoms, risk profile and professional judgement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee5] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-5 text-deep-green">A practical example</p>
          <h2 className="max-w-4xl text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            One change can influence several systems at once.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Sleep", "Poor sleep can influence appetite, glucose regulation, blood pressure, mood and recovery."],
              ["Muscle", "Muscle supports mobility, glucose handling, metabolic health and resilience with age."],
              ["Metabolic health", "Metabolic changes can influence liver, cardiovascular and inflammatory risk over time."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[1.6rem] border border-gold/20 bg-white/70 p-7">
                <h3 className="font-serif text-3xl text-navy">{title}</h3>
                <p className="mt-4 leading-7 text-warm-gray">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalInvitation title="Start with the whole person, then decide what deserves attention." />
    </main>
  );
}
