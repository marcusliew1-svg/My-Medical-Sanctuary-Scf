import type { Metadata } from "next";
import { CTASection, EditorialSplit, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex, PrincipleRow } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";
import { healthConcerns } from "@/data/healthConcerns";
import { expandedHealthConcerns } from "@/data/healthConcernsExpanded";
import { extraHealthConcerns } from "@/data/healthConcernsExtra";

const indexHealthEducation = (process.env.MMS_HEALTH_EDUCATION_INDEXABLE ?? "false").toLowerCase() === "true";
const allConcerns = [...healthConcerns, ...extraHealthConcerns, ...expandedHealthConcerns];

export const metadata: Metadata = {
  title: "Your Health | Patient-Led Health Guides",
  description: "Begin with your health concern, understand what may influence it and prepare for qualified medical review.",
  robots: { index: indexHealthEducation, follow: indexHealthEducation },
};

export default function HealthConcernsPage() {
  return (
    <main>
      <PublicHero eyebrow="Your health" title="Start with what you want to understand." brandLine="The concern comes before the treatment name." lead="Explore common health questions, learn what may deserve assessment and prepare for a more useful conversation with a qualified professional." image="/mms-health-screening-hero.png" imageAlt="Patient discussing preventive health questions with a physician." primaryLabel="Begin Health Discovery" primaryHref="/health-discovery" secondaryLabel="Book Consultation" secondaryHref="/contact" />
      <PublicSectionShell><div className="mx-auto max-w-5xl"><SectionHeading eyebrow="A safer place to begin" title="A symptom is a signal, not a diagnosis." lead="The same concern can have many explanations. Good care explores context, appropriate checks and warning signs before considering a pathway." /><div className="mt-12"><PrincipleRow items={[
        { title: "Understand", text: "Put the concern into plain language and identify what may influence it." },
        { title: "Assess", text: "Use history, examination and targeted investigations rather than indiscriminate testing." },
        { title: "Review", text: "A qualified professional decides what the findings mean for you." },
      ]} /></div></div></PublicSectionShell>
      <PublicSectionShell tone="stone"><div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr]">
        <div><SectionHeading eyebrow="Patient guides" title="Find the question closest to yours." lead="Each guide separates first checks, urgent warning signs and related topics by evidence level." /><div className="mt-8"><ClinicalBoundary>These guides provide general education only. They do not diagnose, prescribe or recommend that you undergo a treatment.</ClinicalBoundary></div></div>
        <EditorialIndex items={allConcerns.map((concern) => ({ title: concern.title, text: concern.intro, eyebrow: "Health guide", href: `/health-concerns/${concern.slug}` }))} />
      </div></PublicSectionShell>
      <EditorialSplit eyebrow="Medical review matters" title="Bring better questions, not a self-diagnosis." lead="Your symptoms, history, medicines, prior results and personal goals help a clinician decide what should be assessed and what can safely wait." image="/mms-doctor-results-review.png" imageAlt="Doctor and patient reviewing health information together." dark reverse />
      <CTASection title="Turn uncertainty into a qualified conversation." lead="Begin with the concern that matters to you and let professional review shape the next step." />
    </main>
  );
}
