import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { CTASection, EditorialSplit, JourneyStepRail, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex, PrincipleRow } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";

export type EditorialPoint = { title: string; text: string };
export type PatientEditorialPageProps = {
  eyebrow: string; title: string; lead: string; image?: string; imageAlt?: string;
  primaryLabel?: string; primaryHref?: string; secondaryLabel?: string; secondaryHref?: string;
  introEyebrow: string; introTitle: string; introLead: string; points: EditorialPoint[];
  trustTitle: string; trustLead: string; trustImage?: string; finalTitle?: string; finalLead?: string;
};

export function metadataFor(title: string, description: string): Metadata { return { title, description }; }

export function PatientEditorialPage({
  eyebrow, title, lead, image = "/mms-about-hero.png", imageAlt = "Doctor-led private healthcare consultation.",
  primaryLabel = "Start with discovery", primaryHref = "/contact", secondaryLabel = "Ask Ling", secondaryHref = "/ling",
  introEyebrow, introTitle, introLead, points, trustTitle, trustLead,
  trustImage = "/mms-health-screening-hero.png", finalTitle, finalLead,
}: PatientEditorialPageProps) {
  return (
    <main>
      <PublicHero eyebrow={eyebrow} title={title} brandLine="Understand first. Personalise carefully." lead={lead} image={image} imageAlt={imageAlt} primaryLabel={primaryLabel} primaryHref={primaryHref} secondaryLabel={secondaryLabel} secondaryHref={secondaryHref} />
      <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <div><SectionHeading eyebrow={introEyebrow} title={introTitle} lead={introLead} /><div className="mt-9"><ClinicalBoundary>General education can help you prepare. It cannot determine a diagnosis, treatment or personal suitability.</ClinicalBoundary></div></div>
        <EditorialIndex items={points.map((point) => ({ ...point, eyebrow: "What MMS may explore" }))} />
      </div></PublicSectionShell>
      <EditorialSplit eyebrow="Professional review" title={trustTitle} lead={trustLead} image={trustImage} imageAlt="Physician reviewing health information before a personalised recommendation." dark reverse>
        <JourneyStepRail dark steps={[
          { title: "Understand", text: "Clarify the question and relevant context." },
          { title: "Assess", text: "Choose investigations for a reason." },
          { title: "Review", text: "Interpret findings with a qualified professional." },
          { title: "Plan", text: "Agree a practical and proportionate next step." },
          { title: "Follow", text: "Monitor what matters over time." },
        ]} />
      </EditorialSplit>
      <PublicSectionShell tone="stone"><SectionHeading eyebrow="A considered pathway" title="The goal is clarity, not more interventions." lead="MMS connects education, screening and medical judgement so that the next action can be simpler, safer and more relevant." /><div className="mt-12"><PrincipleRow items={[
        { title: "Education first", text: "Understand the health question and the limits of general information." },
        { title: "Physician-guided", text: "Personal recommendations belong inside a professional relationship." },
        { title: "Continuity", text: "Follow-up keeps decisions connected instead of fragmented." },
      ]} /></div><div className="mt-9"><ButtonLink href="/contact">Discuss Your Health Goals</ButtonLink></div></PublicSectionShell>
      <CTASection title={finalTitle} lead={finalLead} />
    </main>
  );
}
