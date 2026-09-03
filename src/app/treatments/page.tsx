import type { Metadata } from "next";
import { CTASection, EditorialSplit, JourneyStepRail, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex, ImagePair, PrincipleRow } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";

export const metadata: Metadata = { title: "Care & Treatments", description: "Treatment education organised around clinical purpose, evidence, uncertainty and professional suitability review." };

const areas = [
  { title: "Screening & Prevention", eyebrow: "Start here", text: "Build a useful health baseline and understand what deserves follow-up.", href: "/health-screening" },
  { title: "Longevity & Cellular Wellness", eyebrow: "Ageing well", text: "Explore vitality, resilience and advanced-care questions with evidence boundaries visible.", href: "/longevity-medicine" },
  { title: "Metabolic & Hormonal Health", eyebrow: "Clinical context", text: "Connect energy, weight, glucose and hormone symptoms to appropriate assessment.", href: "/weight-management" },
  { title: "Regenerative Medicine", eyebrow: "Advanced care", text: "Understand indication-specific evidence, uncertainty, product quality and regulation.", href: "/treatments/research" },
  { title: "Recovery & Performance", eyebrow: "Supportive care", text: "Consider sleep, stress, nutrition and recovery without overlooking medical causes.", href: "/health-concerns/poor-sleep-stress-recovery" },
  { title: "Medicine Access Intelligence", eyebrow: "Better information", text: "Learn why medicine cost and lawful access differ across countries.", href: "/international-medicine-access" },
];

export default function TreatmentsPage() {
  return (
    <main>
      <PublicHero eyebrow="Treatments" title="Advanced options. Considered individually." brandLine="Understanding before intervention." lead="MMS explains why a treatment may be discussed, what the evidence can support and why personal suitability must be assessed before any decision." image="/mms-doctor-results-review.png" imageAlt="Physician discussing treatment evidence and alternatives with a patient." primaryLabel="Book Assessment" primaryHref="/contact" secondaryLabel="Research Treatments" secondaryHref="/treatments/research" />
      <PublicSectionShell><div className="mx-auto max-w-5xl"><SectionHeading eyebrow="The MMS position" title="Advanced does not automatically mean better." lead="The right option depends on the health problem, credible evidence, alternatives, product or device quality, personal risk and the professional responsible for care." /><div className="mt-12"><PrincipleRow items={[
        { title: "Purpose", text: "Be clear about the problem the option is intended to address." },
        { title: "Evidence", text: "Separate established use from emerging or indication-specific research." },
        { title: "Suitability", text: "Balance potential benefit, uncertainty, alternatives and individual risk." },
      ]} /></div></div></PublicSectionShell>
      <PublicSectionShell tone="stone"><div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr]"><div><SectionHeading eyebrow="Care areas" title="Find the health purpose before the treatment name." lead="The strongest starting point is the question you want to answer, not a procedure you have already decided to pursue." /><div className="mt-8"><ClinicalBoundary>Information on this website is not a recommendation to undergo treatment. Availability and suitability vary.</ClinicalBoundary></div></div><EditorialIndex items={areas} /></div></PublicSectionShell>
      <EditorialSplit eyebrow="Physician-guided" title="No advanced-care decision should come straight from a webpage." lead="A responsible pathway moves from informed interest to assessment, evidence review, suitability and monitoring." image="/mms-diagnostics-screening.png" imageAlt="Clinical diagnostics used to support a treatment suitability review." dark reverse><JourneyStepRail dark steps={[
        { title: "Question", text: "Define the clinical or wellness goal." },
        { title: "Assess", text: "Understand health context and alternatives." },
        { title: "Review", text: "Discuss evidence, uncertainty and risk." },
        { title: "Decide", text: "Proceed only when professionally appropriate." },
        { title: "Monitor", text: "Agree follow-up and response measures." },
      ]} /></EditorialSplit>
      <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"><ImagePair primary="/mms-medicine-access-consult.png" secondary="/mms-health-screening-hero.png" primaryAlt="Patient discussing advanced-care questions with a physician." secondaryAlt="Preventive assessment environment." /><SectionHeading eyebrow="Evidence with humanity" title="Patients deserve both candour and care." lead="MMS aims to explain uncertainty without being dismissive, and possibility without overstatement. The result should be a better consultation, not a more persuasive sales page." /></div></PublicSectionShell>
      <CTASection title="Begin with the health question, not the product." lead="Book an assessment or explore the research library before discussing any advanced option." />
    </main>
  );
}
