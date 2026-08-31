import type { Metadata } from "next";
import {
  CTASection,
  EditorialSplit,
  JourneyStepRail,
  LocationFeature,
  PublicHero,
  SectionHeading,
} from "@/components/PublicExperience";
import { mmsLocations } from "@/data/locations";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "MMS location architecture across Bangsar, SS2 and Johor, presented with approved status boundaries and patient-first positioning.",
};

const networkPrinciples = [
  { title: "Status-led", text: "Each centre is labelled according to its approved current status." },
  { title: "Patient-led", text: "Locations are explained through the patient journey, not service hype." },
  { title: "Care-aware", text: "Clinical, wellness and future lab capabilities stay clearly distinguished." },
  { title: "Expandable", text: "The model can support Malaysia-first and ASEAN-ready growth." },
];

export default function ClinicsPage() {
  return (
    <main>
      <PublicHero
        eyebrow="Locations"
        title="One MMS. Three specialised centres."
        brandLine="A care network designed for clarity, privacy and continuity."
        lead="MMS presents each location according to approved status and purpose, so patients can understand the network without confusion."
        image="/mms-concierge-lounge.png"
        imageAlt="Private healthcare hospitality environment."
        primaryLabel="Speak with MMS"
        primaryHref="/contact"
        secondaryLabel="Regional Care"
        secondaryHref="/malaysia-thailand-care"
        imagePosition="48% center"
        tone="location"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="MMS network"
              title="Each centre has a role. Each role needs a clear boundary."
              lead="Release 1B uses structured status labels rather than hard-coded operational claims."
            />
          </div>
          <LocationFeature locations={mmsLocations} />
        </div>
      </section>

      <EditorialSplit
        eyebrow="Expansion discipline"
        title="A premium network earns trust by being precise about what exists today."
        lead="Future services, addresses and facility claims should be added only after owner, clinical, operational and regulatory approval."
        image="/mms-health-screening-hero.png"
        imageAlt="Clinical screening and health review environment."
        dark
        reverse
      >
        <JourneyStepRail steps={networkPrinciples} dark />
      </EditorialSplit>

      <CTASection title="Choose the right setting after the right first conversation." />
    </main>
  );
}
