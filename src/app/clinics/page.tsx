import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Our Locations",
  description: "Explore the developing MMS wellness, specialised medical and regional care network.",
};

const locations = [
  {
    eyebrow: "Bangsar · Kuala Lumpur",
    title: "Wellness & Preventive Care",
    image: "/mms-health-screening-hero.png",
    tone: "light",
    notes: ["GP-led wellness", "Health discovery", "Personalised planning"],
  },
  {
    eyebrow: "SS2 · Petaling Jaya",
    title: "Dialysis & Specialised Medical Care",
    image: "/mms-about-hero.png",
    tone: "dark",
    notes: ["Dedicated medical setting", "Dialysis focus", "Clinical continuity"],
  },
  {
    eyebrow: "Thailand",
    title: "Regional Care Corridor",
    image: "/mms-membership-journey.webp",
    tone: "warm",
    notes: ["Care navigation", "Specialist access", "Cross-border follow-up"],
  },
];

export default function ClinicsPage(){
  return <main className="overflow-hidden bg-[#f7f1e8]">
    <section className="relative isolate min-h-[82vh] overflow-hidden bg-[#102f36] px-4 pb-16 pt-32 text-ivory md:pt-40">
      <Image src="/mms-health-screening-hero.png" alt="" fill priority className="-z-30 object-cover opacity-58" sizes="100vw"/>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(10,31,38,.98),rgba(10,31,38,.84)_48%,rgba(10,31,38,.24))]"/>
      <div className="mms-kinetic-ring -right-28 top-20 -z-10 size-[36rem]"/>
      <div className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
        <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">MMS care network</p><h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">Different settings.<span className="block text-[#e6c2a0]">One relationship.</span></h1><p className="mt-6 max-w-xl text-lg leading-8 text-ivory/62">Wellness, specialised medical care and regional coordination under one MMS journey.</p><div className="mt-9"><CTAButton href="/contact">Speak with MMS</CTAButton></div></div>
        <div className="hidden min-h-[500px] lg:block relative"><div className="absolute left-[10%] top-[8%] size-60 rounded-full border border-[#dfb78f]/18"/><div className="absolute right-[8%] bottom-[6%] size-72 rounded-full border border-white/10"/><div className="absolute left-[12%] top-[22%] rounded-[1.7rem] bg-[#f4e9dc] p-6 text-navy shadow-2xl"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-terracotta">Bangsar</p><p className="mt-2 font-serif text-3xl">Wellness</p></div><div className="absolute right-[5%] top-[30%] rounded-[1.7rem] border border-white/12 bg-white/[.07] p-6 backdrop-blur-xl"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#dfb78f]">SS2</p><p className="mt-2 font-serif text-3xl">Medical</p></div><div className="absolute bottom-[12%] left-[34%] rounded-[1.7rem] bg-[#dcb58e] p-6 text-navy shadow-2xl"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#7d4f33]">Thailand</p><p className="mt-2 font-serif text-3xl">Regional care</p></div><div className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#e2bd98]/40 bg-[#173d43] font-serif text-2xl shadow-2xl">MMS</div></div>
      </div>
    </section>

    <section className="bg-[#efe4d7] px-4 py-24 md:py-32"><div className="mx-auto max-w-7xl"><div className="mb-12"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Our settings</p><h2 className="mt-4 font-serif text-5xl text-navy md:text-6xl">Each place has a clear role.</h2></div><div className="grid gap-5 lg:grid-cols-3">{locations.map((location,index)=><article key={location.eyebrow} className={`group overflow-hidden rounded-[2.2rem] border shadow-[0_26px_70px_rgba(40,44,42,.09)] ${index===1?"border-[#284c50] bg-[#173d43] text-ivory":index===2?"border-[#d4ad87] bg-[#e5c29e] text-navy":"border-[#d5c2b0] bg-white text-navy"}`}><div className="relative h-72 overflow-hidden"><Image src={location.image} alt="" fill className="object-cover transition duration-1000 group-hover:scale-[1.04]" sizes="(min-width:1024px) 33vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/70 via-transparent to-transparent"/><p className="absolute bottom-5 left-5 text-[9px] font-bold uppercase tracking-[.18em] text-[#f0d2b3]">{location.eyebrow}</p></div><div className="p-7"><h3 className="font-serif text-4xl leading-tight">{location.title}</h3><div className="mt-8 grid gap-2">{location.notes.map(note=><div key={note} className={`rounded-xl px-4 py-3 text-sm ${index===1?"bg-white/[.055] text-ivory/66":index===2?"bg-white/35 text-navy/68":"bg-[#f6efe7] text-warm-gray"}`}>{note}</div>)}</div></div></article>)}</div><div className="mt-10 flex flex-wrap gap-3"><CTAButton href="/contact">Request location guidance</CTAButton><CTAButton href="/medical-tourism" variant="outline">Explore regional care</CTAButton></div></div></section>

    <section className="bg-[#102f36] px-4 py-24 text-ivory md:py-28"><div className="mx-auto max-w-7xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">One MMS relationship</p><h2 className="mx-auto mt-5 max-w-5xl font-serif text-5xl leading-[1.02] md:text-7xl">Where you receive care can change.<br/><span className="text-[#e6c29f]">The story should stay connected.</span></h2></div></section>
  </main>
}
