import type { Metadata } from "next";
import {
  CTASection,
  EditorialSplit,
  JourneyStepRail,
  PublicHero,
  SectionHeading,
  TrustBar,
} from "@/components/PublicExperience";

export const metadata: Metadata = {
  title: "About MMS",
  description:
    "Why My Medical Sanctuary exists: preventive healthcare, personalised longevity, medical responsibility and continuity.",
};

const values = [
  { title: "Earlier", text: "Understand risks and patterns before decisions become urgent." },
  { title: "Clearer", text: "Translate screening, symptoms and goals into better next questions." },
  { title: "Safer", text: "Keep recommendations inside professional review and suitability boundaries." },
  { title: "Longer", text: "Build continuity instead of one-off wellness purchases." },
];

export default function AboutMMSPage() {
  return (
    <main>
      <PublicHero
        eyebrow="About MMS"
        title="A private institution for the health journey before illness."
        brandLine="Your lifelong health partner."
        lead="MMS exists to move people from random health purchases into structured understanding, professional review and long-term continuity."
        image="/mms-about-hero.png"
        imageAlt="Doctor and patient in a private consultation."
        primaryLabel="Begin with Discovery"
        primaryHref="/contact"
        secondaryLabel="Our Approach"
        secondaryHref="/how-it-works"
      />

      <TrustBar
        items={[
          { title: "Institution first", text: "MMS is positioned as a healthcare platform, not a treatment catalogue." },
          { title: "Human-led", text: "Doctors and care teams remain central." },
          { title: "Education", text: "Patients should leave more informed." },
          { title: "Humility", text: "Uncertainty is named rather than hidden." },
          { title: "Integrity", text: "No outcome promises or casual claims." },
          { title: "Continuity", text: "The relationship extends beyond one visit." },
        ]}
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Why we exist"
            title="People should not have to wait for fear, symptoms or confusion before getting clarity."
            lead="MMS brings screening, doctor review, education, wellness programmes and care coordination into one quieter relationship."
          />
        </div>
      </section>

      <EditorialSplit
        eyebrow="How MMS thinks"
        title="Care should feel considered, not transactional."
        lead="Premium service matters, but the centre of gravity is medical responsibility: understand first, recommend later, follow up over time."
        image="/mms-health-screening-hero.png"
        imageAlt="Preventive health consultation with screening results."
        reverse
      >
        <JourneyStepRail steps={values} />
      </EditorialSplit>

      <section id="medical-team" className="bg-[#06171d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Medical leadership"
            title="Human medical judgement must remain visible."
            lead="Release 1B creates the medical-team shell, but verified doctor names, credentials, licences and photography still require owner approval before publication."
            dark
          />
          <div className="grid gap-6 md:grid-cols-2">
            {["Approved doctor profiles", "Medical director statement", "Credential review", "Team photography"].map((item) => (
              <p key={item} className="border-t border-champagne/35 pt-5 text-lg leading-8 text-ivory/72">{item} awaiting approved assets.</p>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="A better health journey starts with understanding." />
    </main>
  );
}
