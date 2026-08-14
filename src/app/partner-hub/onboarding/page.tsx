import { onboardingSteps, partnerSummary } from "@/data/partnerHub";

export default function PartnerOnboardingPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Partner onboarding</p>
        <h1 className="mt-3 font-serif text-4xl text-navy">Certification before selling.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-warm-gray">
          MMS keeps partner access controlled. Application, identity checks, agreement and training must be completed before certification and an active Partner Code are issued.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {onboardingSteps.map((step, index) => (
          <article key={step.label} className="rounded-[1.5rem] border border-gold-light/30 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Step {index + 1}</span>
              <span className="rounded-full bg-warm-white px-3 py-1 text-xs font-semibold text-deep-green">{step.status}</span>
            </div>
            <h2 className="mt-4 font-serif text-2xl text-navy">{step.label}</h2>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] bg-navy p-8 text-ivory shadow-premium">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">Current profile</p>
            <h2 className="mt-3 font-serif text-3xl">{partnerSummary.name}</h2>
            <p className="mt-3 text-ivory/75">Partner Code: {partnerSummary.code}</p>
            <p className="mt-1 text-ivory/75">Tier: {partnerSummary.tier}</p>
          </div>
          <div className="rounded-2xl bg-white/8 p-5 text-sm leading-7 text-ivory/80">
            <strong className="block text-ivory">Control rule</strong>
            Partners may view training materials before certification, but commission-bearing sales should only be enabled after certification and an active Partner Code are confirmed.
          </div>
        </div>
      </section>
    </div>
  );
}
