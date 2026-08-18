import type { Metadata } from "next";
import Link from "next/link";
import { SalesPartnerApplicationForm } from "@/components/CommerceRecruitmentForms";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export const metadata: Metadata = {
  title: "Join MMS",
  description: "Explore the MMS Sales Partner opportunity and future online application process.",
  robots: { index: false, follow: false },
};

const tiers = [
  ["Associate", "Entry partner level"],
  ["Senior", "Performance progression level"],
  ["Elite", "Advanced performance level"],
  ["Chairman", "Separate leadership qualification"],
];

const activationSteps = [
  ["1", "Approval", "MMS reviews suitability, market, experience and compliance declarations."],
  ["2", "Agreement", "Approved applicants complete the current Sales Partner Agreement and required onboarding documentation."],
  ["3", "Training", "Core MMS, memberships, Ling boundaries, claims, privacy, referral and commission training must be completed and assessed."],
  ["4", "Activation", "A permanent MMS Partner ID, certification, access and all activation controls must be complete before selling is enabled."],
];

const referralSteps = [
  ["Partner ID", "A permanent ID such as MMSP-1001 is issued through the controlled Partner registry after the required onboarding gates."],
  ["Referral link", "Once Active, the same ID can power a controlled link such as ?ref=MMSP-1001 and its matching QR code."],
  ["Verified sale", "Attribution is tied to the verified completed transaction, not a partner's manual sales claim."],
  ["Commission ledger", "Each eligible sale has its own transaction record, rule version, adjustment, approval and payout status."],
];

type JoinMMSPageProps = {
  searchParams?: { ref?: string | string[] };
};

export default function JoinMMSPage({ searchParams }: JoinMMSPageProps) {
  const applicationsEnabled = process.env.MMS_SALES_PARTNER_APPLICATIONS_ENABLED === "true";
  const rawReferrer = Array.isArray(searchParams?.ref) ? searchParams?.ref[0] : searchParams?.ref;
  const initialReferrerCode = normalisePartnerId(rawReferrer);

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
              <h2 className="mt-3 font-serif text-4xl text-navy">Performance-based and rule-controlled.</h2>
              <p className="mt-5 text-sm leading-6 text-warm-gray">Commission eligibility and rates are determined under the current approved MMS commission rule. Each eligible sale retains the exact rule version used, so later policy changes do not silently rewrite historical transactions.</p>
              <p className="mt-4 text-sm leading-6 text-warm-gray">Renewal commission may apply only where the approved rule permits it and the membership has satisfied the required utilisation, renewal, payment and compliance conditions.</p>
              <div className="mt-5 rounded-2xl border border-gold-light/60 bg-ivory p-5">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">Payout controls</p>
                <p className="mt-2 text-sm leading-6 text-navy">Commission is considered only after customer funds are verified and the applicable attribution, cancellation, refund, chargeback and compliance checks are complete.</p>
                <p className="mt-2 text-xs leading-5 text-warm-gray">The signed Sales Partner Agreement and current approved Finance policy govern qualification, rates and payout timing.</p>
              </div>
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
          <p className="mt-3 text-xs leading-5 text-warm-gray">Level progression is calculated from verified completed commercial activity under the applicable approved level rule. Qualification thresholds are not self-declared.</p>

          <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-soft" aria-labelledby="activation-heading">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">From approval to activation</p>
            <h2 id="activation-heading" className="mt-2 font-serif text-4xl text-navy">Approval alone does not make someone an active MMS representative.</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-4">
              {activationSteps.map(([number, title, text]) => (
                <div key={number} className="rounded-2xl bg-ivory p-5">
                  <p className="font-serif text-3xl text-gold">{number}</p>
                  <h3 className="mt-2 text-base font-semibold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-warm-gray">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]" aria-labelledby="referral-heading">
            <div className="rounded-[2rem] bg-navy p-8 text-ivory">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Referral & attribution</p>
              <h2 id="referral-heading" className="mt-2 font-serif text-4xl">One Partner ID. One traceable referral trail.</h2>
              <p className="mt-4 text-sm leading-6 text-ivory/72">The referral system is designed to recognise genuine verified sales while keeping customer clinical information completely outside the partner view.</p>
            </div>
            <div className="grid gap-3">
              {referralSteps.map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
                  <p className="text-sm font-semibold text-deep-green">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-warm-gray">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10 rounded-[2rem] border border-gold-light/50 bg-ivory p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Application process</p>
                <h2 className="mt-2 font-serif text-3xl text-navy">Apply → screening → approval → agreement → training → certification → activation.</h2>
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
            <SalesPartnerApplicationForm enabled={applicationsEnabled} initialReferrerCode={initialReferrerCode} />
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
