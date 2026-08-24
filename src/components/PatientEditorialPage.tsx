import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";
import { CareTeamStrip, RevealCardGrid } from "@/components/ExperienceCards";

export type EditorialPoint = {
  title: string;
  text: string;
};

export type PatientEditorialPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  image?: string;
  imageAlt?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  introEyebrow: string;
  introTitle: string;
  introLead: string;
  points: EditorialPoint[];
  trustTitle: string;
  trustLead: string;
  trustImage?: string;
  finalTitle?: string;
  finalLead?: string;
};

export function metadataFor(title: string, description: string): Metadata {
  return { title, description };
}

export function PatientEditorialPage({
  eyebrow,
  title,
  lead,
  image = "/mms-about-hero.png",
  imageAlt = "Doctor-led private healthcare consultation.",
  primaryLabel = "Start with discovery",
  primaryHref = "/contact",
  secondaryLabel = "Ask Ling",
  secondaryHref = "/ling",
  introEyebrow,
  introTitle,
  introLead,
  points,
  trustTitle,
  trustLead,
  trustImage = "/mms-health-screening-hero.png",
  finalTitle,
  finalLead,
}: PatientEditorialPageProps) {
  const pointImages = [
    "/mms-doctor-couple-consult.png",
    "/mms-diagnostics-screening.png",
    "/mms-doctor-results-review.png",
    "/mms-concierge-lounge.png",
  ];

  return (
    <main>
      <EditorialHero
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        image={image}
        imageAlt={imageAlt}
        primaryLabel={primaryLabel}
        primaryHref={primaryHref}
        secondaryLabel={secondaryLabel}
        secondaryHref={secondaryHref}
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.76fr_1.24fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">{introEyebrow}</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              {introTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">{introLead}</p>
          </div>
          <RevealCardGrid
            items={points.map((point, index) => ({
              title: point.title,
              eyebrow: "Patient clarity",
              text: point.text,
              detail:
                "MMS uses this as part of a structured conversation, not as a standalone instruction or treatment recommendation.",
              image: pointImages[index % pointImages.length],
            }))}
          />
        </div>
      </section>

      <SplitStory
        eyebrow="Professional review"
        title={trustTitle}
        lead={trustLead}
        image={trustImage}
        imageAlt="Doctor reviewing health information before personalised recommendations."
        dark
        reverse
      >
        <JourneyLine
          dark
          compact
          steps={[
            { title: "Understand", text: "Clarify the question before choosing the pathway." },
            { title: "Assess", text: "Use screening and context to build a safer picture." },
            { title: "Review", text: "Let qualified professionals decide what is appropriate." },
            { title: "Plan", text: "Create a practical next step with realistic boundaries." },
            { title: "Follow", text: "Keep continuity visible after the visit." },
          ]}
        />
      </SplitStory>

      <CareTeamStrip
        image="/mms-doctor-results-review.png"
        title="The best next step is explained by people, not pushed by a page."
        text="MMS uses education, screening and doctor review to turn a health question into a calmer, more credible plan."
        points={["Education first", "Doctor-led", "Continuity"]}
      />

      <FinalInvitation title={finalTitle} lead={finalLead} />
    </main>
  );
}
