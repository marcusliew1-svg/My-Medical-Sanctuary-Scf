import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CapabilityStatus } from "@/components/CapabilityStatus";

export const metadata: Metadata = {
  title: "Health Intelligence",
  description:
    "MMS Health Intelligence translates preventive health, longevity and regional-care topics into clear, human-reviewed guidance.",
};

const lenses = [
  {
    number: "01",
    title: "Preventive Health",
    question: "What should I understand before symptoms appear?",
    note: "Screening, risk factors and practical questions for professional review.",
    href: "/health-screening",
  },
  {
    number: "02",
    title: "Longevity Science",
    question: "What is established, emerging or still uncertain?",
    note: "Research translated with the limits of the evidence kept visible.",
    href: "/longevity-medicine",
  },
  {
    number: "03",
    title: "Treatments Explained",
    question: "What does this treatment actually mean?",
    note: "Plain-language orientation before any suitability discussion.",
    href: "/treatments",
  },
  {
    number: "04",
    title: "Regional Care",
    question: "How can care differ between Malaysia and Thailand?",
    note: "Access, coordination and care-setting questions across the region.",
    href: "/medical-tourism",
  },
];

const readingStandard = [
  ["Source", "Where the information comes from."],
  ["Strength", "How confident the evidence appears to be."],
  ["Uncertainty", "What the information cannot yet tell you."],
  ["Human review", "Where professional judgement still matters."],
];

export default function InsightsPage() {
  return (
    <main className="overflow-hidden bg-[#f5efe6]">
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-[#0b2931] px-4 pt-32 text-ivory md:pt-40">
        <Image
          src="/mms-medicine-intelligence.webp"
          alt=""
          fill
          priority
          className="-z-20 object-cover object-center opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,31,38,.98),rgba(8,31,38,.84)_48%,rgba(8,31,38,.42)),linear-gradient(0deg,rgba(8,31,38,.9),transparent_55%)]" />
        <div className="mms-kinetic-ring absolute -right-24 top-28 size-[430px] border-white/10" />
        <div className="mms-kinetic-ring absolute right-12 top-52 size-[210px] border-[#dfb78f]/20" />
        <div className="relative mx-auto flex min-h-[calc(88vh-8rem)] max-w-7xl items-center pb-16">
          <div className="max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e0b88f]">MMS Health Intelligence</p>
            <h1 className="mt-5 text-balance font-serif text-5xl leading-[.98] md:text-7xl lg:text-8xl">
              Better health decisions begin with better understanding.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ivory/68">
              Clear explanations. Visible uncertainty. Human review. No need to become a medical expert before asking better questions.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#explore" className="rounded-full bg-[#dfb58c] px-6 py-3 text-sm font-bold text-[#15343a] transition hover:-translate-y-0.5">Explore by question</Link>
              <Link href="/ling" className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">Ask Ling</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d6c5b5] bg-[#eee3d6] px-4 py-7">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-[1.4rem] border border-[#d5c0ab] bg-[#d5c0ab] sm:grid-cols-4">
          {["Understand the claim", "See the evidence", "Know the uncertainty", "Take questions to a professional"].map((item, index) => (
            <div key={item} className="bg-[#f7f1e8] px-5 py-5 text-center">
              <span className="text-[10px] font-bold tracking-[.18em] text-terracotta">0{index + 1}</span>
              <p className="mt-2 font-serif text-lg text-navy">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="explore" className="scroll-mt-24 bg-[#f7f1e8] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Explore by question</p>
              <h2 className="mt-4 font-serif text-5xl leading-[1.02] text-navy md:text-6xl">Knowledge should help you ask better questions.</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-warm-gray lg:justify-self-end">
              MMS separates education from recommendation. Learning can begin online; individual medical decisions still require the right professional review.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {lenses.map((lens, index) => (
              <Link
                key={lens.title}
                href={lens.href}
                className={`group relative min-h-[360px] overflow-hidden rounded-[2rem] border p-7 shadow-soft transition duration-500 hover:-translate-y-2 ${
                  index === 1 || index === 3
                    ? "border-white/10 bg-[#153d42] text-ivory"
                    : "border-[#d8c8b8] bg-white text-navy"
                }`}
              >
                <div className="absolute -right-16 -top-16 size-48 rounded-full border border-current opacity-10 transition duration-700 group-hover:scale-125" />
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold tracking-[.2em] ${index === 1 || index === 3 ? "text-[#dfba96]" : "text-terracotta"}`}>{lens.number}</span>
                  <span className="text-2xl opacity-35 transition group-hover:translate-x-1">↗</span>
                </div>
                <p className={`mt-16 text-[10px] font-bold uppercase tracking-[.18em] ${index === 1 || index === 3 ? "text-[#dfba96]" : "text-deep-green"}`}>{lens.title}</p>
                <h3 className="mt-3 max-w-lg font-serif text-3xl leading-tight md:text-4xl">{lens.question}</h3>
                <p className={`mt-5 max-w-lg text-sm leading-7 ${index === 1 || index === 3 ? "text-ivory/60" : "text-warm-gray"}`}>{lens.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0c2c33] px-4 py-24 text-ivory md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <CapabilityStatus status="development" />
            <p className="mt-7 text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb88f]">The MMS reading standard</p>
            <h2 className="mt-4 font-serif text-5xl leading-[1.02] md:text-6xl">What we know matters. What we do not know matters too.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-ivory/62">
              The Health Intelligence desk is being developed around transparent sourcing, evidence strength, uncertainty and human clearance rather than persuasive wellness claims.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2">
            {readingStandard.map(([title, text], index) => (
              <div key={title} className="min-h-[210px] bg-[#0c2c33] p-6 md:p-7">
                <span className="text-[10px] font-bold tracking-[.2em] text-[#dfb88f]">0{index + 1}</span>
                <h3 className="mt-10 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ivory/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ebe0d2] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2.4rem] shadow-premium">
            <Image src="/ling-mms-guide.png" alt="Ling supporting health education" fill className="object-cover object-[50%_18%]" sizes="(min-width:1024px) 54vw,100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2931]/85 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.4rem] border border-white/20 bg-[#0d3036]/80 p-5 text-ivory backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e0ba95]">A simple first step</p>
              <p className="mt-2 font-serif text-2xl">Ask a question before choosing a pathway.</p>
            </div>
          </div>
          <div className="lg:pl-8">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">From knowledge to conversation</p>
            <h2 className="mt-4 font-serif text-5xl leading-[1.03] text-navy md:text-6xl">Understand first. Personalise later.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-warm-gray">
              Ling can help you clarify general questions and prepare for the right human conversation. She does not diagnose, prescribe or decide treatment suitability.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ling" className="rounded-full bg-[#173d42] px-6 py-3 text-sm font-bold text-white">Ask Ling</Link>
              <Link href="/contact" className="rounded-full border border-[#bda994] px-6 py-3 text-sm font-bold text-navy">Speak with MMS</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
