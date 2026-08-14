import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Hero } from "@/components/Hero";
import { EcosystemVisual } from "@/components/EcosystemVisual";
import { ServiceExplorer } from "@/components/ServiceExplorer";

export const metadata: Metadata = {
  title: "About MMS",
  description: "See how My Medical Sanctuary connects preventive care, Ling, coordination and future science.",
};

const pillars = [
  ["Prevent", "Understand earlier"],
  ["Personalise", "Shape care around the person"],
  ["Coordinate", "Reduce fragmentation"],
  ["Continue", "Keep the relationship moving"],
];

export default function AboutMMSPage() {
  return (
    <main>
      <Hero eyebrow="About MMS" title="Health should feel connected." subtitle="One relationship across discovery, coordination, doctor-led decisions and long-term continuity." image="/mms-about-hero.webp" />

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-premium lg:grid-cols-[1.08fr_.92fr]">
            <div className="relative min-h-[500px]"><Image src="/mms-service-collage.webp" alt="MMS preventive healthcare and longevity experience" fill className="object-cover" sizes="(min-width:1024px) 54vw,100vw" /><div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">The shift</p><h2 className="mt-2 max-w-2xl font-serif text-4xl leading-tight text-white md:text-5xl">From one-off purchases to one continuous health relationship.</h2></div></div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Why MMS exists</p>
              <p className="mt-4 text-lg leading-8 text-warm-gray">Most people encounter healthcare as separate appointments, separate providers and separate decisions. MMS is designed to connect the journey.</p>
              <div className="mt-8 grid grid-cols-2 gap-3">{pillars.map(([title,text],index)=><div key={title} className="rounded-2xl bg-ivory p-4"><span className="text-xs font-bold text-gold">0{index+1}</span><p className="mt-2 font-serif text-2xl text-navy">{title}</p><p className="mt-1 text-sm text-warm-gray">{text}</p></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">What MMS can coordinate</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Different needs. One organised pathway.</h2></div><ServiceExplorer /></div></section>

      <section className="bg-deep-green px-4 py-20 text-ivory">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">The operating model</p><h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Intelligence where useful. Human authority where it matters.</h2><p className="mt-4 text-lg leading-8 text-ivory/70">Ling helps organise information and continuity. MMS coordinates. Qualified doctors remain responsible for medical decisions.</p></div><div className="rounded-[2rem] bg-white p-4 text-charcoal shadow-premium md:p-6"><EcosystemVisual /></div></div>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-3">
            <Link href="/medicine-intelligence" className="group overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition hover:-translate-y-1"><div className="relative h-56"><Image src="/mms-medicine-intelligence.webp" alt="Medicine intelligence" fill className="object-cover" /></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">Intelligence</p><h3 className="mt-2 font-serif text-3xl text-navy">Medicine intelligence.</h3><p className="mt-2 text-sm leading-6 text-warm-gray">More visibility around medicine access and pricing.</p></div></Link>
            <Link href="/scf-lab-roadmap" className="group overflow-hidden rounded-[1.75rem] bg-deep-green text-ivory shadow-soft transition hover:-translate-y-1"><div className="relative h-56 bg-[#082f29]"><Image src="/scf-logo-new.png" alt="SCF" fill className="object-contain p-12" /></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-light">Future science</p><h3 className="mt-2 font-serif text-3xl">SCF capability.</h3><p className="mt-2 text-sm leading-6 text-ivory/70">A future pathway toward deeper science and clinical capability.</p></div></Link>
            <Link href="/medical-tourism" className="group overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition hover:-translate-y-1"><div className="relative h-56"><Image src="/mms-membership-journey.webp" alt="Malaysia and Thailand care journey" fill className="object-cover" /></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">Regional care</p><h3 className="mt-2 font-serif text-3xl text-navy">Malaysia ↔ Thailand.</h3><p className="mt-2 text-sm leading-6 text-warm-gray">Cross-border coordination without losing continuity.</p></div></Link>
          </div>
          <div className="mt-10"><DisclaimerBox title="Clinical and lab roadmap"><p>MMS aims to develop deeper clinical and lab capability in 2027, subject to regulatory, licensing, funding, technical and professional requirements.</p></DisclaimerBox></div>
        </div>
      </section>
    </main>
  );
}
