import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Memberships",
  description: "Explore MMS memberships including Ascend, Evolve, Eterna and Pinnacle for structured wellness coordination.",
};

const descriptors = ["Understand your baseline", "Build momentum", "Protect continuity", "Private coordination"];

export default function MembershipsPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <section className="relative isolate min-h-[84vh] overflow-hidden bg-[#15383a] text-ivory">
        <Image src="/mms-membership-journey.webp" alt="" fill priority className="-z-30 object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(20,55,57,.96),rgba(20,55,57,.76)_48%,rgba(20,55,57,.16))]" />
        <div className="mx-auto flex min-h-[84vh] max-w-7xl items-center px-5 pb-20 pt-36 md:px-8 md:pt-44">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#e9c3a0]">MMS programmes</p>
            <h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">Different depths.<span className="block text-[#edc8a6]">One relationship.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ivory/72">Choose the level of continuity and coordination that fits your life. The medical standard stays the same.</p>
            <div className="mt-9 flex flex-wrap gap-3"><CTAButton href="#membership-levels">Explore the levels</CTAButton><CTAButton href="/ling" variant="outline">Start with your goals</CTAButton></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Why membership</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Not more products.<br/><span className="text-[#b7795e]">More continuity.</span></h2></div>
            <p className="max-w-xl text-lg leading-8 text-warm-gray lg:justify-self-end">Membership is the structure around the relationship: discovery, coordination, review and follow-through. Treatment decisions still depend on professional assessment and suitability.</p>
          </div>
          <div className="mt-16 grid gap-0 border-y border-[#cbb8a5] md:grid-cols-4">
            {["Discover", "Plan", "Coordinate", "Continue"].map((item, index) => (
              <div key={item} className="py-8 md:px-7 md:first:pl-0 md:last:pr-0 md:[&+&]:border-l md:[&+&]:border-[#cbb8a5]">
                <span className="text-[10px] font-bold tracking-[.18em] text-terracotta">0{index + 1}</span>
                <p className="mt-4 font-serif text-3xl text-navy">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="membership-levels" className="bg-[#eadccc] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">The four levels</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">A deeper relationship as your needs become more complex.</h2></div>
          <div className="divide-y divide-[#c4ad98] border-y border-[#c4ad98]">
            {memberships.map((membership, index) => (
              <article key={membership.name} className="grid gap-7 py-10 md:grid-cols-[80px_.72fr_1.28fr] md:items-start md:py-14">
                <span className="text-[10px] font-bold tracking-[.2em] text-terracotta">0{index + 1}</span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">{descriptors[index]}</p>
                  <h3 className="mt-3 font-serif text-5xl text-navy md:text-6xl">{membership.name}</h3>
                  <p className="mt-3 text-sm text-warm-gray">{membership.tagline}</p>
                </div>
                <div className="grid gap-7 sm:grid-cols-2">
                  <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">Best for</p><p className="mt-3 font-serif text-2xl leading-snug text-navy">{membership.whoItSuits}</p></div>
                  <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">Continuity</p><p className="mt-3 text-sm leading-7 text-warm-gray">{membership.coordination}</p></div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3"><CTAButton href="/ling">Ask Ling which level fits</CTAButton><CTAButton href="/contact" variant="outline">Speak with MMS</CTAButton></div>
        </div>
      </section>

      <section className="relative min-h-[640px] overflow-hidden bg-[#15383a] text-ivory">
        <Image src="/mms-about-hero.png" alt="MMS long-term health relationship" fill className="object-cover opacity-55" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,55,57,.95),rgba(20,55,57,.63),rgba(20,55,57,.16))]" />
        <div className="relative mx-auto flex min-h-[640px] max-w-7xl items-center px-5 py-24 md:px-8">
          <div className="max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e7bd98]">Still deciding?</p><h2 className="mt-5 font-serif text-5xl leading-[1.03] md:text-7xl">Start with your health goals. Not a package.</h2><p className="mt-7 max-w-xl text-lg leading-8 text-ivory/70">The right level should follow from what you need, how much continuity you want, and what a professional review suggests.</p><div className="mt-9"><CTAButton href="/health-discovery">Begin with Health Discovery</CTAButton></div></div>
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-5 py-10 md:px-8"><div className="mx-auto max-w-5xl"><DisclaimerBox><p>Membership does not promise specific outcomes. Any wellness pathway is subject to professional review and suitability assessment.</p></DisclaimerBox></div></section>
    </main>
  );
}
