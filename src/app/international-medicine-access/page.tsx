import type { Metadata } from "next";
import { CTASection, EditorialSplit, JourneyStepRail, PublicHero, SectionHeading, TrustBar } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";
import { medicineAccessFactors } from "@/data/platformModules";

export const metadata: Metadata = { title: "International Medicine Access Intelligence", description: "Understand why medicine cost and lawful access differ between countries before requesting professional review." };
const markets = [
  { title: "United States", eyebrow: "Insurance and distribution", text: "Benefit design, negotiated pricing and brand supply can strongly influence what a patient pays." },
  { title: "Gulf markets", eyebrow: "Private access and registration", text: "Country registration, private-pay pathways and import structures vary across the region." },
  { title: "Australia", eyebrow: "Subsidy status", text: "Public subsidy and private prescription pathways can produce very different patient costs." },
  { title: "Singapore", eyebrow: "Private specialist market", text: "Provider setting, pharmacy supply and product registration influence price and availability." },
  { title: "Indonesia", eyebrow: "Distribution and city", text: "Registration, distributor coverage and local supply can vary substantially." },
  { title: "Malaysia and Thailand", eyebrow: "Regional context", text: "Some verified observations may differ, but lower price never establishes lawful or suitable access." },
];
export default function InternationalMedicineAccessPage() {
  return <main>
    <PublicHero eyebrow="Medicine Intelligence" title="The same medicine can live inside very different systems." brandLine="Healthcare is global. Prices aren’t." lead="MMS helps patients understand product identity, observed cost, country rules and access questions before any prescription, dispensing or travel decision." image="/mms-medicine-access-consult.png" imageAlt="Professional medicine access consultation." primaryLabel="Explore Verified Observations" primaryHref="/health-intelligence/medicine-prices" secondaryLabel="Request Professional Review" secondaryHref="/contact" tone="intelligence" />
    <TrustBar items={[
      { title: "Exact identity", text: "Strength, form, route and pack must match." }, { title: "Observed dates", text: "Prices are points in time, not promises." }, { title: "Source context", text: "Provenance and verification remain visible." }, { title: "No self-switching", text: "Generic questions require professional review." }, { title: "Country rules", text: "Registration and dispensing differ." }, { title: "No access promise", text: "Price does not establish availability." },
    ]} />
    <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.64fr_1.36fr]"><div><SectionHeading eyebrow="Global context" title="A visible price difference is the beginning of the question." lead="Patients may encounter dramatically different figures. A responsible comparison explains why before suggesting what to do next." /><div className="mt-9"><ClinicalBoundary><strong>Price is not the same as access.</strong> Lower cost does not mean a product may be lawfully purchased, imported, substituted or used by a particular patient.</ClinicalBoundary></div></div><EditorialIndex items={markets} /></div></PublicSectionShell>
    <EditorialSplit eyebrow="What shapes access" title="The price tag sits inside a larger system." lead="A professional review considers registration, prescription requirements, licensed dispensing, manufacturer supply, product identity and continuity." image="/mms-medicine-intelligence.webp" imageAlt="Editorial medicine intelligence visual." dark reverse><div className="border-t border-champagne/30">{medicineAccessFactors.map((factor) => <p key={factor} className="border-b border-champagne/20 py-4 text-sm leading-7 text-ivory/72">{factor}</p>)}</div></EditorialSplit>
    <PublicSectionShell tone="stone"><SectionHeading eyebrow="A responsible next step" title="From comparison to qualified review." lead="MMS can help organise the question without becoming an online pharmacy or providing import instructions." /><div className="mt-12"><JourneyStepRail steps={[
      { title: "Identify", text: "Confirm the exact medicine and current use." }, { title: "Compare", text: "Review compatible, dated observations." }, { title: "Check", text: "Understand jurisdiction and availability limits." }, { title: "Review", text: "Ask a licensed professional what is appropriate." },
    ]} /></div></PublicSectionShell>
    <CTASection title="Start with a clear medicine question." lead="Explore public reference information, then request professional review before making any change." />
  </main>;
}
