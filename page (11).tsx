import { ButtonLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";
import { journeyCards } from "@/lib/content";

const steps = [
  "Understand Your Health",
  "Health Screening",
  "Doctor Assessment",
  "Personalised Health Roadmap",
  "Membership",
  "Health For Life",
];

export default function HealthJourneyPage() {
  return (
    <main>
      <section className="bg-stone-950 px-4 pb-20 pt-36 text-white md:pt-44">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Your Health Journey</p>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
            A calm, structured path from clarity to long-term care.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.72]">
            MMS guides visitors from understanding their health to screening, doctor assessment,
            personalised planning, membership, and health for life.
          </p>
        </div>
      </section>

      <Section eyebrow="Journey Map" title="The MMS experience is designed in sequence.">
        <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 md:grid-cols-6">
          {steps.map((step, index) => (
            <div key={step} className="min-h-40 bg-white p-6">
              <p className="mb-10 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">0{index + 1}</p>
              <h2 className="text-lg font-semibold leading-tight">{step}</h2>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Personal Priorities"
        title="Choose the reason you are here."
        lead="Each path begins with education and health screening before doctor-led recommendations."
        className="bg-[#eef6f3]"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {journeyCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-4 leading-7 text-stone-600">{card.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="px-4 py-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Your next step is not treatment. It is understanding.
          </h2>
          <ButtonLink href="/contact">Book Health Screening</ButtonLink>
        </div>
      </section>
    </main>
  );
}
