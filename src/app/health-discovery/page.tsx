import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { LingPanel } from "@/components/LingPanel";
import { PageHero } from "@/components/PageHero";

const signals = ["Sleep", "Energy", "Metabolic", "Stress", "Recovery", "Healthy ageing"];

export default function HealthDiscoveryPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <PageHero eyebrow="Health Discovery" title="A calmer place to begin." lead="Start with what you want to understand. Build the picture before choosing the pathway." primaryHref="/ling" primaryLabel="Begin with Ling" />

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <div className="relative min-h-[620px] overflow-hidden rounded-[2.5rem] shadow-[0_35px_100px_rgba(42,44,42,.14)]">
            <Image src="/mms-health-screening-hero.png" alt="MMS health discovery" fill className="object-cover" sizes="(min-width:1024px) 58vw,100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/92 via-transparent to-transparent" />
            <div className="absolute inset-x-7 bottom-7"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Start with the whole picture</p><div className="mt-4 flex flex-wrap gap-2">{signals.map(signal=><span key={signal} className="rounded-full border border-white/15 bg-[#102f36]/68 px-4 py-2 text-xs font-semibold text-ivory backdrop-blur-xl">{signal}</span>)}</div></div>
          </div>
          <div className="grid gap-4">
            {[["01","Priorities"],["02","Baseline"],["03","Next conversation"]].map(([number,title],index)=><div key={number} className={`relative overflow-hidden rounded-[2rem] p-7 ${index===1?"bg-[#e4c09a] text-navy":"bg-[#173d43] text-ivory"}`}><span className={`text-[9px] font-bold ${index===1?"text-[#7d4f33]":"text-[#dfb78f]"}`}>{number}</span><h2 className="mt-12 font-serif text-4xl">{title}</h2><div className={`absolute -right-14 -top-14 size-44 rounded-full border ${index===1?"border-navy/10":"border-white/10"}`} /></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#eee4d7] px-4 py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.58fr_1.42fr] lg:items-start">
          <div className="lg:sticky lg:top-28"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Ask first</p><h2 className="mt-4 font-serif text-5xl leading-tight text-navy md:text-6xl">Explore without committing.</h2><p className="mt-5 max-w-md text-base leading-8 text-warm-gray">Ling can help organise general questions. Create a secure account only when you want continuity.</p><div className="mt-8"><CTAButton href="/register">Create secure account</CTAButton></div></div>
          <div className="rounded-[2.5rem] border border-[#d5c2b0] bg-white p-2 shadow-[0_30px_90px_rgba(40,44,42,.11)]"><LingPanel /></div>
        </div>
      </section>

      <section className="bg-[#102f36] px-4 py-24 text-ivory md:py-28"><div className="mx-auto max-w-7xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">Discovery before direction</p><h2 className="mx-auto mt-5 max-w-5xl font-serif text-5xl leading-[1.02] md:text-7xl">Clarity before commitment.</h2></div></section>
    </main>
  );
}
