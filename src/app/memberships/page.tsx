import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { memberships } from "@/data/memberships";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "Explore MMS memberships including Ascend, Evolve, Eterna and Pinnacle for structured wellness coordination.",
};

export default function MembershipsPage() {
  const levels = [
    { name: "Ascend", rate: "5%", icon: "△", promise: "Discover", cadence: "Milestone follow-up", access: "Guided" },
    { name: "Evolve", rate: "10%", icon: "◇", promise: "Optimise", cadence: "Quarterly", access: "Structured" },
    { name: "Eterna", rate: "15%", icon: "♧", promise: "Protect", cadence: "Ongoing roadmap", access: "Priority" },
    { name: "Pinnacle", rate: "20%", icon: "♛", promise: "Coordinate", cadence: "Bespoke", access: "Dedicated" },
  ];
  return (
    <main>
      <Hero
        eyebrow="Memberships"
        title="Structured wellness journeys, not random purchases."
        subtitle="Each MMS membership is designed around discovery, HRM coordination, professional review and suitability assessment."
        image="/mms-about-hero.webp"
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid overflow-hidden rounded-[2rem] bg-deep-green text-ivory shadow-premium md:grid-cols-[1.05fr_.95fr]"><div className="relative min-h-[360px]"><Image src="/mms-membership-journey.webp" alt="Four MMS membership journeys for changing life and health priorities" fill className="object-cover" sizes="50vw" /></div><div className="flex flex-col justify-center p-8 md:p-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Find your fit</p><h2 className="mt-4 font-serif text-4xl leading-tight">Four journeys. Different depths of support.</h2><p className="mt-4 text-ivory/70">Choose by your goals and desired level of coordination—not by a public price list.</p></div></div>
          <div className="mb-12 overflow-hidden rounded-[2rem] border border-gold/50 bg-[#06382f] text-ivory shadow-premium">
            <div className="border-b border-gold/35 px-6 py-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-gold-light">Member privilege ladder</p>
              <h2 className="mt-2 font-serif text-3xl">More continuity. More privilege.</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {levels.map((level, index) => <div key={level.name} className="relative border-gold/30 p-6 text-center sm:border-l first:border-l-0">
                <span className="mx-auto grid size-14 place-items-center rounded-full border border-gold/60 text-2xl text-gold-light">{level.icon}</span>
                <p className="mt-4 font-serif text-2xl">{level.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[.16em] text-ivory/60">{level.promise}</p>
                <p className="mt-5 font-serif text-5xl text-gold-light">{level.rate}</p>
                <p className="text-xs text-ivory/60">selected SCF privilege rate</p>
                {index < levels.length - 1 ? <span className="absolute -right-3 top-1/2 z-10 hidden size-6 place-items-center rounded-full bg-gold text-navy lg:grid">→</span> : null}
              </div>)}
            </div>
            <p className="border-t border-gold/30 px-6 py-4 text-center text-xs leading-5 text-ivory/60">Applies to selected eligible SCF services. Final eligibility, exclusions and clinical suitability must be confirmed.</p>
          </div>

          <div className="mb-12 rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
            <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
              <div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold">See the difference</p><h2 className="mt-3 font-serif text-4xl text-navy">Four levels at a glance.</h2><p className="mt-3 text-warm-gray">Each level adds continuity—not simply more items.</p></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {levels.map((level,index)=><div key={level.name} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-ivory p-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-deep-green font-bold text-white">0{index+1}</span><div><p className="font-serif text-xl text-navy">{level.name}</p><p className="text-sm text-warm-gray">{level.access} · {level.cadence}</p></div></div>)}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {memberships.map((membership, index) => (
              <article key={membership.name} className="rounded-[1.5rem] border border-gold-light/40 bg-white p-7 shadow-soft">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">{membership.accessNote}</p><h2 className="mt-2 font-serif text-4xl text-navy">{membership.name}</h2></div><span className="grid size-12 place-items-center rounded-full bg-deep-green text-lg font-bold text-white">0{index + 1}</span></div>
                <p className="mt-3 text-lg font-semibold text-deep-green">{membership.tagline}</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2"><div><h3 className="text-xs font-bold uppercase tracking-[.14em] text-gold">Best suited for</h3><p className="mt-2 text-sm leading-6 text-warm-gray">{membership.whoItSuits}</p></div><div><h3 className="text-xs font-bold uppercase tracking-[.14em] text-gold">Coordination</h3><p className="mt-2 text-sm leading-6 text-warm-gray">{membership.coordination}</p></div></div>
                <h3 className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-gold">Your opening journey</h3><ul className="mt-3 grid gap-2 sm:grid-cols-2">{membership.firstThirtyDays.map(item => <li key={item} className="rounded-lg bg-ivory px-3 py-2 text-sm text-navy">✓ {item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-stone-200 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-deep-green text-white"><tr><th className="p-4">What changes</th>{memberships.map(m => <th key={m.name} className="p-4">{m.name}</th>)}</tr></thead><tbody>{[["SCF member privilege","5%","10%","15%","20%"],["Preventive baseline","Core","Expanded","Advanced","Bespoke"],["Ling continuity","Included","Continuous","Priority","Dedicated"],["Human coordination","Guided","Quarterly","Ongoing","Private"],["Appointment support","Standard","Structured","Priority","Dedicated"],["Regional access","On request","Included","Priority","Bespoke"],["Family / executive planning","—","—","Optional","Included"]].map((row,i)=><tr key={row[0]} className={i%2 ? "bg-ivory" : ""}>{row.map((cell,j)=><td key={cell+j} className={`border-t border-stone-100 p-4 ${j===0 ? "font-semibold text-navy" : ""}`}>{cell}</td>)}</tr>)}</tbody></table></div>
          <p className="mt-4 text-center text-sm text-warm-gray">Pricing is discussed privately after discovery and suitability review.</p>
          <div className="mt-8">
            <DisclaimerBox>
              <p>
                Membership does not promise specific outcomes. Any wellness pathway is subject to discovery discussion, professional review and suitability assessment.
              </p>
            </DisclaimerBox>
          </div>
        </div>
      </section>
    </main>
  );
}
