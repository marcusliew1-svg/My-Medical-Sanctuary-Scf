import { CTAButton } from "@/components/CTAButton";
import { LingPanel } from "@/components/LingPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

const outcomes = [
  ["Your priorities", "Clarify what you want to understand or improve."],
  ["Your baseline", "Organise available history, screening and lifestyle context."],
  ["Your next step", "Prepare suitable options for care-team and doctor review."],
];

export default function HealthDiscoveryPage() {
  return <main>
    <PageHero eyebrow="Health Discovery" title="A calmer place to begin." lead="Ling helps organise your priorities before MMS recommends a pathway." primaryHref="/register" primaryLabel="Begin with Ling" />
    <Section eyebrow="What you receive" title="Clarity before commitment." lead="Health Discovery is an orientation process—not a diagnosis or treatment plan.">
      <div className="grid gap-5 md:grid-cols-3">{outcomes.map(([title, text]) => <article key={title} className="rounded-2xl border border-gold-light/40 bg-white p-6 shadow-soft"><h2 className="font-serif text-2xl text-navy">{title}</h2><p className="mt-3 leading-7 text-warm-gray">{text}</p></article>)}</div>
    </Section>
    <Section eyebrow="Ask anonymously" title="Not ready to register? Talk to Ling first." className="bg-warm-white"><LingPanel /><div className="mt-8"><CTAButton href="/register">Create a secure account</CTAButton></div></Section>
  </main>;
}
