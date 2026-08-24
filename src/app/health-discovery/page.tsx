import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { LingPanel } from "@/components/LingPanel";
import { PageHero } from "@/components/PageHero";

const signals = ["Sleep", "Energy", "Metabolic health", "Stress", "Recovery", "Healthy ageing"];

export default function HealthDiscoveryPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <PageHero eyebrow="Health Discovery" title="A calmer place to begin." lead="Start with what you want to understand. Build the picture before choosing the pathway." primaryHref="/ling" primaryLabel="Begin with Ling" />

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div className="relative min-h-[680px] overflow-hidden rounded-[48%_52%_46%_54%/43%_44%_56%_57%]"><Image src="/mms-health-screening-hero.png" alt="MMS health discovery" fill className="object-cover" sizes="(min-width:1024px) 55vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#15383a]/42 to-transparent"/></div>
          <div className="lg:pl-8"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Start with the whole picture</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Before choosing a treatment, understand what deserves attention.</h2><p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">Discovery helps organise your priorities, available health information and the questions worth taking into a professional conversation.</p><div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#cdb9a6] pt-5 text-[10px] font-semibold uppercase tracking-[.14em] text-terracotta">{signals.map(signal=><span key={signal}>{signal}</span>)}</div></div>
        </div>
      </section>

      <section className="bg-[#eadccc] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl"><div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">What discovery gives you</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Clarity before commitment.</h2></div><p className="max-w-xl text-lg leading-8 text-warm-gray lg:justify-self-end">It is orientation, not diagnosis: a better starting point for deciding what to explore next.</p></div><div className="mt-16 grid gap-0 border-y border-[#c7b29e] md:grid-cols-3">{[["01","Priorities","What matters to you now"],["02","Baseline","What the current picture looks like"],["03","Next conversation","What deserves professional review"]].map(([number,title,text])=><div key={number} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0 md:[&+&]:border-l md:[&+&]:border-[#c7b29e]"><span className="text-[9px] font-bold tracking-[.18em] text-terracotta">{number}</span><h3 className="mt-4 font-serif text-3xl text-navy">{title}</h3><p className="mt-3 text-sm leading-7 text-warm-gray">{text}</p></div>)}</div></div>
      </section>

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.68fr_1.32fr] lg:items-start">
          <div className="lg:sticky lg:top-28"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Ask first</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Explore without committing.</h2><p className="mt-7 max-w-md text-lg leading-8 text-warm-gray">Ling can help organise general questions before you decide whether you need screening, a programme or a conversation with the team.</p><div className="mt-8"><CTAButton href="/register">Create secure account</CTAButton></div></div>
          <div className="border-y border-[#cdb9a6] py-4"><LingPanel /></div>
        </div>
      </section>

      <section className="bg-[#15383a] px-5 py-24 text-ivory md:px-8 md:py-32"><div className="mx-auto max-w-5xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e4ba93]">Discovery before direction</p><h2 className="mx-auto mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">Understand first.<br/><span className="text-[#e9c6a5]">Personalise later.</span></h2></div></section>
    </main>
  );
}
