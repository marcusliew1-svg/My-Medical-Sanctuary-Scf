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

const levels = [
  { name: "Ascend", word: "Discover", signal: "Baseline", tone: "bg-[#355c59]", numeral: "01" },
  { name: "Evolve", word: "Optimise", signal: "Momentum", tone: "bg-[#52736a]", numeral: "02" },
  { name: "Eterna", word: "Protect", signal: "Continuity", tone: "bg-[#263b47]", numeral: "03" },
  { name: "Pinnacle", word: "Coordinate", signal: "Concierge", tone: "bg-[#d7b18c] text-navy", numeral: "04" },
];

export default function MembershipsPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <section className="relative isolate min-h-[82vh] overflow-hidden bg-[#102f36] px-4 pb-16 pt-32 text-ivory md:pt-40">
        <Image src="/mms-membership-journey.webp" alt="" fill priority className="-z-30 object-cover opacity-55" sizes="100vw" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(10,31,38,.98),rgba(10,31,38,.84)_46%,rgba(10,31,38,.28))]" />
        <div className="absolute -right-20 top-24 -z-10 size-[34rem] rounded-full border border-[#e0b78e]/15" />
        <div className="absolute right-12 top-44 -z-10 size-[22rem] rounded-full border border-[#e0b78e]/15" />
        <div className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#e2bb95]">MMS memberships</p>
            <h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">Four depths.<span className="block text-[#e7c4a2]">One relationship.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/66">Choose how much continuity and coordination you want around your health.</p>
            <div className="mt-9 flex flex-wrap gap-3"><CTAButton href="/ling">Find your fit</CTAButton><CTAButton href="/contact" variant="outline">Speak with MMS</CTAButton></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {levels.map((level, index) => (
              <Link key={level.name} href="#membership-levels" className={`mms-shimmer group relative min-h-[230px] overflow-hidden rounded-[2rem] ${level.tone} p-6 shadow-[0_24px_70px_rgba(0,0,0,.2)] transition hover:-translate-y-2`}>
                <div className="absolute -right-12 -top-12 size-40 rounded-full border border-white/12" />
                <p className={`text-[10px] font-bold uppercase tracking-[.2em] ${index === 3 ? "text-[#7c4f35]" : "text-[#e4bd98]"}`}>{level.signal}</p>
                <div className="mt-16 flex items-end justify-between gap-4"><div><h2 className="font-serif text-4xl">{level.name}</h2><p className={`mt-2 text-xs font-bold uppercase tracking-[.16em] ${index === 3 ? "text-navy/60" : "text-ivory/62"}`}>{level.word}</p></div><span className={`font-serif text-6xl ${index === 3 ? "text-navy/12" : "text-white/12"}`}>{level.numeral}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe5d8] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">How to think about it</p><h2 className="mt-4 font-serif text-5xl leading-tight text-navy md:text-6xl">Not more products.<br/>More continuity.</h2></div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] bg-[#cdb9a7] sm:grid-cols-4">
              {["Discover","Plan","Coordinate","Continue"].map((item, index)=><div key={item} className="bg-[#f7f1e8] p-6 text-center"><span className="text-[10px] font-bold text-terracotta">0{index+1}</span><p className="mt-4 font-serif text-2xl text-navy">{item}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="membership-levels" className="bg-[#f8f3eb] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">The four levels</p><h2 className="mt-4 font-serif text-5xl text-navy md:text-6xl">See the difference at a glance.</h2></div>
          <div className="space-y-5">
            {memberships.map((membership, index) => (
              <article key={membership.name} className={`group relative overflow-hidden rounded-[2.4rem] border ${index === 3 ? "border-[#d4a97f] bg-[#e5c39f] text-navy" : "border-[#d8c8b8] bg-white"} shadow-[0_26px_80px_rgba(38,46,44,.08)]`}>
                <div className="grid lg:grid-cols-[.62fr_1.38fr]">
                  <div className={`relative min-h-[260px] overflow-hidden p-7 md:p-9 ${index === 0 ? "bg-[#355c59]" : index === 1 ? "bg-[#52736a]" : index === 2 ? "bg-[#263b47]" : "bg-[#e5c39f]"} ${index === 3 ? "text-navy" : "text-ivory"}`}>
                    <div className="absolute -right-16 top-0 size-56 rounded-full border border-white/10" />
                    <p className={`text-[10px] font-bold uppercase tracking-[.2em] ${index === 3 ? "text-[#7d5034]" : "text-[#dfb88f]"}`}>Level {index+1}</p>
                    <h3 className="mt-8 font-serif text-5xl md:text-6xl">{membership.name}</h3>
                    <p className={`mt-3 text-sm font-semibold ${index === 3 ? "text-navy/68" : "text-ivory/66"}`}>{membership.tagline}</p>
                    <span className={`absolute bottom-5 right-7 font-serif text-8xl ${index === 3 ? "text-navy/10" : "text-white/10"}`}>0{index+1}</span>
                  </div>
                  <div className="grid gap-7 p-7 md:grid-cols-3 md:p-9">
                    <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">Best for</p><p className="mt-3 font-serif text-2xl leading-snug text-navy">{membership.whoItSuits}</p></div>
                    <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">Coordination</p><p className="mt-3 text-sm leading-7 text-warm-gray">{membership.coordination}</p></div>
                    <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">Opening rhythm</p><div className="mt-3 flex flex-wrap gap-2">{membership.firstThirtyDays.slice(0,3).map(item => <span key={item} className="rounded-full border border-[#d8c6b5] bg-[#f8f3eb] px-3 py-2 text-[11px] text-navy">{item}</span>)}</div></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#173d43] px-4 py-24 text-ivory md:py-28">
        <div className="mms-kinetic-ring -right-20 top-1/2 size-80 -translate-y-1/2" />
        <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_.7fr] md:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">Not sure?</p><h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Start with your goals.<br/><span className="text-[#e6c3a2]">Not a package.</span></h2></div>
          <div className="md:justify-self-end"><CTAButton href="/ling">Ask Ling</CTAButton></div>
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-4 py-10"><div className="mx-auto max-w-5xl"><DisclaimerBox><p>Membership does not promise specific outcomes. Any wellness pathway is subject to professional review and suitability assessment.</p></DisclaimerBox></div></section>
    </main>
  );
}
