import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection, EditorialSplit, JourneyStepRail, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";
import { treatmentEducation } from "@/data/treatmentEducation";
import { treatmentEducationExtra } from "@/data/treatmentEducationExtra";

const indexMedicalEducation = (process.env.MMS_MEDICAL_EDUCATION_INDEXABLE ?? "false").toLowerCase() === "true";
const treatments = [...treatmentEducation, ...treatmentEducationExtra];
const getTreatment = (slug: string) => treatments.find((item) => item.slug === slug);
export function generateStaticParams() { return treatments.map((item) => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getTreatment((await params).slug);
  return item ? { title: `${item.name} explained`, description: item.summary, keywords: item.seoTerms, robots: { index: indexMedicalEducation, follow: indexMedicalEducation } } : {};
}

export default async function TreatmentPage({ params }: Props) {
  const item = getTreatment((await params).slug);
  if (!item) notFound();
  return (
    <main>
      <PublicHero eyebrow={item.eyebrow} title={item.name} brandLine={item.evidence} lead={item.summary} image="/mms-diagnostics-screening.png" imageAlt="Clinical setting representing professional assessment before treatment." primaryLabel="Book Assessment" primaryHref="/contact" secondaryLabel="Treatment Library" secondaryHref="/treatments/research" tone="intelligence" />
      <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]"><div><SectionHeading eyebrow="What it is" title="A plain-English explanation." lead={item.plainEnglish} /><div className="mt-9"><ClinicalBoundary>Understanding this option is not the same as being suitable for it. Professional assessment is required.</ClinicalBoundary></div></div><div><p className="editorial-kicker mb-5 text-deep-green">Why people ask about it</p><EditorialIndex items={item.whyPeopleAsk.map((text) => ({ title: text, text: "This goal should be discussed in the context of diagnosis, alternatives and realistic expectations." }))} /></div></div></PublicSectionShell>
      <EditorialSplit eyebrow="Evidence" title="What the evidence can and cannot say." lead={item.evidenceNote} image="/mms-doctor-results-review.png" imageAlt="Physician reviewing treatment evidence with a patient." dark reverse><div className="mt-8"><ClinicalBoundary><strong className="text-navy">Evidence classification:</strong> {item.evidence}. Evidence quality and regulatory status may vary by indication and jurisdiction.</ClinicalBoundary></div></EditorialSplit>
      <PublicSectionShell tone="stone"><div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr]"><SectionHeading eyebrow="A responsible pathway" title="From interest to an informed decision." lead="The precise sequence varies, but it should make the purpose, evidence, suitability and monitoring visible." /><JourneyStepRail steps={item.typicalJourney.map((text, index) => ({ title: ["Clarify", "Assess", "Review", "Monitor"][index] ?? `Step ${index + 1}`, text }))} /></div></PublicSectionShell>
      <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]"><SectionHeading eyebrow="Safety and suitability" title="Reasons to pause deserve prominence." lead="A qualified clinician should consider medical history, medicines, contraindications, alternatives and the exact product, procedure or device." /><div className="border-t border-[#9b5f4e]/40">{item.caution.map((text, index) => <div key={text} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[#9b5f4e]/25 py-5"><span className="font-serif text-2xl text-[#8a5140]">{String(index + 1).padStart(2, "0")}</span><p className="pt-1 text-sm leading-7 text-navy">{text}</p></div>)}</div></div></PublicSectionShell>
      <PublicSectionShell tone="midnight"><div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr]"><SectionHeading eyebrow="Prepare for review" title="Questions worth taking to a clinician." lead="Use these prompts to improve the consultation, not to make a treatment decision alone." dark /><EditorialIndex dark items={item.questions.map((question) => ({ title: question, text: "Ask how the answer changes the benefit-risk decision for your circumstances." }))} /></div></PublicSectionShell>
      {item.relatedConcerns.length ? <PublicSectionShell><SectionHeading eyebrow="Related pathways" title="Begin from the health concern." lead="These guides can help organise the question before treatment is considered." /><div className="mt-8 flex flex-wrap gap-3">{item.relatedConcerns.map((link) => <Link key={link.href} href={link.href} className="border-b border-bronze py-2 text-sm font-semibold text-deep-green">{link.label} →</Link>)}</div></PublicSectionShell> : null}
      <CTASection title="Understand the option. Decide with a professional." lead="Book an assessment to discuss purpose, evidence, alternatives and personal suitability." />
    </main>
  );
}
