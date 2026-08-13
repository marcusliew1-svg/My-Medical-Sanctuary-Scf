import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { medicineAccessFactors } from "@/data/platformModules";
import { CapabilityStatus } from "@/components/CapabilityStatus";
import Image from "next/image";

export const metadata: Metadata = {
  title: "International Medicine Access Intelligence | My Medical Sanctuary",
  description:
    "Understand why medicine availability and costs can differ between countries, with MMS positioned as an education and coordination layer.",
};

const pathway = [
  "Understand the medicine question",
  "Identify country and access considerations",
  "Review professional and regulatory boundaries",
  "Coordinate next steps with appropriate licensed parties where suitable",
];

export default function InternationalMedicineAccessPage() {
  const markets = [
    { country: "Thailand", flag: "TH", amount: "RM 82", index: 69, tone: "bg-[#dce8e1]", note: "Lowest in this example" },
    { country: "Malaysia", flag: "MY", amount: "RM 118", index: 100, tone: "bg-white", note: "Reference market" },
    { country: "Singapore", flag: "SG", amount: "RM 206", index: 175, tone: "bg-[#efe3dc]", note: "Higher retail context" },
    { country: "UAE", flag: "AE", amount: "RM 268", index: 227, tone: "bg-[#e6dfcf]", note: "Illustrative Middle East" },
    { country: "United States", flag: "US", amount: "RM 342", index: 290, tone: "bg-[#d9dde2]", note: "Illustrative cash price" },
  ];
  return (
    <main>
      <PageHero
        eyebrow="International Medicine Access Intelligence"
        title="See where medicine costs differ—and why."
        lead="MMS compares like-for-like products before licensed professional review."
        primaryLabel="Request Discussion"
      />

      <section className="bg-ivory px-4 py-16"><div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-gold-light/40 bg-white shadow-premium md:grid-cols-2"><div className="relative min-h-[360px]"><Image src="/mms-medicine-intelligence.webp" alt="Illustrative cross-market medicine intelligence comparison" fill className="object-cover" sizes="50vw" /></div><div className="flex flex-col justify-center p-8 md:p-12"><CapabilityStatus status="pilot"/><h2 className="mt-5 font-serif text-4xl leading-tight text-navy">Compare the exact product—not just the brand name.</h2><div className="mt-6 grid grid-cols-2 gap-3">{["Molecule","Strength","Pack size","Registration"].map(item=><div key={item} className="rounded-xl bg-ivory p-3 text-sm font-semibold text-deep-green">✓ {item}</div>)}</div></div></div></section>

      <Section
        eyebrow="Why It Matters"
        title="The same medicine can sit inside different systems."
        lead="Availability, cost, timing and access pathways may vary across countries because healthcare systems, registration rules and supply structures are not identical."
      >
        <div className="mb-6"><CapabilityStatus status="pilot" /></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {medicineAccessFactors.map((factor) => (
            <article key={factor} className="rounded-lg border border-stone-200 bg-white p-6">
              <h2 className="font-serif text-2xl text-navy">{factor}</h2>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Illustrative comparison" title="Same molecule. Different market context." lead="A structured comparison exposes genuine differences without bypassing clinical or regulatory controls." className="bg-warm-white">
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-soft"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-deep-green text-white"><tr><th className="p-4">Verified factor</th><th className="p-4">Malaysia</th><th className="p-4">Thailand</th></tr></thead><tbody>{[["Active molecule","Same","Same"],["Strength & form","Matched","Matched"],["Registration","Verify","Verify"],["Indicative market cost","May differ","May differ"],["Licensed supply","Required","Required"],["Doctor / pharmacist clearance","Required","Required"]].map((row,i)=><tr key={row[0]} className={i%2 ? "bg-ivory" : ""}>{row.map(cell=><td key={cell} className="border-t border-stone-100 p-4">{cell}</td>)}</tr>)}</tbody></table></div>
        <p className="mt-4 text-xs text-warm-gray">Illustrative framework only. No medicine, price or availability is represented as current.</p>
      </Section>

      <Section eyebrow="Five-market price lens" title="One product. Five market contexts." lead="A visual example of how the same matched pack could differ across Thailand, Malaysia, Singapore, the UAE and the United States.">
        <div className="overflow-hidden rounded-[2rem] border border-gold-light/40 bg-white shadow-premium">
          <div className="grid gap-6 bg-deep-green p-6 text-ivory md:grid-cols-[1fr_auto] md:items-end md:p-8">
            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Synthetic matched product</p><h2 className="mt-2 font-serif text-3xl">CardioCare 10 mg · 30 tablets</h2><p className="mt-2 text-sm text-ivory/65">Same molecule · strength · form · pack size</p></div>
            <div className="rounded-2xl border border-gold/40 bg-white/5 px-5 py-3 text-center"><p className="text-xs uppercase tracking-[.12em] text-ivory/60">Observed range</p><p className="mt-1 font-serif text-3xl text-gold-light">4.2×</p></div>
          </div>
          <div className="grid lg:grid-cols-5">
            {markets.map((market,index)=><div key={market.country} className={`relative border-stone-200 p-5 lg:border-l first:border-l-0 ${market.tone}`}>
              <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-full bg-navy text-xs font-bold text-white">{market.flag}</span><span className="text-xs text-warm-gray">#{index+1}</span></div>
              <p className="mt-5 text-sm font-semibold text-warm-gray">{market.country}</p><p className="mt-1 font-serif text-3xl text-navy">{market.amount}</p>
              <div className="mt-5 h-24 rounded-full bg-stone-200/80 p-1"><div className="w-full rounded-full bg-gradient-to-t from-deep-green to-gold" style={{height: `${Math.max(25, market.index/3)}%`, marginTop: `${100-Math.max(25, market.index/3)}%`}} /></div>
              <p className="mt-3 text-xs leading-5 text-warm-gray">{market.note}</p>
            </div>)}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">{[["01","Match product"],["02","Convert currency"],["03","Verify licensed supply"],["04","Add fulfilment costs"]].map(([number,label])=><div key={number} className="flex items-center gap-3 rounded-xl bg-ivory p-4"><span className="grid size-9 place-items-center rounded-full bg-deep-green text-xs font-bold text-white">{number}</span><p className="text-sm font-semibold text-navy">{label}</p></div>)}</div>
        <p className="mt-4 text-xs leading-5 text-warm-gray">All figures are fictional design examples, converted to RM for readability. They are not current quotations. Real comparisons require a named medicine, manufacturer, strength, pack, date, licensed source and total fulfilment cost.</p>
      </Section>

      <Section
        eyebrow="MMS Role"
        title="A coordination and education layer, not a public medicine shop."
        lead="The website should explain how MMS can help people ask better questions while respecting medical, pharmacy and jurisdictional requirements."
        className="bg-warm-white"
      >
        <div className="grid gap-5 md:grid-cols-4">
          {pathway.map((item, index) => (
            <article key={item} className="rounded-lg border border-gold-light bg-ivory p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">
                Step {index + 1}
              </p>
              <h2 className="mt-3 font-serif text-2xl text-navy">{item}</h2>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Important Boundary"
        title="Access discussions require professional and jurisdictional review."
        lead="MMS should not collect prescriptions or sensitive medical records through this public page at this stage."
      >
        <DisclaimerBox title="Medicine access boundary">
          <p>
            Information on this page is educational and coordination-focused. MMS does not
            provide diagnosis, prescribing, dosage recommendations, dispensing services or
            promises of medicine availability through this website. Any medicine-related
            pathway must follow applicable laws and involve appropriate licensed professionals.
          </p>
        </DisclaimerBox>
      </Section>

      <section className="bg-navy px-4 py-20 text-ivory">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-6xl">Start with a clear access question.</h2>
          <p className="mt-5 text-lg leading-8 text-ivory/72">
            MMS can help route the discussion before any professional or licensed-party next step.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTAButton href="/contact">Request Discussion</CTAButton>
            <CTAButton href="/ling" variant="outline">Ask Ling</CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
