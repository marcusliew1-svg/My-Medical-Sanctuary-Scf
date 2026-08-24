import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";

const mayInclude = ["Blood investigations", "ECG", "Ultrasound", "Body composition", "Biological-age indicators", "Lifestyle assessment", "Doctor consultation", "Personalised report"];
const journey = [["01","Book","Choose a starting point"],["02","Assess","Build the health picture"],["03","Review","Doctor-led interpretation"],["04","Understand","See what matters now"],["05","Plan","Agree the next step"],["06","Continue","Revisit over time"]];

export default function HealthScreeningPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-[#15383a] text-ivory">
        <Image src="/mms-health-screening-hero.png" alt="Doctor-led health screening consultation" fill priority className="-z-30 object-cover object-[62%_center]" sizes="100vw" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(20,55,58,.96),rgba(20,55,58,.76)_48%,rgba(20,55,58,.15))]" />
        <div className="mx-auto flex min-h-[88vh] max-w-7xl items-center px-5 pb-20 pt-36 md:px-8 md:pt-44">
          <div className="max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#e7bd98]">Health Screening</p><h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">Know where you stand.<span className="block text-[#edc8a6]">Before deciding what comes next.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-ivory/72">A physician-guided starting point for understanding your current health and deciding what deserves attention.</p><div className="mt-9 flex flex-wrap gap-3"><ButtonLink href="/contact">Book screening</ButtonLink><ButtonLink href="/ling" variant="light">Ask Ling</ButtonLink></div></div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Why screen</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Clarity before intervention.</h2></div>
          <div className="lg:justify-self-end"><p className="max-w-xl text-lg leading-8 text-warm-gray">Screening should create a useful baseline, reveal patterns worth discussing and support appropriate professional review — not automatically lead to a treatment package.</p><div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#cdb9a6] pt-5 text-[10px] font-semibold uppercase tracking-[.14em] text-terracotta"><span>Detect earlier</span><span>Know your baseline</span><span>See patterns</span><span>Plan ahead</span></div></div>
        </div>
      </section>

      <section className="bg-[#eadccc] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div className="relative min-h-[680px] overflow-hidden rounded-[48%_52%_46%_54%/43%_44%_56%_57%]"><Image src="/mms-about-hero.png" alt="MMS screening review" fill className="object-cover" sizes="(min-width:1024px) 55vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#15383a]/42 to-transparent"/></div>
          <div className="lg:pl-8"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Doctor review</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Numbers matter more when someone qualified puts them in context.</h2><p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">Results are only one part of the picture. History, symptoms, goals, risk and professional judgement determine what deserves attention next.</p></div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl"><div className="grid gap-9 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">May include</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Built from the right pieces for the right person.</h2></div><p className="max-w-xl text-lg leading-8 text-warm-gray lg:justify-self-end">Exact investigations are confirmed according to the individual, clinical context and booking pathway.</p></div><div className="mt-14 grid gap-0 border-y border-[#cdb9a6] sm:grid-cols-2 md:grid-cols-4">{mayInclude.map((item,index)=><div key={item} className="py-7 sm:px-6 sm:first:pl-0 md:[&+&]:border-l md:[&+&]:border-[#cdb9a6]"><span className="text-[9px] font-bold tracking-[.18em] text-terracotta">0{index+1}</span><p className="mt-4 font-serif text-xl leading-tight text-navy">{item}</p></div>)}</div></div>
      </section>

      <section className="bg-[#15383a] px-5 py-24 text-ivory md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl"><div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e4ba93]">What happens next</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">Screen. Review. Then decide.</h2></div><p className="max-w-xl text-lg leading-8 text-ivory/64 lg:justify-self-end">The purpose of screening is to improve the next decision, not to rush it.</p></div><div className="relative mt-20 grid gap-12 md:grid-cols-6 md:gap-5"><div className="absolute left-0 right-0 top-[17px] hidden h-px bg-gradient-to-r from-[#e5bc98]/20 via-[#e5bc98]/70 to-[#e5bc98]/20 md:block" />{journey.map(([number,title,text])=><div key={number} className="relative"><span className="relative z-10 inline-grid size-9 place-items-center rounded-full border border-[#e5bc98]/55 bg-[#15383a] text-[9px] font-bold text-[#edc8a6]">{number}</span><h3 className="mt-7 font-serif text-2xl">{title}</h3><p className="mt-3 max-w-[180px] text-xs leading-6 text-ivory/56">{text}</p></div>)}</div></div>
      </section>

      <section className="bg-[#f8f3eb] px-5 py-24 md:px-8 md:py-28"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Next step</p><h2 className="mt-4 max-w-4xl font-serif text-5xl leading-tight text-navy md:text-6xl">Begin by understanding your health.</h2></div><ButtonLink href="/contact">Book screening</ButtonLink></div></section>
    </main>
  );
}
