import { LingPanel } from "@/components/LingPanel";
import { Section } from "@/components/Section";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { lingBoundaries } from "@/data/platformModules";
import { lingDisclaimer } from "@/lib/content";

export default function LingPage() {
  return (
    <main>
      <section className="bg-stone-950 px-4 pb-20 pt-36 text-white md:pt-44">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Ling</p>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
            Your AI Health Education Companion.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.72]">
            Ling helps people learn, orient themselves, and prepare for doctor-led care.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Start Here"
        title="Ling should educate, guide, and clarify."
        lead={lingDisclaimer}
      >
        <LingPanel />
      </Section>

      <Section
        eyebrow="Boundaries"
        title="Ling is useful because the boundaries are clear."
        lead="The first production version should help people orient themselves before professional review."
        className="bg-warm-white"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {lingBoundaries.map((item) => (
            <article key={item} className="rounded-lg border border-stone-200 bg-white p-6">
              <p className="leading-7 text-warm-gray">{item}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <DisclaimerBox title="Future AI integration">
            <p>
              A future AI-powered Ling should remain educational, avoid sensitive data collection
              on the public site and hand off to MMS doctors or HRM coordination for personalised
              medical questions.
            </p>
          </DisclaimerBox>
        </div>
      </Section>
    </main>
  );
}
