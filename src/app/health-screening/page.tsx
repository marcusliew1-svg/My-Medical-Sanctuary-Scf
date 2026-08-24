import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";

const screeningBenefits = ["Detect earlier", "Know your baseline", "See patterns", "Plan ahead"];
const mayInclude = ["Blood investigations", "ECG", "Ultrasound", "Body composition", "Biological-age indicators", "Lifestyle assessment", "Doctor consultation", "Personalised report"];
const journey = ["Book", "Assess", "Review", "Understand", "Plan", "Continue"];

export default function HealthScreeningPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <section className="relative isolate min-h-[86vh] overflow-hidden bg-[#102f36] px-4 pb-16 pt-32 text-ivory md:pt-40">
        <Image src="/mms-health-screening-hero.png" alt="Doctor-led health screening consultation" fill priority className="-z-30 object-cover object-[62%_center] opacity-72" sizes="100vw" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(10,31,38,.98),rgba(10,31,38,.88)_47%,rgba(10,31,38,.22)),linear-gradient(0deg,rgba(10,31,38,.72),transparent_55%)]" />
        <div className="mms-kinetic-ring -right-24 top-24 -z-10 size-[36rem]" />
        <div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-12 lg:grid-cols-[.88fr_1.12fr]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">Health Screening</p>
            <h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">Know where<br/>you stand.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/64">A doctor-led starting point for understanding your current health and deciding what deserves attention next.</p>
            <div className="mt-9 flex flex-wrap gap-3"><ButtonLink href="/contact">Book screening</ButtonLink><ButtonLink href="/ling" variant="light">Ask Ling</ButtonLink></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {screeningBenefits.map((item,index)=><div key={item} className={`mms-shimmer min-h-[180px] rounded-[1.8rem] border p-5 ${index===1?"border-[#ddb58c]/35 bg-[#e4c09a] text-navy":"border-white/10 bg-white/[.055]"}`}><span className={`text-[9px] font-bold ${index===1?"text-[#7c4f35]":"text-[#dfb78f]"}`}>0{index+1}</span><p className="mt-12 font-serif text-3xl leading-tight">{item}</p></div>)}
          </div>
        </div>
      </section>

      <Section eyebrow="The purpose" title="Clarity before intervention." lead="Screening should help create a useful baseline and guide appropriate professional review—not push people into generic treatment packages.">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2.4rem] shadow-[0_30px_90px_rgba(40,44,42,.12)]"><Image src="/mms-about-hero.png" alt="MMS screening review" fill className="object-cover" sizes="(min-width:1024px) 60vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/88 via-transparent to-transparent"/><div className="absolute inset-x-7 bottom-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#dfb78f]">Doctor review</p><p className="mt-3 max-w-xl font-serif text-4xl">Numbers matter more when someone qualified helps put them in context.</p></div></div>
          <div className="grid gap-4">{["Doctor-led","Evidence-informed","Personalised","Actionable"].map((item,index)=><div key={item} className={`relative overflow-hidden rounded-[1.8rem] p-6 ${index===2?"bg-[#e4c09a] text-navy":"bg-[#173d43] text-ivory"}`}><span className={`text-[9px] font-bold ${index===2?"text-[#7d4f33]":"text-[#dfb78f]"}`}>0{index+1}</span><p className="mt-8 font-serif text-3xl">{item}</p></div>)}</div>
        </div>
      </Section>

      <Section eyebrow="May include" title="A screening built from the right pieces." lead="Exact investigations are confirmed according to the person, clinical context and booking pathway." className="bg-[#eee4d7]">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-[#d1beac] bg-[#d1beac] md:grid-cols-4">
          {mayInclude.map((item,index)=><div key={item} className="min-h-[150px] bg-[#faf6f0] p-5"><span className="text-[9px] font-bold text-terracotta">0{index+1}</span><p className="mt-8 font-serif text-xl leading-tight text-navy">{item}</p></div>)}
        </div>
      </Section>

      <Section eyebrow="What happens next" title="Screen. Review. Then decide." dark>
        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-6">
          {journey.map((step,index)=><div key={step} className={`relative min-h-[240px] p-5 ${index===2?"bg-[#e4c09a] text-navy":"bg-[#102f36] text-ivory"}`}><span className={`text-[9px] font-bold ${index===2?"text-[#7c4f35]":"text-[#dfb78f]"}`}>0{index+1}</span><div className={`mt-20 h-px w-10 ${index===2?"bg-navy/20":"bg-[#dfb78f]/35"}`}/><h3 className="mt-6 font-serif text-2xl">{step}</h3>{index<5?<span className={`absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full md:grid ${index===2?"bg-navy text-white":"bg-[#e4c09a] text-navy"}`}>→</span>:null}</div>)}
        </div>
      </Section>

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-28"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Next step</p><h2 className="mt-4 max-w-4xl font-serif text-5xl leading-tight text-navy md:text-6xl">Begin by understanding your health.</h2></div><ButtonLink href="/contact">Book screening</ButtonLink></div></section>
    </main>
  );
}
