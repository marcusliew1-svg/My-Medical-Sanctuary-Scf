import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero, EditorialStatement, FinalInvitation, ImagePanel, JourneyLine, SplitStory } from "@/components/Editorial";
import { CareTeamStrip, MarketSignalPanel, RevealCardGrid } from "@/components/ExperienceCards";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "My Medical Sanctuary is a private preventive healthcare and personalised longevity institution built around discovery, doctor review and continuity.",
};

const goals = [
  {
    title: "Understand my health",
    eyebrow: "Start here",
    text: "Begin with a baseline and doctor-led review.",
    detail: "MMS helps translate uncertainty into screening, review and a practical next conversation.",
    image: "/mms-diagnostics-screening.png",
    href: "/health-screening",
  },
  {
    title: "Age well",
    eyebrow: "Longevity",
    text: "Plan for resilience, independence and long-term clarity.",
    detail: "Personalised longevity begins with context, not hype or one-size-fits-all advice.",
    image: "/mms-doctor-couple-consult.png",
    href: "/longevity-medicine",
  },
  {
    title: "Energy & vitality",
    eyebrow: "Metabolic health",
    text: "Explore sleep, stress, metabolic and lifestyle patterns.",
    detail: "MMS can help organise the question before suitability and professional review.",
    image: "/mms-doctor-results-review.png",
    href: "/health-discovery",
  },
  {
    title: "Advanced options",
    eyebrow: "Education first",
    text: "Learn what deserves professional suitability review.",
    detail: "Advanced care should be discussed responsibly, with evidence boundaries and doctor-led decisions.",
    image: "/mms-concierge-lounge.png",
    href: "/treatments",
  },
];

const method = [
  { title: "Discover", text: "A calm first conversation about goals, concerns and context." },
  { title: "Assess", text: "Screening and information gathering before decisions are made." },
  { title: "Review", text: "Doctors interpret what matters and what does not." },
  { title: "Personalise", text: "A practical roadmap shaped around suitability and priorities." },
  { title: "Continue", text: "Health Relationship Managers help the journey stay organised." },
];

const programmes = [
  {
    title: "Ascend",
    eyebrow: "Start strong",
    text: "Understand your baseline.",
    detail: "A structured beginning for patients who want clarity, screening and professional review.",
    image: "/mms-concierge-lounge.png",
    href: "/memberships",
  },
  {
    title: "Evolve",
    eyebrow: "Optimise",
    text: "Improve and optimise.",
    detail: "Closer coordination around energy, weight, lifestyle and metabolic health.",
    image: "/mms-doctor-results-review.png",
    href: "/memberships",
  },
  {
    title: "Eterna",
    eyebrow: "Protect",
    text: "Protect long-term health.",
    detail: "Longer-horizon preventive planning with continuity and repeated review.",
    image: "/mms-doctor-couple-consult.png",
    href: "/memberships",
  },
  {
    title: "Pinnacle",
    eyebrow: "Private",
    text: "Private health coordination.",
    detail: "Highly coordinated care, subject to capacity, invitation and clinical suitability.",
    image: "/mms-diagnostics-screening.png",
    href: "/memberships",
  },
];

export default function HomePage() {
  return (
    <main>
      <EditorialHero
        eyebrow="My Medical Sanctuary"
        title="Your health deserves a longer view."
        lead="Preventive care. Personalised longevity. Physician-guided."
        image="/mms-doctor-couple-consult.png"
        imageAlt="Doctor reviewing health information with a patient in a calm private consultation room."
        imagePosition="62% center"
      />

      <EditorialStatement
        eyebrow="Why MMS"
        title="Most healthcare begins when something goes wrong. MMS begins earlier."
        lead="We help patients understand earlier, decide better and stay healthier longer, without turning care into a treatment catalogue."
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Start with your goal</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              You do not need to know the treatment name.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              Begin with what you want to understand. MMS helps translate that into the right screening,
              review and next conversation.
            </p>
          </div>
          <RevealCardGrid items={goals} />
        </div>
      </section>

      <SplitStory
        eyebrow="Medical judgement"
        title="Medical judgement comes first."
        lead="Technology can support. Advanced therapies can expand options. Clinical decisions remain with qualified professionals."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor and patient discussing screening information."
        dark
        imagePosition="62% center"
      >
        <div className="grid max-w-xl gap-4 border-l border-gold/40 pl-6 text-ivory/74">
          <p>Education before recommendation.</p>
          <p>Suitability before programme selection.</p>
          <p>Continuity before one-off treatment decisions.</p>
        </div>
      </SplitStory>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="editorial-kicker mb-4 text-deep-green">The MMS method</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              One connected journey, not a menu of services.
            </h2>
          </div>
          <JourneyLine steps={method} />
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <ImagePanel
            src="/mms-concierge-lounge.png"
            alt="Private consultation room designed for calm preventive care."
            className="min-h-[460px] rounded-[2rem] shadow-premium"
            objectPosition="42% center"
          />
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">The sanctuary</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Healthcare should feel considered from the moment you arrive.
            </h2>
            <div className="mt-8 grid gap-6 border-l border-gold/40 pl-6">
              <div>
                <h3 className="font-serif text-2xl text-navy">Bangsar</h3>
                <p className="mt-2 leading-7 text-warm-gray">Warm preventive health, longevity planning and hospitality-led coordination.</p>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-navy">SS2</h3>
                <p className="mt-2 leading-7 text-warm-gray">Clinical reliability and specialised care context, presented with calm continuity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="editorial-kicker mb-4 text-gold-light">Programmes</p>
              <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
                Four depths of one relationship.
              </h2>
              <p className="mt-6 text-lg leading-8 text-ivory/70">
                Membership is discussed after discovery and review. It should feel like increasing continuity, not public pricing.
              </p>
            </div>
            <RevealCardGrid items={programmes} />
          </div>
        </div>
      </section>

      <CareTeamStrip
        image="/mms-doctor-couple-consult.png"
        eyebrow="Human care, digitally supported"
        title="Technology should make care feel clearer, not colder."
        text="Ling supports education and preparation, while MMS doctors and Health Relationship Managers remain the visible centre of the patient journey."
        points={["Ling educates", "Doctors decide", "MMS follows through"]}
      />

      <MarketSignalPanel
        title="A regional access opportunity patients already feel."
        lead="When a medicine or specialist pathway is expensive in one country and potentially more accessible in Malaysia or Thailand, MMS can convert curiosity into a paid, verified access-intelligence discussion."
      />

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Health Intelligence</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              A better health journey is also a better learning journey.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              MMS content should help patients separate evidence, uncertainty, suitability and next questions for their clinician.
            </p>
            <Link href="/insights" className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/50 underline-offset-8">
              Explore Health Intelligence
            </Link>
          </div>
          <div className="grid gap-6 border-l border-gold/40 pl-6">
            {["Preventive Health", "Longevity Science", "Treatments Explained", "Metabolic Health"].map((topic) => (
              <div key={topic}>
                <h3 className="font-serif text-3xl text-navy">{topic}</h3>
                <p className="mt-2 leading-7 text-warm-gray">Plain-language education with clear boundaries and room for clinical judgement.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy px-4 py-20 text-ivory md:py-28">
        <Image src="/mms-medicine-access-consult.png" alt="" fill className="-z-0 object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative mx-auto max-w-6xl">
          <p className="editorial-kicker mb-4 text-gold-light">Regional care</p>
          <h2 className="max-w-4xl text-balance font-serif text-4xl leading-tight md:text-6xl">
            Your care can travel with you.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["Malaysia", "Preventive health, MMS continuity and patient relationship management."],
              ["Thailand", "Selected specialist, recovery and regional access discussions where appropriate."],
              ["MMS", "Coordination that keeps the patient journey understandable."],
            ].map(([title, text]) => (
              <div key={title} className="border-t border-gold/45 pt-5">
                <h3 className="font-serif text-3xl">{title}</h3>
                <p className="mt-3 leading-7 text-ivory/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalInvitation />
    </main>
  );
}
