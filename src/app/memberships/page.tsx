import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "Explore MMS memberships including Ascend, Evolve, Eterna and Pinnacle for structured wellness coordination.",
};

export default function MembershipsPage() {
  return (
    <main>
      <Hero
        eyebrow="Memberships"
        title="Structured wellness journeys, not random purchases."
        subtitle="Each MMS membership is designed around discovery, HRM coordination, professional review and suitability assessment."
        image="/mms-about-hero.png"
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Membership Tiers"
            title="Ascend, Evolve, Eterna and Pinnacle."
            description="Membership pathways are discussed after discovery, professional review and suitability assessment."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {memberships.map((membership, index) => (
              <article key={membership.name} className="rounded-[1.5rem] border border-gold-light/40 bg-white p-7 shadow-soft">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">{membership.accessNote}</p><h2 className="mt-2 font-serif text-4xl text-navy">{membership.name}</h2></div><span className="rounded-full bg-deep-green px-3 py-1 text-xs font-bold text-white">Level {index + 1}</span></div>
                <p className="mt-3 text-lg font-semibold text-deep-green">{membership.tagline}</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2"><div><h3 className="text-xs font-bold uppercase tracking-[.14em] text-gold">Best suited for</h3><p className="mt-2 text-sm leading-6 text-warm-gray">{membership.whoItSuits}</p></div><div><h3 className="text-xs font-bold uppercase tracking-[.14em] text-gold">Coordination</h3><p className="mt-2 text-sm leading-6 text-warm-gray">{membership.coordination}</p></div></div>
                <h3 className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-gold">Your opening journey</h3><ul className="mt-3 grid gap-2 sm:grid-cols-2">{membership.firstThirtyDays.map(item => <li key={item} className="rounded-lg bg-ivory px-3 py-2 text-sm text-navy">✓ {item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-stone-200 bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-deep-green text-white"><tr><th className="p-4">Experience</th>{memberships.map(m => <th key={m.name} className="p-4">{m.name}</th>)}</tr></thead><tbody>{[["Preventive baseline","Core","Expanded","Advanced","Bespoke"],["Ling continuity","Included","Included","Priority","Dedicated"],["Care coordination","Guided","Structured","Priority","Private"],["Regional access support","On request","Included","Priority","Bespoke"]].map((row,i)=><tr key={row[0]} className={i%2 ? "bg-ivory" : ""}>{row.map(cell=><td key={cell} className="border-t border-stone-100 p-4">{cell}</td>)}</tr>)}</tbody></table></div>
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
