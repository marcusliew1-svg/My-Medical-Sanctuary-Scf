import type { Metadata } from "next";
import { CTASection, EditorialSplit, JourneyStepRail, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex, ImagePair } from "@/components/PublicEditorialModules";
import { PublicSectionShell } from "@/components/PublicVisualPrimitives";

export const metadata: Metadata = { title: "Malaysia Thailand Care", description: "Care coordination for international patients considering health journeys across Malaysia and Thailand." };
export default function MalaysiaThailandCarePage() {
  return <main>
    <PublicHero eyebrow="International patients" title="Your care can travel with you." brandLine="Coordination before, during and after a regional health journey." lead="MMS helps international patients organise questions, records, appointments and follow-up across Malaysia and Thailand without turning care travel into a package sale." image="/mms-medicine-access-consult.png" imageAlt="International patient and clinician discussing a coordinated regional care journey." primaryLabel="Discuss Regional Care" primaryHref="/contact" secondaryLabel="Ask Ling" secondaryHref="/ling" tone="location" />
    <PublicSectionShell><div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr]"><div><SectionHeading eyebrow="Who we help" title="Practical navigation for patients arriving from different systems." lead="Patients from Singapore, Indonesia, China, the Middle East and Australia may have different records, expectations, language needs and continuity questions." /><div className="mt-8"><ClinicalBoundary>MMS does not guarantee visas, appointment availability, medicine importation or treatment access. Suitability and jurisdictional requirements always apply.</ClinicalBoundary></div></div><EditorialIndex items={[
      { title: "Singapore", text: "Coordinate records, timing and follow-up for care considered across the border." },
      { title: "Indonesia", text: "Prepare practical questions, documentation and language preferences before travel." },
      { title: "China", text: "Clarify records, translation needs and what requires professional review in advance." },
      { title: "Middle East", text: "Support private, culturally attentive planning without making access promises." },
      { title: "Australia", text: "Organise the relationship between home-country care, regional review and return follow-up." },
    ]} /></div></PublicSectionShell>
    <PublicSectionShell tone="stone"><div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"><ImagePair primary="/mms-concierge-lounge.png" secondary="/mms-doctor-results-review.png" primaryAlt="Private arrival and coordination environment." secondaryAlt="Doctor reviewing an international patient's records." /><div><SectionHeading eyebrow="The practical journey" title="Travel should not break the continuity of care." lead="The purpose of coordination is to help every clinician and patient understand what happened before, what is planned now and what should happen after return." /><div className="mt-10"><JourneyStepRail steps={[
      { title: "Prepare", text: "Clarify goals, history, records and language needs." },
      { title: "Review", text: "Check suitability and practical requirements before travel." },
      { title: "Coordinate", text: "Organise appointments and communication around the patient." },
      { title: "Continue", text: "Return results and follow-up into one health plan." },
    ]} /></div></div></div></PublicSectionShell>
    <EditorialSplit eyebrow="Malaysia and Thailand" title="Two care systems. One patient story." lead="MMS can help frame preventive, specialist or recovery discussions across the region where appropriate, while licensed providers remain responsible for clinical decisions and availability." image="/mms-health-screening-hero.png" imageAlt="Physician-guided regional health review." dark reverse />
    <CTASection title="If care involves travel, clarity matters even more." lead="Begin with a private conversation before booking travel or making assumptions about availability." />
  </main>;
}
