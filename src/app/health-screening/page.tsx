import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";

const screeningBenefits = [
  {
    title: "Detect Early",
    text: "Identify potential health risks before symptoms develop.",
  },
  {
    title: "Build Your Baseline",
    text: "Know where your health stands today before deciding what comes next.",
  },
  {
    title: "Personalised Insights",
    text: "Every health profile is unique and should be reviewed in context.",
  },
  {
    title: "Plan Ahead",
    text: "Make informed decisions with your doctor, not reactive decisions under pressure.",
  },
];

const mayInclude = [
  "Blood Investigations",
  "ECG",
  "Ultrasound",
  "Body Composition",
  "Biological Age Indicators",
  "Lifestyle Assessment",
  "Doctor Consultation",
  "Personalised Report",
];

const journey = [
  "Book Screening",
  "Visit MMS",
  "Health Assessment",
  "Doctor Review",
  "Personalised Health Plan",
  "Optional Membership Journey",
];

export default function HealthScreeningPage() {
  return (
    <main>
      <section className="relative isolate grid min-h-[82vh] items-end overflow-hidden bg-stone-950 px-4 text-white">
        <Image
          src="/mms-health-screening-hero.png"
          alt="Doctor-led health screening consultation"
          fill
          priority
          className="-z-20 object-cover object-[62%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,28,31,0.94),rgba(9,28,31,0.66)_45%,rgba(9,28,31,0.22)_78%),linear-gradient(0deg,rgba(9,28,31,0.78),transparent_54%)]" />
        <div className="mx-auto w-full max-w-6xl pb-16 pt-40">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">
            Health Screening
          </p>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
            Your Health Journey Starts With Understanding.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.78]">
            A personalised health screening helps identify current health status, detect potential
            risks early, and provides a doctor-led foundation for your long-term wellness plan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Book Health Screening</ButtonLink>
            <ButtonLink href="/ling" variant="light">Ask Ling</ButtonLink>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Why Screening Matters"
        title="Understand your health before problems become more serious."
        lead="Health screening is the smartest first step whether you later pursue membership, longevity planning, regenerative education, or no programme at all."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {screeningBenefits.map((benefit) => (
            <article key={benefit.title} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-xl font-semibold">{benefit.title}</h2>
              <p className="mt-4 leading-7 text-stone-600">{benefit.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Our Screening Philosophy"
        title="Doctor-led, evidence-informed, personalised, actionable screening."
        lead="MMS does not begin with generic packages. Screening should create clarity, guide doctor review, and support a practical health roadmap."
        dark
      >
        <div className="grid gap-3 md:grid-cols-4">
          {["Doctor-led", "Evidence-informed", "Personalised", "Actionable"].map((item) => (
            <div key={item} className="rounded-lg border border-white/[0.14] bg-white/[0.07] p-6">
              <p className="text-lg font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="May Include"
        title="What your screening may include."
        lead="Programmes may evolve, so inclusions are confirmed during booking and consultation."
        className="bg-[#eef6f3]"
      >
        <div className="grid gap-4 md:grid-cols-4">
          {mayInclude.map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-6">
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="What Happens Next?" title="Membership comes after doctor review.">
        <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 md:grid-cols-6">
          {journey.map((step, index) => (
            <div key={step} className="min-h-40 bg-white p-6">
              <p className="mb-10 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                0{index + 1}
              </p>
              <h2 className="text-lg font-semibold leading-tight">{step}</h2>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-stone-950 px-4 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">
              Next Step
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              Your future health starts today.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/[0.72]">
              Book a comprehensive health screening and begin your personalised preventive
              healthcare journey.
            </p>
          </div>
          <ButtonLink href="/contact" variant="light">
            Book Appointment
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
