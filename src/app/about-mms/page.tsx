import type { Metadata } from "next";
import { CTASection, EditorialSplit, PublicHero, SectionHeading, TrustBar } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex, ImagePair, PrincipleRow } from "@/components/PublicEditorialModules";

export const metadata: Metadata = {
  title: "About MMS",
  description: "Why My Medical Sanctuary exists: preventive healthcare, personalised longevity, medical responsibility and continuity.",
};

const principles = [
  { title: "Prevention first", text: "Identify patterns and risks earlier, while there is still time to understand and plan." },
  { title: "Personalised longevity", text: "Shape priorities around the individual, their evidence, goals and professional review." },
  { title: "Education before treatment", text: "Help every patient leave with clearer questions and a more informed next step." },
];

const governance = [
  { title: "Discover", eyebrow: "Listen", text: "Begin with the person's concerns, history and goals rather than a treatment menu." },
  { title: "Assess", eyebrow: "Measure", text: "Build an appropriate baseline and identify what may deserve further attention." },
  { title: "Review", eyebrow: "Judge", text: "Qualified professionals interpret findings, uncertainty and suitability in context." },
  { title: "Personalise", eyebrow: "Plan", text: "Recommendations follow review and remain proportionate to the evidence available." },
  { title: "Continue", eyebrow: "Support", text: "Coordination and follow-up help the health plan evolve rather than disappear after one visit." },
];

export default function AboutMMSPage() {
  return (
    <main>
      <PublicHero
        eyebrow="About MMS"
        title="A new standard for preventive healthcare."
        brandLine="Your lifelong health partner."
        lead="My Medical Sanctuary was created to help people move from reactive treatment towards earlier understanding, doctor-led planning and long-term continuity."
        image="/mms-about-hero.png"
        imageAlt="Doctor and patient in a private consultation."
        primaryLabel="Begin with Discovery"
        primaryHref="/contact"
        secondaryLabel="Our Approach"
        secondaryHref="/how-it-works"
      />

      <TrustBar items={[
        { title: "Earlier", text: "Understand before concerns become urgent." },
        { title: "Personal", text: "One person, one evolving health context." },
        { title: "Doctor-led", text: "Clinical judgement remains human." },
        { title: "Evidence-aware", text: "What is known and uncertain stays visible." },
        { title: "Private", text: "Discretion is part of the care experience." },
        { title: "Continuous", text: "Designed beyond a one-off visit." },
      ]} />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <ImagePair
            primary="/mms-doctor-couple-consult.png"
            secondary="/mms-diagnostics-screening.png"
            primaryAlt="Doctor listening during a preventive health consultation."
            secondaryAlt="Diagnostic screening reviewed in context."
          />
          <div>
            <SectionHeading
              eyebrow="Why we exist"
              title="Healthcare should be clearer, earlier and more personal."
              lead="Many people feel tired, sleep poorly, gain weight or worry about ageing without knowing where to begin. MMS brings assessment, education and professional review into one considered journey."
            />
            <div className="mt-10">
              <ClinicalBoundary>
                MMS is not a catalogue of ad-hoc products. Any personalised recommendation remains subject to professional review, suitability and the rules of the relevant jurisdiction.
              </ClinicalBoundary>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#06171d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Our philosophy"
            title="A calm relationship, built on clear principles."
            lead="Technology can improve preparation and coordination. It does not replace the responsibility, judgement or humanity of qualified professionals."
            dark
          />
          <div className="mt-12"><PrincipleRow items={principles} dark /></div>
        </div>
      </section>

      <EditorialSplit
        eyebrow="The MMS model"
        title="The order of care matters."
        lead="MMS begins by understanding the person. Screening and assessment inform review; review informs a proportionate plan; continuity keeps that plan useful over time."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor reviewing health findings with a patient."
        reverse
      >
        <EditorialIndex items={governance} />
      </EditorialSplit>

      <section id="medical-team" className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <SectionHeading
            eyebrow="Medical leadership"
            title="Trust begins with verifiable people and standards."
            lead="MMS will publish clinician profiles only after names, qualifications, registrations, roles and photography are approved for public use."
          />
          <EditorialIndex items={[
            { title: "Clinician profiles", eyebrow: "Pending verification", text: "Names and credentials will appear only after documented owner and professional approval." },
            { title: "Clinical leadership", eyebrow: "Pending approval", text: "The medical director statement and governance responsibilities require confirmed appointments." },
            { title: "Professional scope", eyebrow: "Required", text: "Each public profile must accurately describe registration, jurisdiction and scope of practice." },
            { title: "Team photography", eyebrow: "Asset required", text: "Approved, current photography will replace generic imagery when the verified team is ready to publish." },
          ]} />
        </div>
      </section>

      <CTASection title="A better health journey starts with understanding." />
    </main>
  );
}
