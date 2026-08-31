import type { Metadata } from "next";
import {
  CTASection,
  EditorialSplit,
  ImageFeature,
  JourneyStepRail,
  PublicHero,
  SectionHeading,
} from "@/components/PublicExperience";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "MMS memberships are structured levels of ongoing preventive health management, coordination and continuity after discovery and professional review.",
};

const tierImages = [
  "/mms-concierge-lounge.png",
  "/mms-doctor-results-review.png",
  "/mms-doctor-couple-consult.png",
  "/mms-diagnostics-screening.png",
];

const principles = [
  { title: "Discovery", text: "Membership starts after MMS understands context, goals and priorities." },
  { title: "Suitability", text: "The right depth depends on professional review and practical needs." },
  { title: "Continuity", text: "HRM coordination helps care feel organised beyond the first appointment." },
  { title: "Discretion", text: "Private health management should feel calm, respectful and clear." },
];

export default function MembershipsPage() {
  const items = memberships.map((membership, index) => ({
    title: membership.name,
    eyebrow: membership.accessNote,
    text: membership.tagline,
    detail: `${membership.coordination} First 30 days may include ${membership.firstThirtyDays.join(", ")}.`,
    image: tierImages[index],
  }));

  return (
    <main>
      <PublicHero
        eyebrow="Memberships"
        title="A continuum of care for every chapter of your life."
        brandLine="Ongoing health management, not a price list."
        lead="MMS memberships describe increasing depth of coordination after discovery, screening and professional review."
        image="/mms-membership-journey.webp"
        imageAlt="MMS membership journey visual."
        primaryLabel="Discuss Membership"
        primaryHref="/contact"
        secondaryLabel="How MMS Works"
        secondaryHref="/how-it-works"
        imagePosition="58% center"
        tone="soft"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <SectionHeading
            eyebrow="The relationship model"
            title="Choose depth after MMS understands the person."
            lead="Membership should signal continuity, coordination and memory. It should never feel like a pressured public checkout."
          />
          <ImageFeature items={items} />
        </div>
      </section>

      <EditorialSplit
        eyebrow="Membership logic"
        title="The right membership follows the right review."
        lead="Ascend, Evolve, Eterna and Pinnacle are not medical outcome promises. They are different levels of care coordination and ongoing health management."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor-led review before membership selection."
        dark
        reverse
      >
        <JourneyStepRail steps={principles} dark />
      </EditorialSplit>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Important boundary"
            title="No membership guarantees a health outcome."
            lead="Any clinical recommendation, advanced option or treatment decision remains subject to professional review, individual suitability and applicable medical standards."
          />
        </div>
      </section>

      <CTASection title="Start with discovery, then decide what depth of support fits." />
    </main>
  );
}
