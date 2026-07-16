import type { Metadata } from "next";
import { CorporateCTA } from "@/components/CorporateCTA";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { EducationCard } from "@/components/EducationCard";
import { Hero } from "@/components/Hero";
import { MembershipCard } from "@/components/MembershipCard";
import { SectionHeader } from "@/components/SectionHeader";
import { StepCard } from "@/components/StepCard";
import { WellnessAreaCard } from "@/components/WellnessAreaCard";
import { educationPosts } from "@/data/educationPosts";
import { memberships } from "@/data/memberships";
import { steps } from "@/data/steps";
import { wellnessAreas } from "@/data/wellnessAreas";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "Start your structured wellness journey with My Medical Sanctuary through discovery, HRM coordination and professional review.",
};

export default function HomePage() {
  return (
    <main>
      <Hero
        eyebrow="My Medical Sanctuary"
        title="Preventive Care. Personalised Longevity."
        subtitle="A premium membership-based wellness journey built around discovery before recommendation, HRM coordination and professional review."
      />

      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Why MMS"
            title="Discovery before recommendation."
            description="MMS is designed for people who want calm, structured guidance rather than random wellness purchases."
          />
          <div className="grid gap-4 md:grid-cols-4">
            {[
              "Discovery-led conversations",
              "HRM coordination",
              "Preventive care focus",
              "Professional review",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-warm-white bg-white p-6">
                <h3 className="font-serif text-2xl text-navy">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Memberships"
            title="Choose a structured wellness journey."
            description="Each tier is designed around coordination, clarity and suitability assessment."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {memberships.map((membership) => (
              <MembershipCard key={membership.name} membership={membership} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="How It Works"
            title="An 8-step path from discovery to review."
            description="The journey is structured so recommendations follow context and professional review."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Wellness Support Areas"
            title="Educational categories, not a price menu."
            description="These areas help members understand what may be discussed during discovery and suitability assessment."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {wellnessAreas.map((area) => (
              <WellnessAreaCard key={area.title} area={area} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div>
            <SectionHeader
              eyebrow="Education"
              title="Meet Dr Ling."
              description="Dr Ling is the MMS education layer for plain-language wellness learning. She supports understanding but does not replace professional review."
            />
          </div>
          <DisclaimerBox title="Dr Ling boundary">
            <p>
              Dr Ling content is for education only. It is not medical advice and should not be used as a personalised recommendation.
            </p>
          </DisclaimerBox>
        </div>
      </section>

      <CorporateCTA />

      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Education Hub"
            title="Latest education placeholders."
            description="Blog and video content will support future SEO, patient education and Dr Ling learning flows."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {educationPosts.map((post) => (
              <EducationCard key={post.title} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Final CTA</p>
          <h2 className="font-serif text-4xl md:text-6xl">Start With Discovery</h2>
          <p className="mt-5 text-lg leading-8 text-ivory/72">
            Begin with a calm discovery discussion before choosing a membership or wellness pathway.
          </p>
        </div>
      </section>
    </main>
  );
}
