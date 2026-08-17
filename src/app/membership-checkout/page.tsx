import type { Metadata } from "next";
import Link from "next/link";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Membership Checkout",
  description: "Prepare an MMS membership payment securely through the approved checkout flow.",
  robots: { index: false, follow: false },
};

const membershipPositioning: Record<string, string> = {
  Ascend: "Essential Prevention",
  Evolve: "Active Optimisation",
  Eterna: "Longevity Continuity",
  Pinnacle: "Private Coordination",
};

export default function MembershipCheckoutPage() {
  const checkoutEnabled = process.env.MMS_STRIPE_CHECKOUT_ENABLED === "true";

  return (
    <main>
      <section className="bg-navy px-4 pb-16 pt-32 text-ivory md:pb-20 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Secure membership payment</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Complete your MMS membership when you are ready.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/72">Payment is the final commercial step after you have understood the membership and any required suitability or professional review has been completed.</p>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {memberships.map((membership) => (
              <article key={membership.name} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">{membershipPositioning[membership.name]}</p>
                <h2 className="mt-3 font-serif text-3xl text-navy">{membership.name}</h2>
                <p className="mt-2 text-sm font-semibold text-deep-green">{membership.tagline}</p>
                <p className="mt-5 text-sm leading-6 text-warm-gray">{membership.whoItSuits}</p>
                <div className="mt-7 border-t border-black/5 pt-5">
                  {checkoutEnabled ? (
                    <span className="inline-flex rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy">Secure checkout enabled</span>
                  ) : (
                    <span className="inline-flex rounded-full border border-gold-light bg-ivory px-5 py-3 text-sm font-semibold text-navy">Online payment opening soon</span>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[1.75rem] bg-deep-green p-7 text-ivory md:p-9">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Not sure which membership?</p>
                <h2 className="mt-2 font-serif text-3xl md:text-4xl">Start with your goals, not a payment button.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-ivory/70">Ling can explain the four pathways, and the MMS team can help you confirm the appropriate next step before payment.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/ling" className="rounded-full bg-gold-light px-5 py-3 text-sm font-semibold text-navy">Ask Ling</Link>
                <Link href="/contact" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">Contact MMS</Link>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs leading-5 text-warm-gray">No card details are collected on this page. When enabled, payment will be processed through the approved secure payment flow. Membership does not guarantee medical outcomes, and clinical decisions remain subject to professional review and individual suitability.</p>
        </div>
      </section>
    </main>
  );
}
