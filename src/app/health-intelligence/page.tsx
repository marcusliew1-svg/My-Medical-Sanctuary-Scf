import type { Metadata } from "next";
import { CTASection, EditorialSplit, JourneyStepRail, PublicHero, SectionHeading, TrustBar } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex, PrincipleRow } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";

export const metadata: Metadata = { title: "Health Intelligence", description: "Evidence-aware preventive health, treatment and medicine intelligence for better-informed conversations with qualified professionals." };

const intelligence = [
  { title: "Medicine Price Intelligence", eyebrow: "Verified observations", text: "See the exact product, pack, market, source date and uncertainty behind a published comparison.", href: "/health-intelligence/medicine-prices" },
  { title: "Generic Medicine Finder", eyebrow: "Identity before equivalence", text: "Explore potential medicine relationships without treating a name match as permission to substitute.", href: "/health-intelligence/generic-medicines" },
  { title: "Medication Cost Review", eyebrow: "Professional context", text: "Frame current medicine use and cost before asking MMS to review possible next questions.", href: "/health-intelligence/medication-cost-review" },
  { title: "Regional Care Intelligence", eyebrow: "Systems and continuity", text: "Understand how care pathways, rules and practical coordination can differ across borders.", href: "/malaysia-thailand-care" },
];

export default function HealthIntelligencePage() {
  return (
    <main>
      <PublicHero eyebrow="Health Intelligence" title="Better health decisions begin with better understanding." brandLine="Healthcare is global. Prices aren't." lead="MMS brings evidence, source context and professional boundaries into the questions patients already ask about prevention, treatments, medicine cost and regional care." image="/mms-medicine-intelligence.webp" imageAlt="MMS medicine and health intelligence editorial visual." primaryLabel="Explore Medicine Prices" primaryHref="/health-intelligence/medicine-prices" secondaryLabel="Request Professional Review" secondaryHref="/contact" tone="intelligence" imagePosition="58% center" />
      <TrustBar items={[
        { title: "Source-visible", text: "Dates and provenance stay close to observations." },
        { title: "Identity-first", text: "Product details are confirmed before comparison." },
        { title: "Uncertainty-aware", text: "Missing or incomparable evidence remains visible." },
        { title: "No self-switching", text: "Medicine changes require professional review." },
        { title: "Jurisdiction-aware", text: "Access and rules differ between markets." },
        { title: "Privacy-led", text: "Patient-specific workflows belong in secure access." },
      ]} />
      <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr]"><div><SectionHeading eyebrow="Four ways to understand more" title="Intelligence should clarify the next question." lead="In development: the public experience helps people learn. Personalised interpretation, saved records and medicine decisions require authenticated access and qualified review." /><div className="mt-9"><ClinicalBoundary><strong>Price is not the same as access.</strong> No fabricated prices are presented as current market facts. A lower observed price does not establish lawful availability, clinical suitability, product equivalence or permission to import.</ClinicalBoundary></div></div><EditorialIndex items={intelligence} /></div></PublicSectionShell>
      <EditorialSplit eyebrow="Medicine Price Intelligence" title="The same medicine can sit inside very different systems." lead="Insurance, subsidies, registration, dispensing rules, supply and pack configuration can all change what a patient sees. MMS presents verified observations as context, never as a savings promise." image="/mms-medicine-access-consult.png" imageAlt="Professional discussion about medicine cost and lawful access." dark reverse><JourneyStepRail dark steps={[
        { title: "Identify", text: "Confirm brand, ingredient, strength, form and pack." },
        { title: "Compare", text: "Use compatible observations and show their dates." },
        { title: "Question", text: "Understand why the difference may exist." },
        { title: "Review", text: "Ask a professional what is lawful and suitable." },
      ]} /></EditorialSplit>
      <PublicSectionShell tone="stone"><SectionHeading eyebrow="Responsible intelligence" title="Better information should make decisions safer, not faster." lead="MMS does not encourage medicine shopping, self-substitution or unsupervised changes." /><div className="mt-12"><PrincipleRow items={[
        { title: "Exact product", text: "Names alone are not enough; strength, form, route and pack matter." },
        { title: "Qualified review", text: "Prescribing and dispensing remain licensed professional decisions." },
        { title: "Continuity", text: "Cost questions should remain connected to diagnosis, monitoring and follow-up." },
      ]} /></div></PublicSectionShell>
      <CTASection title="Bring us the medicine question you are trying to answer." lead="Explore public reference information, then request professional review before making any change." />
    </main>
  );
}
