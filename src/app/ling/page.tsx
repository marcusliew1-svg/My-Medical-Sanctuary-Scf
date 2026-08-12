import { LingPanel } from "@/components/LingPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { lingBoundaries } from "@/data/platformModules";
import { lingDisclaimer } from "@/lib/content";

export default function LingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Ling"
        title="Your AI Health Education Companion."
        lead="Ling helps people learn, orient themselves, and prepare for doctor-led care."
        primaryHref="/contact"
        primaryLabel="Start Discovery"
      />

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
