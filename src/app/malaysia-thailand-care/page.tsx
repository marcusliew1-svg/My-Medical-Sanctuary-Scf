import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

const steps = ["Understand the patient need", "Confirm consent and suitability", "Verify providers and availability", "Present scope and quotation", "Coordinate care and follow-up"];

export default function MalaysiaThailandCarePage() {
  return <main>
    <PageHero eyebrow="Malaysia–Thailand Care" title="One coordinated journey across two countries." lead="MMS helps patients move between assessment, suitable providers and follow-up with consent and human clinical oversight." primaryHref="/register" primaryLabel="Discuss with Ling" />
    <Section eyebrow="The care corridor" title="Connected, not fragmented." lead="The exact pathway depends on the patient, provider availability and licensed professional review.">
      <div className="grid gap-4 md:grid-cols-5">{steps.map((step, index) => <article key={step} className="rounded-2xl border border-gold-light/40 bg-white p-5 shadow-soft"><p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">0{index + 1}</p><h2 className="mt-3 font-serif text-xl text-navy">{step}</h2></article>)}</div>
    </Section>
    <Section eyebrow="Patient control" title="Information moves only with consent." className="bg-warm-white">
      <DisclaimerBox title="Clinical and operational boundary"><p>Ling may organise possible pathways internally. Provider suitability, treatment decisions and recommendations require qualified human review. Availability, travel and record transfer must be confirmed for each patient.</p></DisclaimerBox>
      <div className="mt-8"><CTAButton href="/register">Start a secure discussion</CTAButton></div>
    </Section>
  </main>;
}
