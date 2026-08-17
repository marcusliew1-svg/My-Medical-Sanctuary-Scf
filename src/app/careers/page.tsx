import type { Metadata } from "next";
import Link from "next/link";
import { CareersApplicationForm } from "@/components/CommerceRecruitmentForms";
import { CAREER_ROLE_FAMILIES } from "@/lib/careersPolicy";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore future employment opportunities with My Medical Sanctuary.",
  robots: { index: false, follow: false },
};

export default function CareersPage() {
  const applicationsEnabled = process.env.MMS_CAREERS_APPLICATIONS_ENABLED === "true";
  const roleNames = CAREER_ROLE_FAMILIES.map(({ name }) => name);

  return (
    <main>
      <section className="bg-deep-green px-4 pb-16 pt-32 text-ivory md:pb-24 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Careers at MMS</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Help us build a more connected health experience.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/72">MMS brings together preventive health, personalised longevity, care coordination and digital intelligence. We are building teams that combine professionalism, empathy and operational discipline.</p>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Role families</p>
              <h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Where you may fit.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-warm-gray">Open positions will be listed only when the role, hiring owner and application process are confirmed. Clinical roles remain subject to the appropriate professional and credential requirements.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CAREER_ROLE_FAMILIES.map(({ name, description }) => (
              <article key={name} className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold">MMS team</p>
                <h3 className="mt-2 font-serif text-2xl text-navy">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-warm-gray">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] bg-navy p-8 text-ivory">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Recruitment workflow</p>
                <h2 className="mt-2 font-serif text-3xl md:text-4xl">Vacancy → application → screening → interview → verification → offer → onboarding.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-ivory/68">Employee recruitment is separate from the MMS Sales Partner Programme. Candidate information will route to the approved HR system once the recruitment integration is enabled.</p>
              </div>
              {applicationsEnabled ? (
                <span className="rounded-full bg-gold-light px-5 py-3 text-sm font-semibold text-navy">Applications enabled</span>
              ) : (
                <span className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">Online applications opening soon</span>
              )}
            </div>
          </div>

          <section className="mt-10" aria-labelledby="careers-application-heading">
            <div className="mb-5 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Future applications</p>
              <h2 id="careers-application-heading" className="mt-2 font-serif text-4xl text-navy">Employment application</h2>
              <p className="mt-3 text-sm leading-6 text-warm-gray">The application form is prepared now, but submission remains disabled until the approved HR system and CV-handling workflow are connected.</p>
            </div>
            <CareersApplicationForm enabled={applicationsEnabled} roles={roleNames} />
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about-mms" className="rounded-full bg-deep-green px-5 py-3 text-sm font-semibold text-white">Learn about MMS</Link>
            <Link href="/join-mms" className="rounded-full border border-gold px-5 py-3 text-sm font-semibold text-navy">Looking for Sales Partner opportunities?</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
