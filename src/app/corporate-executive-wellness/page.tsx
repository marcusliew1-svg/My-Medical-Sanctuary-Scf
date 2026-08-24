import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { EditorialHero, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Corporate Executive Wellness | My Medical Sanctuary",
  description:
    "Corporate executive wellness programmes with discovery, health screening, HRM coordination and professional review pathways.",
};

const executivePath = [
  {
    title: "Scope",
    text: "Clarify whether the programme is for founders, leadership teams, employees or family office groups.",
  },
  {
    title: "Screen",
    text: "Build a preventive health starting point through appropriate screening and assessment pathways.",
  },
  {
    title: "Review",
    text: "Keep interpretation and recommendations under qualified professional review.",
  },
  {
    title: "Coordinate",
    text: "Use HRM support to make scheduling, follow-up and education easier for busy leaders.",
  },
  {
    title: "Educate",
    text: "Help teams understand health risks and lifestyle choices without turning wellness into noise.",
  },
];

export default function CorporateExecutiveWellnessPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Corporate Executive Wellness"
        title="Preventive health for people who carry responsibility."
        lead="MMS supports companies, owners and leadership teams with structured discovery, screening pathways, professional review and discreet coordination."
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor-led executive health screening discussion."
        primaryLabel="Discuss a programme"
        primaryHref="#corporate-enquiry"
        secondaryLabel="How MMS works"
        secondaryHref="/how-it-works"
        imagePosition="60% center"
      />

      <SplitStory
        eyebrow="For organisations"
        title="A calmer operating system for executive wellbeing."
        lead="Corporate wellness should not be a one-off campaign. MMS frames it as a practical pathway: understand the people, review the health picture, then coordinate appropriate next steps."
        image="/mms-about-hero.png"
        imageAlt="Private healthcare consultation for executive wellness planning."
        imagePosition="66% center"
      >
        <div className="grid gap-5 border-y border-gold/35 py-7">
          {[
            "Executive health screening and review pathways",
            "Health Relationship Manager coordination",
            "Preventive health education for teams",
            "Programme design subject to clinical and operational suitability",
          ].map((item) => (
            <p key={item} className="font-serif text-2xl leading-snug text-navy">
              {item}
            </p>
          ))}
        </div>
      </SplitStory>

      <section className="bg-navy px-4 py-20 text-ivory md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-5 text-gold-light">Programme architecture</p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
            Designed around governance, privacy and continuity.
          </h2>
          <div className="mt-12">
            <JourneyLine dark steps={executivePath} />
          </div>
        </div>
      </section>

      <section id="corporate-enquiry" className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Start the discussion</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Tell MMS what your organisation needs to solve.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              Share company context, preferred timing and whether the enquiry is for owners,
              executives, employees or a private group. MMS can then propose an appropriate next conversation.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <FinalInvitation
        title="A healthier organisation begins with clearer leadership health."
        lead="Start with discovery, then design the programme with professional and operational review."
      />
    </main>
  );
}
