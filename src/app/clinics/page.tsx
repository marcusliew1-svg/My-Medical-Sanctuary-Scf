import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { EditorialHero, FinalInvitation, ImagePanel } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Planned MMS care settings across Bangsar and SS2, designed around preventive health, specialised care, privacy and continuity.",
};

const settings = [
  {
    name: "Bangsar",
    eyebrow: "Preventive health & longevity",
    image: "/mms-concierge-lounge.png",
    description:
      "A warmer, hospitality-led environment for discovery, physician consultation, health screening discussions and personalised longevity planning.",
    details: ["Private consultation", "Preventive health", "Health intelligence", "Long-term planning"],
  },
  {
    name: "SS2",
    eyebrow: "Specialised clinical care",
    image: "/mms-health-screening-hero.png",
    description:
      "A more clinical setting designed around reliability, dignity and continuity for specialised patient care.",
    details: ["Clinical reliability", "Continuity", "Patient dignity", "Coordinated follow-up"],
  },
];

export default function ClinicsPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="MMS care settings"
        title="Medicine should feel precise. The environment can still feel human."
        lead="MMS is designing care settings around privacy, calm, medical responsibility and continuity—not the atmosphere of a transactional clinic."
        image="/ling-concierge.png"
        imageAlt="Ling, the MMS virtual health spokesperson, welcoming patients into the MMS care environment."
        primaryLabel="Speak with MMS"
        secondaryLabel="Care journey"
        secondaryHref="/how-it-works"
        imagePosition="70% center"
        spokespersonName="Ling"
        spokespersonMessage="I’ll help you understand which MMS setting may fit your next step and what to expect before a member of the care team takes over."
      />

      <section className="bg-[#eee8dc] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="editorial-kicker mb-4 text-deep-green">The sanctuary standard</p>
              <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
                Privacy without clinical coldness.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-warm-gray">
              The physical environment should support the same promise as the digital experience: understand first,
              decide carefully, and make it easy to continue the relationship over time.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {settings.map((setting) => (
              <article
                key={setting.name}
                className="overflow-hidden rounded-[2rem] border border-white/65 bg-[#f8f4ec] shadow-[0_30px_90px_rgba(11,26,46,0.11)]"
              >
                <ImagePanel
                  src={setting.image}
                  alt={`${setting.name} MMS care environment.`}
                  className="min-h-[360px]"
                  objectPosition="50% center"
                />
                <div className="p-6 md:p-8">
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-deep-green">
                    {setting.eyebrow}
                  </p>
                  <h3 className="mt-3 font-serif text-4xl text-navy">{setting.name}</h3>
                  <p className="mt-4 text-base leading-7 text-warm-gray">{setting.description}</p>
                  <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gold/25 pt-5">
                    {setting.details.map((item) => (
                      <p key={item} className="text-xs font-semibold uppercase tracking-[0.11em] text-deep-green/80">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-5 border-t border-gold/25 pt-7 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-sm leading-6 text-warm-gray">
              Care settings, services and opening timelines remain subject to licensing, regulatory approval and operational readiness.
            </p>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-ivory transition hover:-translate-y-0.5 hover:bg-[#10283a]"
            >
              Ask about availability
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#07151d] px-4 py-20 text-ivory md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(202,168,104,0.11),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(92,129,120,0.10),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="editorial-kicker mb-4 text-gold-light">One patient story</p>
              <h2 className="max-w-4xl text-balance font-serif text-4xl leading-tight md:text-6xl">
                Different settings. One continuous health relationship.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-ivory/60 lg:justify-self-end">
              From preparation to professional care to follow-up, the experience should feel connected rather than fragmented.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-[6.55rem] hidden h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent lg:block" />

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Before the visit",
                  text: "Ling and the MMS team help organise the question, context and practical next step.",
                  image: "/ling-concierge.png",
                  alt: "Ling supporting the patient before an MMS visit.",
                  icon: "calendar",
                  points: ["Clarify goals", "Prepare information", "Plan the visit"],
                },
                {
                  number: "02",
                  title: "During care",
                  text: "Qualified professionals lead clinical assessment, interpretation and suitability decisions.",
                  image: "/mms-doctor-couple-consult.png",
                  alt: "Doctor discussing care with patients during an MMS consultation.",
                  icon: "care",
                  points: ["Clinical assessment", "Professional interpretation", "Personalised planning"],
                },
                {
                  number: "03",
                  title: "Afterwards",
                  text: "Results, follow-up and next actions stay connected instead of disappearing after one appointment.",
                  image: "/mms-doctor-results-review.png",
                  alt: "Doctor reviewing results and follow-up after an MMS visit.",
                  icon: "trend",
                  points: ["Clear explanations", "Next steps", "Ongoing guidance"],
                },
              ].map((step) => (
                <article
                  key={step.number}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_28px_90px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-1.5 hover:border-gold/25 hover:bg-white/[0.055]"
                >
                  <div className="relative h-[260px] overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.035]"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07151d] via-[#07151d]/10 to-transparent" />
                    <div className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-gold/45 bg-[#07151d]/82 text-sm font-semibold tracking-[0.12em] text-gold-light backdrop-blur">
                      {step.number}
                    </div>
                  </div>

                  <div className="relative p-6 md:p-7">
                    <div className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-gold/8 text-gold-light">
                      {step.icon === "calendar" ? (
                        <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="8" y="12" width="32" height="28" rx="4" />
                          <path d="M15 7v10M33 7v10M8 21h32" />
                        </svg>
                      ) : step.icon === "care" ? (
                        <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M14 8v12a10 10 0 0 0 20 0V8M10 8h8M30 8h8" />
                          <path d="M24 30v4a7 7 0 0 0 14 0v-3" />
                          <circle cx="38" cy="27" r="3" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M8 37h32M12 32V22M23 32V16M34 32V10" />
                          <path d="m10 18 10-6 9 3 9-8" />
                        </svg>
                      )}
                    </div>

                    <h3 className="font-serif text-3xl text-ivory md:text-4xl">{step.title}</h3>
                    <p className="mt-3 min-h-[4.75rem] text-sm leading-6 text-ivory/62">{step.text}</p>

                    <div className="mt-6 grid gap-3 border-t border-white/10 pt-5">
                      {step.points.map((point) => (
                        <p key={point} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.11em] text-ivory/58">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          {point}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalInvitation
        title="Choose the setting after the right first conversation."
        lead="Start with what you want to understand. MMS can help route the next step appropriately."
      />
    </main>
  );
}
