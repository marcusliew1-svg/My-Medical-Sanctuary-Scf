import type { Metadata } from "next";
import Link from "next/link";
import { SalesPartnerApplicationForm } from "@/components/CommerceRecruitmentForms";

export const metadata: Metadata = {
  title: "Join MMS",
  description: "Explore the MMS Sales Partner opportunity and future online application process.",
  robots: { index: false, follow: false },
};

const tiers = [
  ["Associate", "0–5 memberships / month"],
  ["Senior", "6–15 memberships / month"],
  ["Elite", "16+ memberships / month"],
  ["Chairman", "Leadership tier"],
];

export default function JoinMMSPage() {
  const applicationsEnabled = process.env.MMS_SALES_PARTNER_APPLICATIONS_ENABLED === "true";

  return (
    <main>
      <section className="bg-navy px-4 pb-16 pt-32 text-ivory md:pb-24 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">MMS Sales Partner Programme</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Build a professional business around better health conversations.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/72">Represent a premium preventive-health and personalised-longevity platform supported by structured education, Ling-assisted discovery and human clinical boundaries.</p>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-[2rem] bg-deep-green p-8 text-ivory shadow-premium">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">The proposition</p>
              <h2 className="mt-3 font-serif text-4xl">Professional relationship selling, not recruitment-chain selling.</h2>
              <div className="mt-7 grid gap-3 text-sm leading-6 text-ivory/76">
                <p>• Premium MMS memberships across preventive care and personalised longevity.</p>
                <p>• Malaysia–Thailand care ecosystem.</p>
                <p>• Ling-assisted education and discovery support.</p>
                <p>• Structured training, approved materials and compliance rules.</p>
                <p>• Relationship continuity beyond a one-off transaction.</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Commission framework</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[["10%", "Base commission"], ["15%", "Upgraded base tier"], ["18%", "Personal-target tier"], ["23%", "Group-target tier"]].map(([rate,label]) => (
                  <div key={rate} className="rounded-2xl bg-ivory p-5">
                    <p className="font-serif text-4xl text-navy">{rate}</p>
                    <p className="mt-1 text-sm font-semibold text-deep-green">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-warm-gray">An additional 2% residual may apply to eligible following-year renewals after the applicable utilisation, renewal and policy conditions are satisfied.</p>
              <p className="mt-3 text-xs leading-5 text-warm-gray">Exact qualification rules and payout timing are governed by the approved MMS Sales Partner Agreement and commission policy. Approved commission is processed after customer payment has cleared and cancellation/refund and compliance checks are satisfied.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {tiers.map(([name, target]) => (
              <div key={name} className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold">Partner level</p>
                <h3 className="mt-2 font-serif text-2xl text-navy">{name}</h3>
                <p className="mt-2 text-sm text-warm-gray">{target}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-gold-light/50 bg-ivory p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Application process</p>
                <h2 className="mt-2 font-serif text-3xl text-navy">Apply → screening → approval → agreement → training → activation.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-warm-gray">Applications collect professional profile and compliance information first. Bank payout and tax details are requested only after approval.</p>
              </div>
              {applicationsEnabled ? (
                <span className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy">Applications enabled</span>
              ) : (
                <span className="rounded-full border border-gold px-5 py-3 text-sm font-semibold text-navy">Online applications opening soon</span>
              )}
            </div>
          </div>

          <section className="mt-10" aria-labelledby="sales-partner-application-heading">
            <div className="mb-5 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Apply to join</p>
              <h2 id="sales-partner-application-heading" className="mt-2 font-serif text-4xl text-navy">Sales Partner application</h2>
              <p className="mt-3 text-sm leading-6 text-warm-gray">The form is prepared now and becomes submit-enabled only after the approved CRM workflow and privacy process are active.</p>
            </div>
            <SalesPartnerApplicationForm enabled={applicationsEnabled} />
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/memberships" className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">Understand MMS memberships</Link>
            <Link href="/contact" className="rounded-full border border-gold px-5 py-3 text-sm font-semibold text-navy">Contact MMS</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
