import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { HomeHeroVisual } from "@/components/HomeHeroVisual";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description: "A private, physician-guided preventive health and personalised longevity journey across Malaysia and Thailand.",
};

const goals = [
  ["Understand my health", "Screening, health discovery and physician review.", "/health-discovery"],
  ["Feel and function better", "Metabolic health, sleep, energy and recovery.", "/health-concerns"],
  ["Age well", "Preventive planning, longevity and continuity over time.", "/longevity-medicine"],
  ["Explore advanced options", "Regenerative and advanced pathways considered individually.", "/treatments"],
];

const journey = [
  ["01", "Discover", "What matters to you"],
  ["02", "Assess", "Build your baseline"],
  ["03", "Review", "Doctor-led interpretation"],
  ["04", "Personalise", "Shape the right plan"],
  ["05", "Continue", "Stay connected over time"],
];

const intelligence = [
  ["Preventive Health", "What screening can reveal — and what it cannot."],
  ["Longevity Science", "What is established, what is emerging, and what remains uncertain."],
  ["Treatment Knowledge", "Understand a therapy before deciding whether it belongs in your care journey."],
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#f7f0e7]">
      <HomeHeroVisual />

      <section className="relative bg-[#f7f0e7] px-5 py-24 md:px-8 md:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Why MMS exists</p>
              <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
                Most healthcare begins when something goes wrong.
                <span className="mt-2 block text-[#b7795e]">MMS begins earlier.</span>
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-warm-gray lg:justify-self-end">
              We help you understand your health, make better-informed decisions with qualified professionals, and build continuity around the years ahead.
            </p>
          </div>

          <div className="mt-16 grid gap-0 border-y border-[#cdb9a6] md:grid-cols-3">
            {[
              ["Understand earlier", "See the bigger picture before problems become urgent."],
              ["Decide better", "Put medical judgement ahead of treatment selection."],
              ["Stay healthier longer", "Turn one-off encounters into an ongoing health relationship."],
            ].map(([title, copy], index) => (
              <div key={title} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0 [&+&]:border-t [&+&]:border-[#cdb9a6] md:[&+&]:border-l md:[&+&]:border-t-0">
                <span className="text-[10px] font-bold tracking-[.2em] text-terracotta">0{index + 1}</span>
                <h3 className="mt-5 font-serif text-3xl text-navy">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-warm-gray">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#e9dccd] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Start with you</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">What would you like to understand better?</h2>
          </div>
          <div className="mt-14 divide-y divide-[#c4ad98] border-y border-[#c4ad98]">
            {goals.map(([title, copy, href], index) => (
              <Link key={title} href={href} className="group grid gap-4 py-7 md:grid-cols-[70px_1fr_1fr_40px] md:items-center md:py-9">
                <span className="text-[10px] font-bold tracking-[.2em] text-terracotta">0{index + 1}</span>
                <h3 className="font-serif text-3xl text-navy transition duration-500 group-hover:translate-x-2 md:text-4xl">{title}</h3>
                <p className="max-w-lg text-sm leading-7 text-warm-gray">{copy}</p>
                <span className="text-2xl text-terracotta transition duration-500 group-hover:translate-x-2">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[760px] overflow-hidden bg-[#173b3d] text-ivory">
        <Image src="/mms-health-screening-hero.png" alt="Physician-guided health review at MMS" fill className="object-cover object-center opacity-72" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,55,57,.96),rgba(20,55,57,.74)_45%,rgba(20,55,57,.16))]" />
        <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-5 py-24 md:px-8">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#ebc6a4]">Medical trust</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">Medical judgement comes first.</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ivory/76">
              Technology can organise information and advanced therapies can expand options. Diagnosis, suitability and medical decisions remain with qualified healthcare professionals.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6 text-[10px] font-semibold uppercase tracking-[.14em] text-ivory/64">
              <span>Assessment first</span><span>Suitability first</span><span>Human review</span>
            </div>
            <div className="mt-9"><CTAButton href="/about-mms">Our care philosophy</CTAButton></div>
          </div>
        </div>
      </section>

      <section className="bg-[#15383a] px-5 py-24 text-ivory md:px-8 md:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e7bd98]">The MMS journey</p>
              <h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">One relationship. Five thoughtful steps.</h2>
            </div>
            <p className="max-w-lg text-base leading-8 text-ivory/64 lg:justify-self-end">A guided path from first question to long-term continuity.</p>
          </div>
          <div className="relative mt-20 grid gap-12 md:grid-cols-5 md:gap-5">
            <div className="absolute left-0 right-0 top-[17px] hidden h-px bg-gradient-to-r from-[#e6bc97]/20 via-[#e6bc97]/70 to-[#e6bc97]/20 md:block" />
            {journey.map(([number, title, copy]) => (
              <div key={number} className="relative">
                <span className="relative z-10 inline-grid size-9 place-items-center rounded-full border border-[#e6bc97]/60 bg-[#15383a] text-[9px] font-bold text-[#edc8a6]">{number}</span>
                <h3 className="mt-7 font-serif text-3xl">{title}</h3>
                <p className="mt-3 max-w-[190px] text-sm leading-6 text-ivory/58">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f0e7] px-5 py-24 md:px-8 md:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div className="relative min-h-[650px] overflow-hidden rounded-[46%_54%_48%_52%/42%_42%_58%_58%]">
              <Image src="/mms-membership-journey.webp" alt="Healthy ageing and quality of life" fill className="object-cover" sizes="(min-width:1024px) 58vw,100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17383a]/40 to-transparent" />
            </div>
            <div className="lg:pl-8">
              <p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">The long view</p>
              <h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Longevity is about protecting the quality of the years ahead.</h2>
              <p className="mt-7 text-lg leading-8 text-warm-gray">Not chasing every new therapy. Not waiting for a crisis. Building a clearer understanding of your health and revisiting it over time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e8dacb] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Programmes</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Different depths. One standard of care.</h2></div>
            <p className="max-w-lg text-base leading-8 text-warm-gray lg:justify-self-end">The programme names describe depth of continuity and coordination — not a promise that every therapy is suitable.</p>
          </div>
          <div className="mt-14 divide-y divide-[#c4ad98] border-y border-[#c4ad98]">
            {memberships.map((membership, index) => (
              <Link href="/memberships" key={membership.name} className="group grid gap-4 py-7 md:grid-cols-[70px_1fr_1fr_40px] md:items-center">
                <span className="text-[10px] font-bold tracking-[.2em] text-terracotta">0{index + 1}</span>
                <h3 className="font-serif text-4xl text-navy transition group-hover:translate-x-2">{membership.name}</h3>
                <p className="text-sm leading-7 text-warm-gray">{membership.tagline}</p>
                <span className="text-2xl text-terracotta">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#f8f3eb] px-5 py-24 md:px-8 md:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Health Intelligence</p>
              <h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Know more before deciding more.</h2>
              <p className="mt-7 max-w-md text-base leading-8 text-warm-gray">We want patients to understand the evidence, uncertainty and questions worth bringing to a professional conversation.</p>
              <div className="mt-8"><CTAButton href="/insights" variant="outline">Explore Health Intelligence</CTAButton></div>
            </div>
            <div className="divide-y divide-[#d3c2b0] border-y border-[#d3c2b0]">
              {intelligence.map(([title, copy], index) => (
                <Link href="/insights" key={title} className="group block py-9 md:py-11">
                  <div className="flex items-start gap-6"><span className="mt-1 text-[10px] font-bold tracking-[.2em] text-terracotta">0{index + 1}</span><div><h3 className="font-serif text-3xl text-navy transition group-hover:translate-x-2 md:text-4xl">{title}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-warm-gray">{copy}</p></div></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[700px] overflow-hidden bg-[#143638] text-ivory">
        <Image src="/mms-about-hero.png" alt="Begin a conversation with MMS" fill className="object-cover object-center opacity-58" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,54,56,.94),rgba(20,54,56,.64),rgba(20,54,56,.18))]" />
        <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-5 py-24 md:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e7bd98]">Begin simply</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">Your health journey can begin with a conversation.</h2>
            <div className="mt-9 flex flex-wrap gap-3"><CTAButton href="/book-appointment">Book a consultation</CTAButton><CTAButton href="/ling" variant="outline">Start with Ling</CTAButton></div>
          </div>
        </div>
      </section>
    </main>
  );
}
