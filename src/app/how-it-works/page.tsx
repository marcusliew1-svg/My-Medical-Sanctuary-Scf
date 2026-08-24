import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { EcosystemVisual } from "@/components/EcosystemVisual";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how MMS connects discovery, Ling, coordination and doctor-led care.",
};

const moments = [
  ["01", "Discover", "Goals + health picture"],
  ["02", "Organise", "Ling prepares context"],
  ["03", "Review", "MMS connects the pathway"],
  ["04", "Decide", "Doctor-led suitability"],
  ["05", "Continue", "Ongoing coordination"],
];

export default function HowItWorksPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <Hero eyebrow="How MMS Works" title="One journey. Fewer disconnected decisions." subtitle="Ling organises. MMS coordinates. Doctors decide." image="/mms-membership-journey.webp" primaryLabel="Start with Ling" primaryHref="/ling" secondaryLabel="Explore memberships" secondaryHref="/memberships" />

      <section className="bg-[#f7f1e8] px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-stretch">
          <div className="relative min-h-[600px] overflow-hidden rounded-[2.5rem] shadow-[0_35px_100px_rgba(42,45,43,.15)]">
            <Image src="/ling-mms-guide.png" alt="Ling supporting the MMS journey" fill className="object-cover object-[50%_18%]" sizes="(min-width:1024px) 55vw,100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/92 via-transparent to-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Technology with boundaries</p><h2 className="mt-3 max-w-2xl font-serif text-4xl md:text-5xl">Make the journey simpler.<br/>Keep the judgement human.</h2></div>
          </div>
          <div className="grid gap-4">
            {["Ask","Organise","Coordinate"].map((item,index)=><div key={item} className={`relative overflow-hidden rounded-[2rem] p-7 ${index===1?"bg-[#e4c09b] text-navy":"bg-[#173d43] text-ivory"}`}><span className={`text-[9px] font-bold ${index===1?"text-[#7d4f33]":"text-[#dfb78f]"}`}>0{index+1}</span><h3 className="mt-8 font-serif text-4xl">{item}</h3><div className={`absolute -right-12 -top-12 size-40 rounded-full border ${index===1?"border-navy/10":"border-white/10"}`} /></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#102f36] px-4 py-24 text-ivory md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">The journey</p><h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Five moments.<br/><span className="text-[#e5c19f]">One connected story.</span></h2></div><p className="max-w-lg text-base leading-8 text-ivory/58 lg:justify-self-end">Each stage has a clear role so you know who is organising, reviewing and deciding.</p></div>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-5">
            {moments.map(([number,title,text],index)=><article key={number} className={`relative min-h-[330px] p-6 ${index===3?"bg-[#e4c09b] text-navy":"bg-[#102f36]"}`}><span className={`text-[10px] font-bold ${index===3?"text-[#7d4f33]":"text-[#dfb78f]"}`}>{number}</span><div className={`mt-24 h-px w-12 ${index===3?"bg-navy/25":"bg-[#dfb78f]/35"}`} /><h3 className="mt-7 font-serif text-3xl">{title}</h3><p className={`mt-3 text-xs leading-6 ${index===3?"text-navy/60":"text-ivory/52"}`}>{text}</p>{index<4?<span className={`absolute -right-3 top-1/2 z-10 hidden size-6 place-items-center rounded-full md:grid ${index===3?"bg-navy text-ivory":"bg-[#e4c09b] text-navy"}`}>→</span>:null}</article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#efe4d7] px-4 py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.68fr_1.32fr] lg:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Who does what?</p><h2 className="mt-4 font-serif text-5xl leading-tight text-navy md:text-6xl">Clear roles build trust.</h2><p className="mt-5 max-w-lg text-base leading-8 text-warm-gray">You should always know who is guiding, coordinating and making the medical decision.</p><Link href="/about-mms" className="mt-7 inline-flex text-xs font-bold uppercase tracking-[.16em] text-deep-green">See the MMS model →</Link></div>
          <div className="rounded-[2.4rem] border border-[#d2bdab] bg-white p-4 shadow-[0_28px_80px_rgba(42,45,43,.1)] md:p-6"><EcosystemVisual /></div>
        </div>
      </section>
    </main>
  );
}
