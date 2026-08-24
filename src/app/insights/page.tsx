import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CapabilityStatus } from "@/components/CapabilityStatus";

export const metadata: Metadata = {
  title: "Health Intelligence",
  description: "MMS Health Intelligence translates preventive health, longevity and regional-care topics into clear, human-reviewed guidance.",
};

const lenses = [
  ["01", "Preventive Health", "What should I understand before symptoms appear?", "Screening, risk factors and questions worth bringing to a professional review.", "/health-screening"],
  ["02", "Longevity Science", "What is established, emerging or still uncertain?", "Research translated without hiding the limits of the evidence.", "/longevity-medicine"],
  ["03", "Treatments Explained", "What does this treatment actually mean?", "Plain-language orientation before any discussion of suitability.", "/treatments"],
  ["04", "Regional Care", "How can care differ between Malaysia and Thailand?", "Access, coordination and care-setting questions across the region.", "/medical-tourism"],
];

const standards = [
  ["Source", "Where the information comes from."],
  ["Strength", "How confident the evidence appears to be."],
  ["Uncertainty", "What the information cannot yet tell you."],
  ["Human review", "Where professional judgement still matters."],
];

export default function InsightsPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-[#14373a] text-ivory">
        <Image src="/mms-medicine-intelligence.webp" alt="" fill priority className="-z-30 object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(20,55,58,.97),rgba(20,55,58,.79)_50%,rgba(20,55,58,.2))]" />
        <div className="mx-auto flex min-h-[88vh] max-w-7xl items-center px-5 pb-20 pt-36 md:px-8 md:pt-44">
          <div className="max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#e8c19d]">MMS Health Intelligence</p>
            <h1 className="mt-5 text-balance font-serif text-6xl leading-[.98] md:text-8xl">Know more.<span className="block text-[#edc8a6]">Choose more carefully.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ivory/72">Clear explanations, visible uncertainty and human review — so you can ask better questions without having to become a medical expert.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="#explore" className="rounded-full bg-[#e4ba93] px-6 py-3.5 text-sm font-bold text-[#15373a]">Explore by question</Link><Link href="/ling" className="rounded-full border border-white/28 bg-white/[.06] px-6 py-3.5 text-sm font-bold text-white backdrop-blur">Ask Ling</Link></div>
          </div>
        </div>
      </section>

      <section id="explore" className="scroll-mt-24 bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Explore by question</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Knowledge should make the next conversation better.</h2></div>
            <p className="max-w-xl text-lg leading-8 text-warm-gray lg:justify-self-end">MMS separates education from recommendation. Learning can begin online; individual medical decisions still require the right professional review.</p>
          </div>

          <div className="mt-16 divide-y divide-[#ccb9a6] border-y border-[#ccb9a6]">
            {lenses.map(([number, title, question, note, href]) => (
              <Link key={title} href={href} className="group grid gap-5 py-9 md:grid-cols-[70px_.8fr_1.2fr_40px] md:items-center md:py-11">
                <span className="text-[10px] font-bold tracking-[.2em] text-terracotta">{number}</span>
                <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">{title}</p><h3 className="mt-3 font-serif text-3xl leading-tight text-navy md:text-4xl">{question}</h3></div>
                <p className="max-w-xl text-sm leading-7 text-warm-gray">{note}</p>
                <span className="text-2xl text-terracotta transition group-hover:translate-x-2">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#15383a] px-5 py-24 text-ivory md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div><CapabilityStatus status="development" /><p className="mt-7 text-[10px] font-bold uppercase tracking-[.26em] text-[#e4ba93]">The MMS reading standard</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">What we know matters.<br/><span className="text-[#e8c3a0]">What we do not know matters too.</span></h2></div>
            <p className="max-w-xl text-lg leading-8 text-ivory/66 lg:justify-self-end">Health Intelligence is being developed around transparent sourcing, evidence strength, uncertainty and human clearance rather than persuasive wellness claims.</p>
          </div>
          <div className="mt-16 grid gap-0 border-y border-white/16 sm:grid-cols-4">
            {standards.map(([title, text], index) => (
              <div key={title} className="py-8 sm:px-7 sm:first:pl-0 sm:last:pr-0 sm:[&+&]:border-l sm:[&+&]:border-white/14">
                <span className="text-[9px] font-bold tracking-[.18em] text-[#e4ba93]">0{index + 1}</span>
                <h3 className="mt-4 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ivory/56">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eadccc] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div className="relative min-h-[620px] overflow-hidden rounded-[48%_52%_45%_55%/45%_42%_58%_55%]">
            <Image src="/ling-mms-guide.png" alt="Ling supporting health education" fill className="object-cover object-[50%_18%]" sizes="(min-width:1024px) 54vw,100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15383a]/44 to-transparent" />
          </div>
          <div className="lg:pl-8">
            <p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">From knowledge to conversation</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.03] text-navy md:text-7xl">Understand first. Personalise later.</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">Ling can help clarify general questions and prepare you for the right human conversation. She does not diagnose, prescribe or decide treatment suitability.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/ling" className="rounded-full bg-[#173d42] px-6 py-3.5 text-sm font-bold text-white">Ask Ling</Link><Link href="/contact" className="rounded-full border border-[#bda994] px-6 py-3.5 text-sm font-bold text-navy">Speak with MMS</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
