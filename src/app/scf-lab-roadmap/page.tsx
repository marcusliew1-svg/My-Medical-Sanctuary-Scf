import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { CapabilityStatus } from "@/components/CapabilityStatus";

export const metadata: Metadata = {
  title: "SCF Lab Roadmap",
  description: "Explore the staged SCF science and capability roadmap supporting future MMS clinical pathways.",
};

const scienceLayers = [
  { number: "01", label: "Screen", text: "Understand baseline signals before deeper intervention." },
  { number: "02", label: "Review", text: "Qualified professionals interpret suitability and context." },
  { number: "03", label: "Plan", text: "Build a governed, documented pathway around the patient." },
  { number: "04", label: "Advance", text: "Future science capability develops only when governance is ready." },
];

const roadmap = [
  ["Now", "Patient education + screening", "MMS coordinates discovery, records and doctor-led review."],
  ["Developing", "Clinical capability", "Protocols, professional oversight and stronger diagnostic pathways."],
  ["Roadmap", "Lab capability", "Deeper science infrastructure subject to licensing, funding and technical readiness."],
  ["Future", "ASEAN platform", "A repeatable science-and-care model designed for careful regional expansion."],
];

export default function SCFLabRoadmapPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-black px-4 pb-16 pt-28 text-ivory md:pt-36">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_35%,rgba(80,150,119,.23),transparent_30%),radial-gradient(circle_at_20%_76%,rgba(212,190,133,.14),transparent_32%)]" />
        <div className="mx-auto grid min-h-[620px] max-w-6xl items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <div className="relative h-24 w-48"><Image src="/scf-logo-new.png" alt="SCF" fill priority className="object-contain object-left" sizes="192px" /></div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[.22em] text-gold-light">Science · Care · Future capability</p>
            <h1 className="mt-4 text-balance font-serif text-5xl leading-[1.03] md:text-7xl">Building the science layer behind tomorrow’s care.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/70">SCF develops capability carefully. MMS turns that capability into a governed patient journey.</p>
            <div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/contact">Start Discovery</CTAButton><CTAButton href="/about-mms" variant="outline">See the MMS platform</CTAButton></div>
          </div>
          <div className="relative min-h-[520px]">
            <div className="absolute inset-4 rounded-full border border-gold/20" />
            <div className="absolute inset-16 rounded-full border border-emerald-300/15" />
            <div className="absolute inset-28 grid place-items-center rounded-full bg-[#083c34] shadow-[0_0_80px_rgba(41,120,92,.35)]"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">SCF</p><p className="mt-2 font-serif text-4xl">Science engine</p><p className="mt-2 text-sm text-ivory/60">inside the MMS ecosystem</p></div></div>
            {[["top-3 left-1/2 -translate-x-1/2","Screen"],["right-0 top-1/2 -translate-y-1/2","Govern"],["bottom-3 left-1/2 -translate-x-1/2","Develop"],["left-0 top-1/2 -translate-y-1/2","Scale"]].map(([position,label])=><div key={label} className={`absolute ${position} rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-md`}>{label}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20"><div className="mx-auto max-w-6xl">
        <div className="grid gap-5 md:grid-cols-4">{scienceLayers.map((item,index)=><article key={item.number} className={`rounded-[1.5rem] p-6 shadow-soft ${index===3 ? "bg-deep-green text-ivory" : "bg-white text-navy"}`}><span className={`text-xs font-bold ${index===3 ? "text-gold-light" : "text-gold"}`}>{item.number}</span><h2 className="mt-3 font-serif text-3xl">{item.label}</h2><p className={`mt-3 text-sm leading-6 ${index===3 ? "text-ivory/68" : "text-warm-gray"}`}>{item.text}</p></article>)}</div>
      </div></section>

      <section className="bg-warm-white px-4 py-20"><div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Capability roadmap</p><h2 className="mt-3 font-serif text-5xl leading-tight text-navy">Show what is real. Show what comes next.</h2><p className="mt-5 leading-7 text-warm-gray">SCF should feel ambitious without blurring the line between today’s capability and future development.</p><div className="mt-6"><CapabilityStatus status="development" /></div></div>
          <div className="relative pl-8 md:pl-12"><div className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-deep-green via-gold to-stone-300 md:left-5" />{roadmap.map(([status,title,text],index)=><article key={title} className="relative mb-5 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-soft"><span className="absolute -left-[2.05rem] top-7 grid size-8 place-items-center rounded-full bg-deep-green text-xs font-bold text-white md:-left-[3.2rem]">0{index+1}</span><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">{status}</p><h3 className="mt-2 font-serif text-2xl text-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-warm-gray">{text}</p></article>)}</div>
        </div>
      </div></section>

      <section className="bg-[#07372f] px-4 py-20 text-ivory"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">MMS × SCF</p><h2 className="mt-3 font-serif text-5xl leading-tight">Science becomes valuable when it improves the journey.</h2><p className="mt-5 max-w-xl leading-7 text-ivory/68">MMS owns the relationship, coordination and continuity. SCF develops deeper science and capability behind it.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/how-it-works" className="rounded-full bg-ivory px-5 py-3 text-sm font-semibold text-deep-green">See how MMS works</Link><Link href="/memberships" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-ivory">Explore memberships</Link></div></div><div className="grid grid-cols-2 gap-3">{[["MMS","Patient relationship"],["Ling","Intelligence layer"],["Doctors","Clinical authority"],["SCF","Science capability"]].map(([name,role])=><div key={name} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"><p className="font-serif text-3xl">{name}</p><p className="mt-2 text-sm text-ivory/60">{role}</p></div>)}</div></div></section>

      <section className="bg-ivory px-4 py-16"><div className="mx-auto max-w-5xl"><DisclaimerBox title="Clinical and lab roadmap"><p>SCF and MMS aim to develop deeper clinical and lab capability subject to regulatory, licensing, funding, technical and professional requirements. Future-facing visuals describe direction and readiness planning; they do not represent current manufacturing, product approval or confirmed advanced laboratory operations.</p></DisclaimerBox></div></section>
    </main>
  );
}
