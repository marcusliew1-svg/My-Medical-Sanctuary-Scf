import type { Metadata } from "next";
import { CTASection, EditorialSplit, JourneyStepRail, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex, ImagePair, PrincipleRow } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = { title: "Memberships", description: "MMS memberships are relationship levels for preventive health coordination and continuity after professional review." };
const meanings = ["Clarity", "Progress", "Continuity", "Confidence"];

export default function MembershipsPage() {
  return (
    <main>
      <PublicHero eyebrow="Programmes" title="A continuum of care for every chapter of life." brandLine="One relationship. Four levels of coordination." lead="MMS memberships begin after discovery and professional review. They are designed around the depth of support a person needs, not a public catalogue of inclusions." image="/mms-membership-journey.webp" imageAlt="A visual representation of an ongoing personalised health journey." primaryLabel="Discuss Membership" primaryHref="/contact" secondaryLabel="How MMS Works" secondaryHref="/how-it-works" tone="soft" imagePosition="58% center" />
      <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
        <div><SectionHeading eyebrow="Relationship levels" title="Choose depth only after MMS understands the person." lead="Each level increases the continuity and coordination around assessment, physician involvement and follow-up." /><div className="mt-8"><ClinicalBoundary>Membership is not a guarantee of treatment access or outcome. Clinical recommendations remain subject to suitability and professional review.</ClinicalBoundary></div></div>
        <EditorialIndex items={memberships.map((membership, index) => ({ eyebrow: meanings[index], title: membership.name, text: `${membership.whoItSuits} ${membership.coordination}` }))} />
      </div></PublicSectionShell>
      <PublicSectionShell tone="stone"><div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"><ImagePair primary="/mms-concierge-lounge.png" secondary="/mms-doctor-results-review.png" primaryAlt="Private concierge environment for continuity planning." secondaryAlt="Physician reviewing a health roadmap." /><div><SectionHeading eyebrow="What membership changes" title="The relationship remembers what comes next." lead="A Health Relationship Manager can help coordinate appointments, prepare reviews and keep agreed priorities visible while physicians retain responsibility for medical decisions." /><div className="mt-10"><PrincipleRow items={[
        { title: "Prepared", text: "Appointments begin with better organised context." },
        { title: "Connected", text: "Screening, review and follow-up belong to one journey." },
        { title: "Personal", text: "The depth of support reflects goals and suitability." },
      ]} /></div></div></div></PublicSectionShell>
      <EditorialSplit eyebrow="Your first 30 days" title="Start by building the right baseline." lead="The opening phase may include discovery, appropriate screening, professional review planning and a personalised roadmap. The exact sequence depends on the individual." image="/mms-doctor-couple-consult.png" imageAlt="Private discovery consultation for a new MMS member." dark reverse>
        <JourneyStepRail dark steps={[
          { title: "Discover", text: "Discuss goals, context and expectations." },
          { title: "Assess", text: "Identify appropriate screening and records." },
          { title: "Review", text: "Put findings into professional context." },
          { title: "Plan", text: "Agree priorities and a continuity rhythm." },
        ]} />
      </EditorialSplit>
      <CTASection title="Start with discovery. Choose the relationship later." lead="A private conversation can help determine whether membership is useful and what depth may fit." />
    </main>
  );
}
