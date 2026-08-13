import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CapabilityStatus } from "@/components/CapabilityStatus";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "MMS Insights",
  description: "Human-reviewed preventive health, longevity, medicine-market and regional-care intelligence from My Medical Sanctuary.",
};

const desks = [
  ["Preventive Health", "Screening signals, risk factors and practical questions for your next review.", "01"],
  ["Longevity Science", "New research translated into what is known, uncertain and worth discussing.", "02"],
  ["Medicine Markets", "How access, registration and costs differ between healthcare markets.", "03"],
  ["Regional Care", "Provider capability and care-pathway developments across Malaysia and Thailand.", "04"],
];

export default function InsightsPage() {
  return <main>
    <PageHero eyebrow="MMS Insights" title="Medical intelligence, made understandable." lead="Useful signals, clear sources and human review—without the noise." primaryHref="/ling" primaryLabel="Ask Ling" />
    <Section eyebrow="Featured intelligence" title="What MMS is watching now." lead="A preview of the future intelligence desk. Published reports will carry sources, evidence strength and review status.">
      <div className="grid overflow-hidden rounded-3xl border border-gold-light/35 bg-white shadow-soft lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-[340px]">
          <Image src="/mms-medicine-intelligence.webp" alt="Medicine access intelligence workspace" fill className="object-cover" sizes="(min-width: 1024px) 52vw, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 rounded-full bg-ivory/95 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-navy">Market intelligence</p>
        </div>
        <div className="flex flex-col justify-center p-7 md:p-10">
          <CapabilityStatus status="development" />
          <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-gold">Featured briefing</p>
          <h2 className="mt-3 font-serif text-3xl text-navy md:text-4xl">Why the same medicine may cost differently across borders.</h2>
          <p className="mt-4 leading-7 text-warm-gray">A clear look at product matching, registration, supply, currency and licensed dispensing—before any patient decision.</p>
          <Link href="/medicine-intelligence" className="mt-7 font-semibold text-deep-green">Explore the comparison model →</Link>
        </div>
      </div>
    </Section>
    <Section eyebrow="Intelligence desks" title="Four lenses. One clear view." className="bg-warm-white">
      <div className="grid gap-4 md:grid-cols-2">
        {desks.map(([title, text, number]) => <article key={title} className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft">
          <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">Desk {number}</p><h2 className="mt-2 font-serif text-2xl text-navy">{title}</h2></div><span className="text-3xl text-deep-green/30">↗</span></div>
          <p className="mt-4 max-w-xl leading-7 text-warm-gray">{text}</p>
        </article>)}
      </div>
      <div className="mt-8 grid gap-3 rounded-2xl bg-deep-green p-6 text-ivory sm:grid-cols-4">
        {["Original source", "Evidence strength", "Ling summary", "Human clearance"].map((item, i) => <div key={item} className="border-ivory/15 sm:border-l sm:pl-5 first:border-0 first:pl-0"><span className="text-xs text-gold-light">0{i + 1}</span><p className="mt-1 font-serif text-lg">{item}</p></div>)}
      </div>
    </Section>
  </main>;
}
