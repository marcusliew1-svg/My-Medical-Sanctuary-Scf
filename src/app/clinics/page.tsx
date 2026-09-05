import type { Metadata } from "next";
import { CTASection, EditorialSplit, LocationFeature, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, PrincipleRow } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";
import { mmsLocations } from "@/data/locations";

export const metadata: Metadata = { title: "Locations", description: "The planned MMS network across Bangsar, SS2 and Johor, presented with clear status and distinct care purpose." };
export default function ClinicsPage() {
  return <main>
    <PublicHero eyebrow="Locations" title="One MMS. Different centres of expertise." brandLine="One standard of attention, expressed for different care needs." lead="MMS is developing a Malaysia-first network for preventive health, specialist continuity and future advanced capability. Every location below remains clearly labelled by status." image="/mms-concierge-lounge.png" imageAlt="A calm private healthcare environment representing the MMS location experience." primaryLabel="Discuss Your Care Needs" primaryHref="/contact" secondaryLabel="Regional Care" secondaryHref="/malaysia-thailand-care" tone="location" />
    <PublicSectionShell><SectionHeading eyebrow="The MMS network" title="Each centre has a distinct role." lead="A single visual identity should not flatten the differences between hospitality-led preventive care, specialist renal continuity and a future advanced medical hub." /><div className="mt-12"><LocationFeature locations={mmsLocations} /></div></PublicSectionShell>
    <EditorialSplit eyebrow="Truth before promotion" title="Location status is part of patient trust." lead="MMS will add addresses, operating details and verified services only after the necessary owner, clinical, operational and regulatory approvals." image="/mms-health-screening-hero.png" imageAlt="Clinical environment representing careful operational readiness." dark reverse><ClinicalBoundary>All three centres are currently presented as planned. This website does not represent them as open or accepting appointments at those locations.</ClinicalBoundary></EditorialSplit>
    <PublicSectionShell tone="stone"><SectionHeading eyebrow="One standard" title="Different environments. Consistent principles." lead="Wherever care happens, patients should experience clarity, privacy and professional responsibility." /><div className="mt-12"><PrincipleRow items={[
      { title: "Clear", text: "Know the purpose, status and next step before travelling." },
      { title: "Private", text: "Discretion and consent are part of every setting." },
      { title: "Connected", text: "Information and follow-up remain part of one MMS journey." },
    ]} /></div></PublicSectionShell>
    <CTASection title="Let the care need guide the setting." lead="Speak with MMS before making travel or appointment plans." />
  </main>;
}
