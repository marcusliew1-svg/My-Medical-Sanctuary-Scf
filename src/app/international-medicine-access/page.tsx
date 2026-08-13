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

      <Section eyebrow="Synthetic product examples" title="What a patient could understand at a glance." lead="Example figures below are fictional and demonstrate the comparison model only.">
        <div className="grid gap-5 md:grid-cols-3">{[
          ["CardioCare 10 mg","30 tablets","RM 118","THB 640","≈ RM 82"],
          ["MetaBalance 500 mg","60 tablets","RM 96","THB 490","≈ RM 63"],
          ["BoneSupport 70 mg","4 tablets","RM 164","THB 980","≈ RM 126"],
        ].map(([name,pack,my,th,converted])=><article key={name} className="overflow-hidden rounded-2xl border border-gold-light/40 bg-white shadow-soft"><div className="bg-deep-green p-5 text-white"><p className="text-xs uppercase tracking-[.16em] text-gold-light">Synthetic example</p><h3 className="mt-2 font-serif text-2xl">{name}</h3><p className="text-sm text-white/65">{pack}</p></div><div className="grid grid-cols-2 gap-px bg-stone-100"><div className="bg-white p-4"><p className="text-xs text-warm-gray">Malaysia</p><p className="mt-1 text-xl font-bold text-navy">{my}</p></div><div className="bg-[#dce8e1] p-4"><p className="text-xs text-warm-gray">Thailand</p><p className="mt-1 text-xl font-bold text-deep-green">{th}</p><p className="text-xs text-warm-gray">{converted}</p></div></div><p className="p-4 text-xs leading-5 text-warm-gray">Professional clearance, current availability and total fulfilment cost still required.</p></article>)}</div>
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
