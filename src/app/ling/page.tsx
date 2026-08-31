import type { Metadata } from "next";
import { CTASection, EditorialSplit, ImageFeature, PublicHero, SectionHeading } from "@/components/PublicExperience";
import { LingPanel } from "@/components/LingPanel";
import { lingDisclaimer, lingOptions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ling",
  description:
    "Ling is the MMS digital health guide for general education, question preparation and navigation toward doctor-led care.",
};

const roles = [
  {
    title: "Welcoming guide",
    eyebrow: "Begin",
    text: "Helps you name what brought you here.",
    detail: "Ling can turn a vague worry into a clearer first question for MMS.",
    image: "/ling-concierge.png",
  },
  {
    title: "Knowledge companion",
    eyebrow: "Learn",
    text: "Explains general health concepts plainly.",
    detail: "Ling can explain screening, longevity and medicine-access concepts without diagnosing.",
    image: "/ling-knowledge.png",
  },
  {
    title: "Concierge presence",
    eyebrow: "Prepare",
    text: "Helps organise questions for the care team.",
    detail: "Ling supports preparation; an MMS doctor remains responsible for personalised advice.",
    image: "/ling-mms-guide.png",
  },
  {
    title: "Regional care guide",
    eyebrow: "Navigate",
    text: "Frames international care and medicine-access questions.",
    detail: "Ling can explain why systems differ before professional review.",
    image: "/ling-regional.png",
  },
];

export default function LingPage() {
  return (
    <main>
      <PublicHero
        eyebrow="Ling"
        title="Better questions before better decisions."
        brandLine="MMS digital health guide."
        lead="Ling helps patients understand general concepts and prepare for doctor-led care. She is not a doctor and does not provide diagnosis or treatment."
        image="/ling-knowledge.png"
        imageAlt="Ling, MMS digital health guide."
        primaryLabel="Start with Ling"
        primaryHref="/ling"
        secondaryLabel="Speak with MMS"
        secondaryHref="/contact"
        imagePosition="52% center"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <SectionHeading
            eyebrow="What brings you here?"
            title="Ling helps you begin without needing the perfect words."
            lead="The public Ling experience remains an education and routing placeholder in Release 1B. Production AI is still disabled."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {lingOptions.slice(0, 6).map((option) => (
              <p key={option} className="border-t border-gold/35 pt-4 text-lg leading-7 text-charcoal">{option}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#06171d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="Role in the journey"
              title="One guide, different moments of support."
              lead="Ling appears where she improves orientation, not everywhere. The institution, clinicians and patient journey remain the centre."
              dark
            />
          </div>
          <ImageFeature items={roles} />
        </div>
      </section>

      <EditorialSplit
        eyebrow="Clear boundary"
        title="Ling is useful because the boundary is clear."
        lead={lingDisclaimer}
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor-led review remains central to MMS care."
        reverse
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-t border-gold/45 pt-5">
            <h3 className="font-serif text-3xl text-navy">Ling can</h3>
            <p className="mt-3 leading-7 text-warm-gray">Explain concepts, organise questions and prepare you for consultation.</p>
          </div>
          <div className="border-t border-gold/45 pt-5">
            <h3 className="font-serif text-3xl text-navy">Ling cannot</h3>
            <p className="mt-3 leading-7 text-warm-gray">Diagnose, prescribe, interpret personal results or replace an MMS doctor.</p>
          </div>
        </div>
      </EditorialSplit>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Release 1B placeholder"
            title="Try the educational routing shell."
            lead="This is not production AI. It shows how Ling can guide a visitor toward safer next steps."
          />
          <div className="mt-10">
            <LingPanel />
          </div>
        </div>
      </section>

      <CTASection title="Begin with a question. Continue with a qualified professional." />
    </main>
  );
}
