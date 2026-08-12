import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { medicineAccessFactors } from "@/data/platformModules";

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
        title="Medicine access can differ by country. Understanding comes first."
        lead="MMS helps patients and families frame access questions clearly before professional review and appropriate licensed coordination."
        primaryLabel="Request Discussion"
      />

      <Section
        eyebrow="Why It Matters"
        title="The same medicine can sit inside different systems."
        lead="Availability, cost, timing and access pathways may vary across countries because healthcare systems, registration rules and supply structures are not identical."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {medicineAccessFactors.map((factor) => (
            <article key={factor} className="rounded-lg border border-stone-200 bg-white p-6">
              <h2 className="font-serif text-2xl text-navy">{factor}</h2>
            </article>
          ))}
        </div>
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
