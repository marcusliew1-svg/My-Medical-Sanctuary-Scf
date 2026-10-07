import type { Metadata } from "next";
import Image from "next/image";
import { EditorialHero, FinalInvitation, SplitStory } from "@/components/Editorial";
import { CareTeamStrip } from "@/components/ExperienceCards";
import { MembershipComparison } from "@/components/MembershipComparison";
import { ContinuityOfCareStory } from "@/components/PreventiveJourneyExpanded";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "Ascend, Evolve, Eterna and Pinnacle are MMS relationship pathways for preventive healthcare and personalised longevity coordination.",
};

export default function MembershipsPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Memberships"
        title="A continuum of care for every chapter of your life."
        lead="MMS memberships describe increasing depth of coordination after discovery, screening and professional review. No public pricing pressure. No one-size-fits-all pathway."
        image="/ling-concierge.png"
        imageAlt="Ling, the MMS virtual health spokesperson, introducing membership pathways."
        primaryLabel="Discuss membership"
        secondaryLabel="How it works"
        secondaryHref="/how-it-works"
        imagePosition="70% center"
        spokespersonName="Ling"
        spokespersonMessage="I’ll help you understand the difference between Ascend, Evolve, Eterna and Pinnacle before you discuss suitability with the MMS team."
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
          <div className="grid min-h-[340px] grid-cols-[1.15fr_0.85fr] grid-rows-2 gap-2 overflow-hidden rounded-[1.6rem] bg-[#e8e1d5] p-2 shadow-premium">
            <div className="relative row-span-2 overflow-hidden rounded-[1.15rem]">
              <Image
                src="/mms-doctor-results-review.png"
                alt="Doctor reviewing health results before a membership pathway is considered."
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 34vw, 60vw"
              />
            </div>
            <div className="relative overflow-hidden rounded-[1.15rem]">
              <Image
                src="/mms-concierge-lounge.png"
                alt="Concierge support for ongoing health coordination."
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 40vw"
              />
            </div>
            <div className="relative overflow-hidden rounded-[1.15rem]">
              <Image
                src="/mms-diagnostics-screening.png"
                alt="Preventive screening supporting long-term health continuity."
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      <ContinuityOfCareStory />

      <MembershipComparison />

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
        text="The value is in coordination, continuity, privacy and follow-through after doctor review."
        points={["No public pricing", "Suitability review", "Long-term relationship"]}
      />

      <FinalInvitation title="Start with discovery, then decide what depth of support fits." />
    </main>
  );
}
