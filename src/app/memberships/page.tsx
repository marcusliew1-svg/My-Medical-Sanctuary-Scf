import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel, SplitStory } from "@/components/Editorial";
import { CareTeamStrip, RevealCardGrid } from "@/components/ExperienceCards";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Memberships | My Medical Sanctuary",
  description:
    "Ascend, Evolve, Eterna and Pinnacle are MMS relationship pathways for preventive healthcare and personalised longevity coordination.",
};

const tierImages = [
  "/mms-concierge-lounge.png",
  "/mms-doctor-results-review.png",
  "/mms-doctor-couple-consult.png",
  "/mms-diagnostics-screening.png",
];

const tierDetails = [
  "Best for people who want a serious starting point: baseline screening, appointment guidance and a practical first roadmap.",
  "Designed for members who want closer follow-up around energy, weight, lifestyle, metabolic health and review preparation.",
  "Built for longer-horizon preventive planning where continuity, scheduling and repeated review matter more than one appointment.",
  "A discreet relationship model for highly coordinated care, subject to invitation, capacity and clinical suitability assessment.",
];

export default function MembershipsPage() {
  const cards = memberships.map((membership, index) => ({
    title: membership.name,
    eyebrow: membership.accessNote,
    text: membership.tagline,
    detail: `${tierDetails[index]} First 30 days may include: ${membership.firstThirtyDays.join(", ")}.`,
    image: tierImages[index],
  }));

  return (
    <main>
      <EditorialHero
        eyebrow="Programmes"
        title="A continuum of care for every chapter of your life."
        lead="MMS memberships describe increasing depth of coordination after discovery, screening and professional review. No public pricing pressure. No one-size-fits-all pathway."
        image="/mms-concierge-lounge.png"
        imageAlt="MMS concierge welcoming patients into the membership journey."
        primaryLabel="Discuss membership"
        secondaryLabel="How it works"
        secondaryHref="/how-it-works"
        imagePosition="58% center"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Membership philosophy</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Choose depth after MMS understands the person.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              Membership is not a public product shelf. It is a relationship structure that can
              support screening, doctor review, Health Relationship Manager coordination and long-term follow-up.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <ImagePanel priority src="/mms-doctor-couple-consult.png" alt="Doctor-led private consultation." className="min-h-[240px] rounded-[1.2rem] shadow-premium" objectPosition="50% center" />
            <ImagePanel priority src="/mms-concierge-lounge.png" alt="Premium patient concierge welcome." className="min-h-[240px] rounded-[1.2rem] shadow-premium" objectPosition="50% center" />
            <ImagePanel priority src="/mms-diagnostics-screening.png" alt="Preventive diagnostics." className="min-h-[240px] rounded-[1.2rem] shadow-premium" objectPosition="50% center" />
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker mb-4 text-gold-light">The continuum</p>
              <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
                Four depths. One standard of discretion.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ivory/66">
              Hover or focus each pathway to see what it is designed to clarify.
            </p>
          </div>
          <RevealCardGrid items={cards} />
        </div>
      </section>

      <SplitStory
        eyebrow="Suitability"
        title="No membership promises an outcome."
        lead="The right pathway depends on goals, baseline findings, doctor review and practical follow-through."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor-led review before programme decisions."
        reverse
      >
        <div className="grid gap-5 border-y border-gold/40 py-6">
          <p className="font-serif text-2xl leading-snug text-navy">
            Screening before recommendation.
          </p>
          <p className="font-serif text-2xl leading-snug text-navy">
            Suitability before programme selection.
          </p>
          <p className="font-serif text-2xl leading-snug text-navy">
            Continuity before one-off treatment decisions.
          </p>
        </div>
      </SplitStory>

      <CareTeamStrip
        image="/mms-concierge-lounge.png"
        eyebrow="Relationship model"
        title="Membership should feel like continuity, not a price list."
        text="The commercial value is in coordination, memory, privacy and follow-through after doctor review."
        points={["No public pricing", "Suitability review", "Long-term relationship"]}
      />

      <FinalInvitation title="Start with discovery, then decide what depth of support fits." />
    </main>
  );
}
