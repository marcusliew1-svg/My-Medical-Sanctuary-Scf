import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero, FinalInvitation, ImagePanel } from "@/components/Editorial";
import { CareTeamStrip, MarketSignalPanel, RevealCardGrid } from "@/components/ExperienceCards";

export const metadata: Metadata = {
  title: "Health Intelligence | My Medical Sanctuary",
  description:
    "MMS Health Intelligence helps patients understand preventive health, longevity science, screening and treatment questions with clear evidence boundaries.",
};

const featured = [
  {
    title: "Baseline before decisions",
    eyebrow: "Preventive health",
    text: "Why screening changes the quality of every health conversation.",
    detail:
      "A baseline helps separate urgency, trend, risk and uncertainty before a doctor recommends next steps.",
    image: "/mms-diagnostics-screening.png",
    href: "/health-screening",
  },
  {
    title: "Longevity without hype",
    eyebrow: "Longevity science",
    text: "What is known, what is uncertain and what to ask a clinician.",
    detail:
      "Healthy ageing should be discussed with evidence boundaries, individual context and realistic follow-up.",
    image: "/mms-doctor-couple-consult.png",
    href: "/longevity-medicine",
  },
  {
    title: "Medicine access across countries",
    eyebrow: "Regional care",
    text: "Why medicine cost and availability can differ between Malaysia, Thailand and other markets.",
    detail:
      "Registration, supply, taxes, prescription rules and licensed access pathways can all affect the final patient journey.",
    image: "/mms-medicine-access-consult.png",
    href: "/international-medicine-access",
  },
  {
    title: "Advanced options explained",
    eyebrow: "Treatments",
    text: "How to think about supportive and advanced care before choosing anything.",
    detail:
      "MMS should help patients understand purpose, suitability, uncertainty and professional review.",
    image: "/mms-doctor-results-review.png",
    href: "/treatments",
  },
];

const readingStandard = [
  ["Evidence", "What supports this idea, and how strong is it?"],
  ["Uncertainty", "What is still debated, early or dependent on individual context?"],
  ["Suitability", "Who may need professional review before acting?"],
  ["Next question", "What should the patient ask MMS or their clinician?"],
];

export default function InsightsPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Health Intelligence"
        title="Knowledge to empower your healthiest decisions."
        lead="MMS Health Intelligence is designed for patients who want clarity, not noise: evidence, uncertainty, suitability and the right next question."
        image="/mms-doctor-results-review.png"
        imageAlt="Doctor-led health intelligence briefing."
        primaryLabel="Start discovery"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="52% center"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Featured briefing</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Read like a better patient, not a passive consumer.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              A world-class clinic does not overwhelm patients with content. It helps them see what matters,
              what is uncertain and when a professional should be involved.
            </p>
            <Link href="/health-screening" className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/50 underline-offset-8">
              Read the screening guide
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-[1.25rem] bg-navy p-4 shadow-premium">
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <ImagePanel src="/mms-doctor-couple-consult.png" alt="Doctor-led learning discussion." className="min-h-[360px] rounded-[0.9rem]" objectPosition="50% center" />
              <div className="grid gap-4">
                <ImagePanel src="/mms-concierge-lounge.png" alt="Patient concierge guiding visitors." className="min-h-[170px] rounded-[0.9rem]" objectPosition="50% center" />
                <ImagePanel src="/mms-diagnostics-screening.png" alt="Screening insight review." className="min-h-[170px] rounded-[0.9rem]" objectPosition="50% center" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker mb-4 text-gold-light">Explore briefings</p>
              <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
                Every article should help you ask a better question.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ivory/66">
              Hover each briefing to reveal what the patient should understand next.
            </p>
          </div>
          <RevealCardGrid items={featured} />
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative min-h-[500px] overflow-hidden rounded-[1.5rem] shadow-premium">
            <Image src="/mms-medicine-access-consult.png" alt="Doctor and concierge helping visitors understand regional medicine access." fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Medicine price intelligence</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              If one country is expensive and another is cheaper, the answer is not just price.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              MMS can educate patients on why access differs across the US, Gulf markets, Australia,
              Singapore, Indonesia, Malaysia and Thailand: registration status, supply chains, taxes,
              exchange rates, manufacturer pathways, prescription rules and local professional requirements.
              This can become a verified access-intelligence pathway before licensed coordination.
            </p>
            <div className="mt-7 grid gap-3 border-y border-gold/40 py-5 text-sm leading-6 text-warm-gray">
              <p><strong className="text-navy">High-cost markets:</strong> United States, Gulf private-pay markets, Australia, Singapore and selected Indonesian private pathways.</p>
              <p><strong className="text-navy">Potential value corridor:</strong> Malaysia and Thailand, subject to registration, prescription, licensed access and continuity review.</p>
            </div>
            <Link href="/international-medicine-access" className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/50 underline-offset-8">
              Explore medicine access intelligence
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-4 text-deep-green">Reading standard</p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
            Responsibility should be visible in every health article.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {readingStandard.map(([title, text]) => (
              <article key={title} className="border-t border-gold/45 pt-5">
                <h3 className="font-serif text-3xl text-navy">{title}</h3>
                <p className="mt-3 leading-7 text-warm-gray">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MarketSignalPanel
        title="Patients notice price gaps. MMS should own the explanation."
        lead="The public site should make the regional access strategy visible enough to generate qualified enquiries, while keeping patient-specific access inside verified review."
      />

      <CareTeamStrip
        image="/mms-concierge-lounge.png"
        eyebrow="Knowledge with care"
        title="Health intelligence should make patients more confident, not more self-directed."
        text="MMS content points people toward better questions, professional review and a responsible next step."
        points={["Evidence", "Suitability", "Next question"]}
      />

      <FinalInvitation title="Learn first. Decide with professional guidance." />
    </main>
  );
}
