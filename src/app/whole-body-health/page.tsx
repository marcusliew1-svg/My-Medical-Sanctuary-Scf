import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Whole-Body Health",
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

      <section className="relative overflow-hidden bg-ivory px-4 py-20 md:py-28">
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="editorial-kicker mb-5 text-deep-green">Connected systems</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              The value is in seeing relationships, not just isolated results.
            </h2>
          </div>

          <div className="relative mt-14 min-h-[760px] overflow-hidden rounded-[2.2rem] border border-gold/20 bg-[radial-gradient(circle_at_50%_50%,rgba(197,164,101,0.12),rgba(255,255,255,0.72)_34%,rgba(255,255,255,0.58)_68%)] p-5 shadow-[0_34px_100px_rgba(11,26,46,0.08)] md:p-8">
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-45" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" stroke="currentColor" className="text-gold/40" strokeWidth="1.1">
                <path d="M500 350 C390 280 300 220 180 150" />
                <path d="M500 350 C610 280 700 220 820 150" />
                <path d="M500 350 C350 350 260 350 135 350" />
                <path d="M500 350 C650 350 740 350 865 350" />
                <path d="M500 350 C390 430 300 505 180 570" />
                <path d="M500 350 C610 430 700 505 820 570" />
                <path d="M500 350 C500 250 500 180 500 90" />
                <path d="M500 350 C500 450 500 520 500 610" />
              </g>
            </svg>

            <div className="absolute left-1/2 top-1/2 z-20 grid h-52 w-52 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/35 bg-[#fbf8f1] text-center shadow-[0_28px_80px_rgba(11,26,46,0.10)]">
              <div className="px-6">
                <svg viewBox="0 0 48 48" className="mx-auto h-9 w-9 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="24" cy="24" r="7" />
                  <circle cx="24" cy="24" r="16" />
                  <path d="M24 8V3M24 45v-5M8 24H3M45 24h-5M12.7 12.7l-3.5-3.5M38.8 38.8l-3.5-3.5M35.3 12.7l3.5-3.5M9.2 38.8l3.5-3.5" />
                </svg>
                <p className="mt-3 font-serif text-3xl leading-tight text-navy">Whole-body context</p>
                <p className="mt-2 text-[0.52rem] font-semibold uppercase tracking-[0.17em] text-deep-green/55">Connected, not isolated</p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {systems.map(([title, text], index) => (
                <article
                  key={title}
                  className={`rounded-[1.4rem] border border-gold/18 bg-[#fffdf8]/94 p-4 shadow-[0_16px_48px_rgba(11,26,46,0.06)] backdrop-blur-sm md:p-5 ${index >= 4 ? "md:translate-y-[360px]" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/25 bg-[#f8f1e4] text-[0.56rem] font-semibold text-deep-green">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-lg leading-tight text-navy">{title}</h3>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-warm-gray">{text}</p>
                </article>
              ))}
            </div>
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
