import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CTASection, EditorialSplit, JourneyStepRail, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";
import { healthConcerns } from "@/data/healthConcerns";
import { expandedHealthConcerns } from "@/data/healthConcernsExpanded";
import { extraHealthConcerns } from "@/data/healthConcernsExtra";

const indexHealthEducation = (process.env.MMS_HEALTH_EDUCATION_INDEXABLE ?? "false").toLowerCase() === "true";
const allConcerns = [...healthConcerns, ...extraHealthConcerns, ...expandedHealthConcerns];
const aliases: Record<string, string> = { "menopause-perimenopause-symptoms": "menopause-hot-flushes-hormone-changes" };
const treatmentSlugs: Record<string, string> = {
  "IV wellness / NAD+": "nad-plus", "IV wellness & antioxidant support": "iv-wellness-antioxidant-support", PRP: "prp", PRGF: "prgf",
  "Red-light / photobiomodulation": "red-light-photobiomodulation", "MSC / stem-cell products": "msc-stem-cell-pathways", "Exosome-related services": "exosome-services",
  "Hormone review": "hormone-therapy", "Structured metabolic programme": "medical-weight-management", "GLP-1 / incretin medicines": "medical-weight-management",
  "Medical weight management": "medical-weight-management", Peptides: "peptides", MCED: "mced", "CAR-T": "car-t", "NK-cell therapy": "nk-cell-therapy",
  "Hyperbaric oxygen": "hyperbaric-oxygen", "ECG & cardiovascular risk review": "ecg-cardiovascular-risk-review", "Health screening": "health-screening-ultrasound",
  "Gut health & microbiome support": "gut-health-microbiome-support", "Colon cleansing / colonic irrigation": "colon-cleansing",
};
const resolveSlug = (slug: string) => aliases[slug] ?? slug;
const getConcern = (slug: string) => allConcerns.find((item) => item.slug === resolveSlug(slug));

export function generateStaticParams() { return allConcerns.map((item) => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const concern = getConcern((await params).slug);
  return concern ? { title: concern.searchTitle, description: concern.intro, keywords: concern.seoTerms, robots: { index: indexHealthEducation, follow: indexHealthEducation } } : {};
}

export default async function HealthConcernDetailPage({ params }: Props) {
  const { slug } = await params;
  if (resolveSlug(slug) !== slug) redirect(`/health-concerns/${resolveSlug(slug)}`);
  const concern = getConcern(slug);
  if (!concern) notFound();

  return (
    <main>
      <PublicHero eyebrow="Your health" title={concern.title} brandLine="Understand the question before considering the pathway." lead={concern.intro} image="/mms-doctor-couple-consult.png" imageAlt="Physician listening to a patient describe a health concern." primaryLabel="Book Assessment" primaryHref="/contact" secondaryLabel="All Health Guides" secondaryHref="/health-concerns" />
      <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <div><SectionHeading eyebrow="In plain English" title="What this concern can mean." lead={concern.layman} /><div className="mt-8"><ClinicalBoundary>A symptom can have several causes. This guide cannot identify which explanation applies to you.</ClinicalBoundary></div></div>
        <div><p className="editorial-kicker mb-5 text-deep-green">What MMS may assess</p><EditorialIndex items={concern.firstChecks.map((text) => ({ title: text, text: "The relevance and timing of this check depend on history, examination and professional judgement." }))} /></div>
      </div></PublicSectionShell>
      <PublicSectionShell tone="stone"><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <SectionHeading eyebrow="When review matters" title="Some changes should not wait." lead="Seek timely medical attention when symptoms are severe, rapidly changing or accompanied by warning signs." />
        <div className="border-t border-[#9b5f4e]/40">{concern.redFlags.map((item, index) => <div key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[#9b5f4e]/25 py-5"><span className="font-serif text-2xl text-[#8a5140]">{String(index + 1).padStart(2, "0")}</span><p className="pt-1 leading-7 text-navy">{item}</p></div>)}</div>
      </div></PublicSectionShell>
      <EditorialSplit eyebrow="From concern to context" title="Assessment should narrow the question before treatment expands the answer." lead="A qualified professional can connect symptoms with medical history, current medicines, relevant testing and personal risk." image="/mms-doctor-results-review.png" imageAlt="Doctor explaining assessment findings to a patient." dark reverse>
        <JourneyStepRail dark steps={[
          { title: "Listen", text: "Understand the pattern and its effect on daily life." },
          { title: "Assess", text: "Investigate likely causes and important risks." },
          { title: "Review", text: "Interpret the whole picture, not one result." },
          { title: "Plan", text: "Choose a proportionate next step and follow-up." },
        ]} />
      </EditorialSplit>
      <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr]">
        <div><SectionHeading eyebrow="Possible pathways" title="Evidence and suitability are not the same for every option." lead="These topics are for research and consultation preparation. Their presence here is not a recommendation." /></div>
        <EditorialIndex items={concern.relatedTopics.map((topic) => ({ eyebrow: topic.evidence, title: topic.label, text: topic.note, href: treatmentSlugs[topic.label] ? `/treatments/${treatmentSlugs[topic.label]}` : topic.href }))} />
      </div><div className="mt-10"><Link href="/health-concerns" className="text-sm font-semibold text-deep-green">Return to all health guides →</Link></div></PublicSectionShell>
      <CTASection title="Bring the concern. Leave with a clearer next step." lead="MMS can organise the conversation; a qualified professional decides what assessment or care is appropriate." />
    </main>
  );
}
