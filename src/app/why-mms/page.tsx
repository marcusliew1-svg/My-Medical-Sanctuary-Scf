import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";

const reasons = [
  {
    title: "Trust starts with doctors",
    text: "Personalised medical recommendations remain doctor-led, with technology used to support education and continuity.",
  },
  {
    title: "The journey begins with screening",
    text: "MMS helps patients understand their current health before considering programmes, memberships, or therapies.",
  },
  {
    title: "Long-term thinking",
    text: "The goal is not a single visit. The goal is a clear health roadmap that can evolve with your life.",
  },
];

export default function WhyMmsPage() {
  return (
    <main>
      <section className="relative isolate grid min-h-[70vh] items-end overflow-hidden bg-stone-950 px-4 text-white">
        <Image
          src="/mms-about-hero.png"
          alt="Doctor-led consultation at My Medical Sanctuary"
          fill
          priority
          className="-z-20 object-cover object-[62%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,28,31,0.94),rgba(9,28,31,0.64)_48%,rgba(9,28,31,0.24))]" />
        <div className="mx-auto w-full max-w-6xl pb-16 pt-36">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/70">Why MMS</p>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
            A lifelong health partner, not a normal clinic website.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.78]">
            MMS exists to help people move from reactive treatment to proactive, doctor-led
            health planning.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Trust"
        title="Why should I trust MMS?"
        lead="The MMS model is built around medical review, clear education, structured follow-up, and respect for clinical boundaries."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {reasons.map((reason) => (
            <article key={reason.title} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-2xl font-semibold">{reason.title}</h2>
              <p className="mt-4 leading-7 text-stone-600">{reason.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How MMS Helps"
        title="From symptoms and uncertainty to a personalised health roadmap."
        lead="Patients often arrive tired, worried about ageing, unsure about weight changes, or simply unclear about what to do next. MMS turns that uncertainty into a structured journey."
        dark
      >
        <div className="grid gap-3 md:grid-cols-5">
          {["Understand Your Health", "Health Screening", "Doctor Assessment", "Personalised Roadmap", "Health For Life"].map((step) => (
            <div key={step} className="rounded-lg border border-white/[0.14] bg-white/[0.07] p-5">
              <p className="font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="px-4 py-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-lg border border-stone-200 bg-[#eef6f3] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Next Step</p>
            <h2 className="text-3xl font-semibold md:text-5xl">Start with understanding.</h2>
          </div>
          <ButtonLink href="/contact">Book Health Screening</ButtonLink>
        </div>
      </section>
    </main>
  );
}
