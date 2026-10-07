import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Health Dashboard",
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

      <section className="relative overflow-hidden bg-[#07151d] px-4 py-20 text-ivory md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(197,164,101,0.10),transparent_30%),radial-gradient(circle_at_20%_75%,rgba(92,129,120,0.10),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="editorial-kicker mb-5 text-gold-light">Connected categories</p>
          <h2 className="max-w-4xl text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
            See the bigger picture without losing the detail.
          </h2>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.20)] md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light/75">Illustrative trend view</p>
                  <h3 className="mt-2 font-serif text-3xl">Health over time</h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.52rem] uppercase tracking-[0.14em] text-ivory/45">
                  Longitudinal
                </span>
              </div>

              <div className="mt-7 rounded-[1.4rem] border border-white/8 bg-black/10 p-4">
                <svg viewBox="0 0 720 320" className="h-auto w-full" role="img" aria-label="Illustrative longitudinal health trend chart">
                  <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
                    <path d="M40 50H690M40 115H690M40 180H690M40 245H690" />
                    <path d="M40 50V265M190 50V265M340 50V265M490 50V265M640 50V265" />
                  </g>
                  <path d="M45 218 C120 205 150 188 205 176 S305 148 350 158 S455 118 505 126 S610 96 682 104" fill="none" stroke="#d6b36d" strokeWidth="4" strokeLinecap="round" />
                  <path d="M45 238 C115 230 162 212 210 216 S310 202 355 198 S450 180 510 185 S615 172 682 162" fill="none" stroke="#8fb3a4" strokeWidth="3" strokeLinecap="round" />
                  {[45,205,350,505,682].map((x, index) => <circle key={x} cx={x} cy={[218,176,158,126,104][index]} r="5" fill="#d6b36d" />)}
                </svg>
              </div>

              <div className="mt-5 flex flex-wrap gap-5 text-xs text-ivory/55">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d6b36d]" />Primary trend</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#8fb3a4]" />Context trend</span>
                <span className="text-ivory/35">Illustrative only — not a diagnostic display</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {categories.slice(0, 4).map(([title, text], index) => (
                <article key={title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-gold/25">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-serif text-2xl text-gold-light">{title}</h3>
                    <span className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-ivory/32">0{index + 1}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ivory/58">{text}</p>
                  <div className="mt-4 flex items-end gap-1.5">
                    {[30, 42, 36, 56, 64, 58, 74, 82].map((height, i) => (
                      <span key={i} className="w-full rounded-t bg-gold/25" style={{ height: `${height / 3}px` }} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {categories.slice(4).map(([title, text], index) => (
              <article key={title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl text-gold-light">{title}</h3>
                  <span className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-ivory/32">0{index + 5}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ivory/58">{text}</p>
              </article>
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
