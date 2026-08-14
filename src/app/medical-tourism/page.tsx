import type { Metadata } from "next";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Malaysia–Thailand Care Travel", description: "A coordinated medical tourism and preventive-care journey across Malaysia and Thailand." };

const journey = [["01","Tell Ling","Goals, timing and preferred location"],["02","Human review","A qualified professional reviews the request"],["03","Match care","MMS coordinates the right setting and availability"],["04","Plan travel","Appointments, stay and local support"],["05","Stay connected","Records and follow-up continue after the trip"]];

export default function MedicalTourismPage() {
  return (
    <main>
      <PageHero eyebrow="Malaysia–Thailand Care" title="Cross-border care without losing continuity." lead="One coordinated journey from the first question to travel, treatment setting and follow-up." primaryHref="/ling" primaryLabel="Plan with Ling" />

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden rounded-[2rem] bg-deep-green text-ivory shadow-premium lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative min-h-[480px]"><Image src="/mms-membership-journey.webp" alt="Malaysia Thailand coordinated care journey" fill className="object-cover" sizes="(min-width:1024px) 58vw,100vw" /><div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">One corridor</p><h2 className="mt-2 max-w-2xl font-serif text-4xl leading-tight text-white md:text-5xl">Different cities. One patient story.</h2></div></div>
            <div className="flex flex-col justify-center p-8 md:p-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Why it matters</p><p className="mt-4 text-lg leading-8 text-ivory/72">Care travel becomes stressful when clinic selection, travel and follow-up sit in separate silos. MMS keeps them connected.</p><div className="mt-8 grid gap-3"><div className="rounded-2xl border border-white/12 bg-white/7 p-4"><span className="text-gold-light">Malaysia</span><p className="mt-1 font-serif text-2xl">Screening & continuity</p></div><div className="rounded-2xl border border-white/12 bg-white/7 p-4"><span className="text-gold-light">Thailand</span><p className="mt-1 font-serif text-2xl">Recovery & specialist access</p></div><div className="rounded-2xl border border-white/12 bg-white/7 p-4"><span className="text-gold-light">MMS</span><p className="mt-1 font-serif text-2xl">The bridge between both</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">How it moves</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Five steps. One coordinator.</h2></div><div className="grid overflow-hidden rounded-[2rem] border border-gold/30 bg-[#06382f] text-ivory shadow-premium lg:grid-cols-5">{journey.map(([number,title,text],index)=><article key={number} className="relative border-gold/25 p-6 lg:border-l first:border-l-0"><span className="font-serif text-4xl text-gold-light/50">{number}</span><h3 className="mt-3 font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-ivory/65">{text}</p>{index<4?<span className="absolute -right-3 top-1/2 z-10 hidden size-6 place-items-center rounded-full bg-gold text-navy lg:grid">→</span>:null}</article>)}</div></div></section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Two-country corridor</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Choose by need, not guesswork.</h2></div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="group overflow-hidden rounded-[2rem] bg-white shadow-soft"><div className="relative h-72"><Image src="/mms-health-screening-hero.png" alt="Malaysia preventive screening and continuity" fill className="object-cover transition duration-500 group-hover:scale-[1.03]"/></div><div className="p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">Malaysia</p><h3 className="mt-2 font-serif text-3xl text-navy">Screening & continuity.</h3><p className="mt-3 text-warm-gray">Preventive screening, doctor review, wellness planning and continued MMS coordination.</p></div></article>
            <article className="group overflow-hidden rounded-[2rem] bg-deep-green text-ivory shadow-soft"><div className="relative h-72"><Image src="/mms-about-hero.png" alt="Thailand recovery and specialist access" fill className="object-cover opacity-85 transition duration-500 group-hover:scale-[1.03]"/></div><div className="p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-light">Thailand</p><h3 className="mt-2 font-serif text-3xl">Recovery & specialist access.</h3><p className="mt-3 text-ivory/70">Suitable partner pathways, hospitality coordination and continued MMS follow-up.</p></div></article>
          </div>
          <div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/clinics">Explore clinic network</CTAButton><CTAButton href="/online-doctor" variant="outline">Speak to a doctor online</CTAButton></div>
        </div>
      </section>
    </main>
  );
}
