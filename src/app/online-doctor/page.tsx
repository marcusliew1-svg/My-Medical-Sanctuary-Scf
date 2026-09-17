import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Online Doctor Pathway Status",
  description: "Status and safety boundaries for the planned MMS online consultation pathway.",
  robots: { index: false, follow: false },
};

const requirements = [
  ["01", "Licensed providers", "The operating entity, clinician eligibility and permitted jurisdictions must be verified and approved."],
  ["02", "Approved clinical workflow", "Triage, consent, emergencies, records, prescribing, follow-up and escalation need documented clinical ownership."],
  ["03", "Approved technology", "The consultation platform, privacy terms, access controls, retention and incident process must pass security and privacy review."],
];

export default function OnlineDoctorPage() {
  return (
    <main>
      <PageHero
        eyebrow="Planned online consultation pathway"
        title="Online doctor consultations are not currently available through MMS."
        lead="This page records a future service concept only. MMS is not accepting online-doctor bookings and does not represent that a provider, platform or licensed operating workflow has been approved."
        primaryHref="/contact"
        primaryLabel="Read website availability"
      />
      <Section eyebrow="Launch requirements" title="No clinical service until every control is approved.">
        <div className="grid gap-5 md:grid-cols-3">
          {requirements.map(([number, title, text]) => (
            <article key={number} className="rounded-2xl border border-gold-light/40 bg-white p-7 shadow-soft">
              <span className="grid size-11 place-items-center rounded-full bg-deep-green text-sm font-bold text-white">{number}</span>
              <h2 className="mt-5 font-serif text-2xl text-navy">{title}</h2>
              <p className="mt-3 leading-7 text-warm-gray">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-ivory p-6 text-sm leading-7 text-warm-gray">
          <strong className="text-navy">Safety boundary:</strong> This website is not an emergency service and this planned pathway must not be used for urgent symptoms, diagnosis, prescriptions or treatment decisions.
        </div>
        <div className="mt-8"><CTAButton href="/contact">Read contact and booking status</CTAButton></div>
      </Section>
    </main>
  );
}
