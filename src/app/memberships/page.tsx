import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Hero } from "@/components/Hero";
import { MembershipCard } from "@/components/MembershipCard";
import { SectionHeader } from "@/components/SectionHeader";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "Explore MMS memberships including Ascend, Evolve, Eterna and Pinnacle for structured wellness coordination.",
};

export default function MembershipsPage() {
  return (
    <main>
      <Hero
        eyebrow="Memberships"
        title="Structured wellness journeys, not random purchases."
        subtitle="Each MMS membership is designed around discovery, HRM coordination, professional review and suitability assessment."
        image="/mms-about-hero.png"
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Membership Tiers"
            title="Ascend, Evolve, Eterna and Pinnacle."
            description="Pricing is indicative for v0.1 planning and may be refined before launch."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {memberships.map((membership) => (
              <MembershipCard key={membership.name} membership={membership} />
            ))}
          </div>
          <div className="mt-8">
            <DisclaimerBox>
              <p>
                Membership does not promise specific outcomes. Any wellness pathway is subject to discovery discussion, professional review and suitability assessment.
              </p>
            </DisclaimerBox>
          </div>
        </div>
      </section>
    </main>
  );
}
