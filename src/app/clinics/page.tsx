import type { Metadata } from "next";
import Link from "next/link";
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

      <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="editorial-kicker mb-4 text-gold-light">One patient story</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              Different settings. One continuous health relationship.
            </h2>
          </div>
          <div className="grid gap-7">
            {[
              ["Before the visit", "Ling and the MMS team help organise the question, context and practical next step."],
              ["During care", "Qualified professionals lead clinical assessment, interpretation and suitability decisions."],
              ["Afterwards", "Results, follow-up and next actions stay connected instead of disappearing after one appointment."],
            ].map(([title, text], index) => (
              <div key={title} className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-[0.18fr_0.82fr]">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-3xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ivory/62">{text}</p>
                </div>
              </div>
            ))}
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
