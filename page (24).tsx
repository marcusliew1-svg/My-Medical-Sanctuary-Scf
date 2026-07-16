import { ButtonLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";

const privacyPoints = [
  "We collect information you provide through enquiry, booking, and communication forms.",
  "We use submitted information to respond to enquiries, coordinate appointments, and support patient service workflows.",
  "Website form submissions are intended to flow into Zoho CRM as Leads when integration is enabled.",
  "Medical advice, diagnosis, and treatment decisions remain part of doctor-led clinical care, not website automation.",
  "You may contact MMS to request access, correction, or withdrawal of consent where applicable.",
];

export default function PrivacyPdpaPage() {
  return (
    <main>
      <section className="bg-stone-950 px-4 pb-20 pt-36 text-white md:pt-44">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">
            Privacy / PDPA
          </p>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
            Respect for privacy is part of trust.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.72]">
            This placeholder Privacy / PDPA page should be reviewed by legal counsel before the
            public launch.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Data Care"
        title="How MMS handles website information."
        lead="The public website should collect only what is needed to respond professionally and support the patient's requested next step."
      >
        <div className="grid gap-4">
          {privacyPoints.map((point) => (
            <div key={point} className="rounded-lg border border-stone-200 bg-white p-6 leading-7 text-stone-700">
              {point}
            </div>
          ))}
        </div>
      </Section>

      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-lg bg-[#eef6f3] p-8 md:flex-row md:items-center md:p-12">
          <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">
            Questions about your information?
          </h2>
          <ButtonLink href="/contact">Contact MMS</ButtonLink>
        </div>
      </section>
    </main>
  );
}
