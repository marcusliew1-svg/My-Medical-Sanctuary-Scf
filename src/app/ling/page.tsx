import type { Metadata } from "next";
import { CTASection, EditorialSplit, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { ClinicalBoundary, EditorialIndex, PrincipleRow } from "@/components/PublicEditorialModules";
import { LingPanel } from "@/components/LingPanel";
import { lingDisclaimer, lingOptions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ling",
  description: "Ling is the MMS digital health guide for general education, question preparation and navigation toward doctor-led care.",
};

const canDo = [
  { title: "Explain", text: "Describe general health, screening and medicine-access concepts in plain language." },
  { title: "Organise", text: "Help turn a collection of concerns into clearer questions and useful context." },
  { title: "Navigate", text: "Point visitors towards relevant MMS education or the appropriate enquiry pathway." },
  { title: "Prepare", text: "Help patients arrive at a consultation ready to have a better conversation." },
];

const cannotDo = [
  { title: "Diagnose or prescribe", text: "Ling cannot identify a condition, issue prescriptions or select treatment." },
  { title: "Determine suitability", text: "Only an appropriately qualified professional can assess individual suitability." },
  { title: "Direct medicine changes", text: "Ling cannot advise a patient to start, stop, switch or import a medicine." },
  { title: "Override judgement", text: "Ling never replaces a clinician, urgent care service or jurisdictional requirement." },
];

export default function LingPage() {
  return (
    <main>
      <PublicHero
        eyebrow="Meet Ling"
        title="You do not need to know where to begin."
        brandLine="A restrained concierge and education layer."
        lead="Ling helps organise questions, explain general concepts and guide visitors towards an appropriate next conversation. Personalised medical judgement remains with qualified professionals."
        image="/ling-knowledge.png"
        imageAlt="Ling, the MMS digital health guide, in a calm professional setting."
        primaryLabel="Ask Ling"
        primaryHref="#ask-ling"
        secondaryLabel="Speak with MMS"
        secondaryHref="/contact"
        imagePosition="52% 22%"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <SectionHeading
            eyebrow="Begin naturally"
            title="Start with what is on your mind."
            lead="Ling can help someone who has a clear goal and someone who only knows that something does not feel right."
          />
          <EditorialIndex items={lingOptions.slice(0, 6).map((option) => ({ title: option, text: "Use this as a starting point for education and appropriate routing, not a medical conclusion." }))} />
        </div>
      </section>

      <section className="bg-[#06171d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="A useful boundary"
            title="Helpful precisely because her role is limited."
            lead="Ling supports understanding before the consultation. She does not cross into individual clinical decision-making."
            dark
          />
          <div className="mt-12"><PrincipleRow items={canDo.slice(0, 3)} dark /></div>
          <div className="mt-8"><EditorialIndex items={[canDo[3], ...cannotDo]} dark /></div>
        </div>
      </section>

      <EditorialSplit
        eyebrow="Doctor-led care"
        title="Technology supports care. It does not replace doctors."
        lead={lingDisclaimer}
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor-led review remains central to MMS care."
        reverse
      >
        <ClinicalBoundary>
          If a question may indicate an urgent health concern, Ling should direct the person to appropriate urgent or emergency care rather than continue a routine wellness journey.
        </ClinicalBoundary>
      </EditorialSplit>

      <section id="ask-ling" className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Educational preview"
            title="Try the guided conversation."
            lead="This interface demonstrates education and routing only. Production AI remains disabled until it is separately governed, tested and approved."
          />
          <div className="mt-10"><LingPanel /></div>
        </div>
      </section>

      <CTASection title="Begin with a question. Continue with a qualified professional." />
    </main>
  );
}
