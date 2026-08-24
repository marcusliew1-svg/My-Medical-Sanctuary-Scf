import type { Metadata } from "next";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Malaysia–Thailand Care Travel",
  description: "A coordinated care journey across Malaysia and Thailand.",
};

const journey = ["Tell us", "Review", "Match", "Plan", "Continue"];

export default function MedicalTourismPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <PageHero eyebrow="Malaysia–Thailand Care" title="Cross-border care without losing continuity." lead="Different places. One organised patient journey." primaryHref="/ling" primaryLabel="Plan with Ling" />

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          <article className="group relative min-h-[620px] overflow-hidden rounded-[2.5rem] shadow-[0_35px_100px_rgba(42,44,42,.14)]">
            <Image src="/mms-health-screening-hero.png" alt="Malaysia preventive care" fill className="object-cover transition duration-1000 group-hover:scale-[1.04]" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/92 via-transparent to-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Malaysia</p><h2 className="mt-3 font-serif text-5xl">Screen.<br/>Review.<br/>Continue.</h2></div>
          </article>
          <article className="group relative min-h-[620px] overflow-hidden rounded-[2.5rem] shadow-[0_35px_100px_rgba(42,44,42,.14)]">
            <Image src="/mms-about-hero.png" alt="Thailand coordinated care" fill className="object-cover transition duration-1000 group-hover:scale-[1.04]" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/92 via-transparent to-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Thailand</p><h2 className="mt-3 font-serif text-5xl">Recover.<br/>Access.<br/>Reconnect.</h2></div>
          </article>
        </div>
      </section>

      <section className="bg-[#102f36] px-4 py-24 text-ivory md:py-32">
        <div className="mx-auto max-w-7xl"><div className="mb-12"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">One coordinator</p><h2 className="mt-4 font-serif text-5xl md:text-6xl">Five simple moments.</h2></div><div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-5">{journey.map((step,index)=><div key={step} className={`relative min-h-[300px] p-6 ${index===2?"bg-[#e4c09a] text-navy":"bg-[#102f36]"}`}><span className={`text-[9px] font-bold ${index===2?"text-[#7c4f35]":"text-[#dfb78f]"}`}>0{index+1}</span><div className={`mt-20 h-px w-10 ${index===2?"bg-navy/20":"bg-[#dfb78f]/35"}`} /><h3 className="mt-7 font-serif text-3xl">{step}</h3>{index<4?<span className={`absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full md:grid ${index===2?"bg-navy text-white":"bg-[#e4c09a] text-navy"}`}>→</span>:null}</div>)}</div></div>
      </section>

      <section className="bg-[#eee4d7] px-4 py-24 md:py-28"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">The bridge</p><h2 className="mt-4 font-serif text-5xl leading-tight text-navy md:text-6xl">Travel changes.<br/>Continuity should not.</h2><div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/clinics">Our locations</CTAButton><CTAButton href="/online-doctor" variant="outline">Online doctor</CTAButton></div></div><div className="relative min-h-[500px] overflow-hidden rounded-[2.4rem]"><Image src="/mms-membership-journey.webp" alt="Coordinated Malaysia Thailand care" fill className="object-cover" sizes="(min-width:1024px) 60vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/86 via-transparent to-transparent"/><div className="absolute inset-x-7 bottom-7 rounded-[1.4rem] border border-white/12 bg-[#102f36]/72 p-5 text-ivory backdrop-blur-xl"><p className="font-serif text-3xl">Malaysia ↔ Thailand</p><p className="mt-2 text-sm text-ivory/55">Care navigation · preparation · follow-up</p></div></div></div></section>
    </main>
  );
}
