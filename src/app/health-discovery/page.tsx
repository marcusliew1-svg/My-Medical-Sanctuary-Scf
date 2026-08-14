import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { LingPanel } from "@/components/LingPanel";
import { PageHero } from "@/components/PageHero";

const outcomes = [
  ["01", "What matters now", "Clarify the questions, priorities and concerns worth exploring first."],
  ["02", "Your baseline", "Bring available history, screening and lifestyle context into one view."],
  ["03", "The next conversation", "Prepare relevant possibilities for care-team and doctor review."],
];

const signals = ["Sleep", "Energy", "Metabolic health", "Stress", "Recovery", "Healthy ageing"];

export default function HealthDiscoveryPage() {
  return (
    <main>
      <PageHero eyebrow="Health Discovery" title="A calmer place to begin." lead="Start with what you want to understand. Ling helps organise the rest." primaryHref="/register" primaryLabel="Begin with Ling" />

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-premium lg:grid-cols-[1.02fr_.98fr]">
            <div className="relative min-h-[430px]">
              <Image src="/mms-health-screening-hero.png" alt="MMS health discovery and preventive screening" fill className="object-cover" sizes="(min-width:1024px) 51vw,100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                {signals.map(signal => <span key={signal} className="rounded-full border border-white/30 bg-black/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur">{signal}</span>)}
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Discovery before direction</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-navy md:text-5xl">See the whole picture before choosing a pathway.</h2>
              <p className="mt-5 text-lg leading-8 text-warm-gray">Health Discovery is orientation, not diagnosis. It helps MMS and your doctor understand what deserves attention first.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-ivory p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-gold">Start</p><p className="mt-2 font-serif text-xl text-navy">Your priorities</p></div>
                <div className="rounded-2xl bg-ivory p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-gold">Build</p><p className="mt-2 font-serif text-xl text-navy">Your baseline</p></div>
                <div className="rounded-2xl bg-ivory p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-gold">Move</p><p className="mt-2 font-serif text-xl text-navy">Your next step</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-gold">What you receive</p>
            <h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Clarity before commitment.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {outcomes.map(([number, title, text]) => (
              <article key={title} className="group rounded-[1.5rem] bg-white p-6 shadow-soft transition hover:-translate-y-1">
                <div className="flex items-center justify-between"><span className="font-serif text-4xl text-deep-green/18">{number}</span><span className="size-3 rounded-full bg-sage" /></div>
                <h2 className="mt-4 font-serif text-3xl text-navy">{title}</h2>
                <p className="mt-3 leading-7 text-warm-gray">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-deep-green px-4 py-20 text-ivory">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Ask first</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Not ready to register? Talk to Ling.</h2>
            <p className="mt-4 text-lg leading-8 text-ivory/70">Explore general questions anonymously. Create a secure account only when you want continuity and coordination.</p>
            <div className="mt-7"><CTAButton href="/register">Create a secure account</CTAButton></div>
          </div>
          <div className="rounded-[2rem] bg-white p-4 text-charcoal shadow-premium md:p-6"><LingPanel /></div>
        </div>
      </section>
    </main>
  );
}
