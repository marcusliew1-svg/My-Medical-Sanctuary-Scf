import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero, FinalInvitation } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Online Doctor Session",
  description:
    "Request a private MMS online doctor discussion, with Ling helping prepare the questions before professional review.",
};

const steps = [
  {
    number: "01",
    title: "Ling prepares",
    text: "Your goals, concerns and recent context can be organised before the consultation so the conversation begins with better questions.",
  },
  {
    number: "02",
    title: "Doctor leads",
    text: "A qualified professional conducts the medical discussion, interprets personal information and decides what requires follow-up.",
  },
  {
    number: "03",
    title: "MMS connects the next step",
    text: "Where appropriate, screening, in-person assessment or continuity planning can be organised after the consultation.",
  },
];

export default function OnlineDoctorPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Online doctor"
        title="Prepared by Ling. Led by a doctor."
        lead="A private virtual consultation should begin with context, not a cold start. Ling helps organise the question; the doctor leads the medical discussion."
        image="/ling-continuity.png"
        imageAlt="Ling, the MMS virtual health spokesperson, preparing a patient for an online doctor consultation."
        primaryLabel="Request a session"
        primaryHref="/contact?interest=online-doctor"
        secondaryLabel="Ask Ling first"
        secondaryHref="/ling"
        imagePosition="70% center"
        spokespersonName="Ling"
        spokespersonMessage="I can help you organise what changed, what you want to understand and what information may be useful before your doctor conversation."
        trustItems={[
          { title: "Human-led", text: "Clinical interpretation stays with a qualified professional." },
          { title: "Prepared context", text: "Better questions before the consultation begins." },
          { title: "Private discussion", text: "Health information should be handled with appropriate privacy safeguards." },
          { title: "Connected follow-up", text: "The next step remains part of the wider MMS journey." },
        ]}
      />

      <section className="bg-[#f1ece2] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="editorial-kicker mb-5 text-deep-green">Virtual consultation</p>
              <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
                The technology should disappear. The clinical conversation should not.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-warm-gray">
              The value of an online consultation is not the video call itself. It is the quality of the preparation, professional judgement and continuity after the call.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-[1.6rem] border border-gold/20 bg-white/88 p-6 shadow-[0_22px_64px_rgba(11,26,46,0.06)]"
              >
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-deep-green/55">{step.number}</span>
                <h3 className="mt-4 font-serif text-3xl text-navy">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-warm-gray">{step.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-5 rounded-[1.6rem] border border-gold/20 bg-[#07151d] p-6 text-ivory md:grid-cols-[0.46fr_1.54fr] md:items-center md:p-8">
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold-light">Privacy & recording</p>
              <p className="mt-2 font-serif text-2xl">Consent first.</p>
            </div>
            <p className="text-sm leading-7 text-ivory/60">
              Any virtual consultation, recording or storage of health information should follow applicable privacy requirements,
              platform capability and explicit consent. Recording should never be assumed or automatic.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              href="/contact?interest=online-doctor"
              className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-ivory transition hover:-translate-y-0.5 hover:bg-[#10283a]"
            >
              Request online doctor session
            </Link>
          </div>
        </div>
      </section>

      <FinalInvitation
        title="Start with the question you want a doctor to help you answer."
        lead="Ling can help organise it first. Clinical decisions remain with the doctor."
      />
    </main>
  );
}
