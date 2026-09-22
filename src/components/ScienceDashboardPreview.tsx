const trendPath = "M4 74 C38 62, 56 67, 86 50 S140 42, 166 35 S214 30, 244 18";

const metrics = [
  ["Cardiovascular", "Review trend", "Established"],
  ["Metabolic", "Stable", "Established"],
  ["Recovery", "Watch", "Context-led"],
  ["Biological ageing", "Explore", "Emerging"],
];

export function ScienceDashboardPreview() {
  return (
    <section className="overflow-hidden bg-[#f1ece2] px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <p className="editorial-kicker mb-5 text-deep-green">Longitudinal health intelligence</p>
          <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            One result is a snapshot. A trend tells a better story.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">
            MMS is designed around repeated context: what changed, what stayed stable, what deserves review and how certain the evidence is.
          </p>
          <div className="mt-8 grid gap-4 border-t border-gold/30 pt-6 sm:grid-cols-3">
            {[
              ["Measure", "Validated signals"],
              ["Interpret", "Clinical context"],
              ["Follow", "Longitudinal change"],
            ].map(([title, text]) => (
              <div key={title}>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-deep-green">{title}</p>
                <p className="mt-2 text-sm text-warm-gray">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-[#07151d] p-4 text-ivory shadow-[0_40px_120px_rgba(11,26,46,0.2)] md:p-6">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative rounded-[1.6rem] border border-white/10 bg-[#0a1f29] p-5 md:p-7">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold-light">Illustrative MMS health view</p>
                <h3 className="mt-2 font-serif text-3xl">Longitudinal overview</h3>
              </div>
              <p className="text-xs text-ivory/40">Example interface • no patient data</p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold-light/75">Signal over time</p>
                    <p className="mt-2 font-serif text-2xl">Cardiometabolic pattern</p>
                  </div>
                  <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-gold-light">
                    Review
                  </span>
                </div>

                <div className="mt-8 rounded-[1rem] border border-white/8 bg-[#071820] p-4">
                  <svg viewBox="0 0 248 92" role="img" aria-label="Illustrative longitudinal trend line" className="h-36 w-full">
                    <defs>
                      <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#C7A76A" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#C7A76A" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[18, 40, 62, 84].map((y) => (
                      <line key={y} x1="4" x2="244" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    ))}
                    <path d={trendPath + " L244 88 L4 88 Z"} fill="url(#trendFill)" />
                    <path d={trendPath} fill="none" stroke="#E2CEA0" strokeWidth="2.2" strokeLinecap="round" className="mms-trend-line" />
                    {[["4","74"],["86","50"],["166","35"],["244","18"]].map(([x,y]) => (
                      <circle key={x} cx={x} cy={y} r="3.2" fill="#E2CEA0" className="mms-trend-point" />
                    ))}
                  </svg>
                  <div className="flex justify-between text-[0.56rem] uppercase tracking-[0.14em] text-ivory/30">
                    <span>Earlier</span><span>Now</span>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-ivory/45">
                  Direction alone is not a diagnosis. History, measurement quality, medications, symptoms and clinician review still matter.
                </p>
              </div>

              <div className="grid gap-3">
                {metrics.map(([name, state, evidence]) => (
                  <div key={name} className="rounded-[1.15rem] border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-xl">{name}</p>
                        <p className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-gold-light">{state}</p>
                      </div>
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.52rem] uppercase tracking-[0.12em] text-ivory/42">
                        {evidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 rounded-[1.2rem] bg-[#f7f1e6] p-4 text-navy sm:grid-cols-[0.72fr_1.28fr] sm:items-center">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-deep-green">Clinical handoff</p>
              <p className="text-sm leading-6 text-warm-gray">
                Ling can explain the pattern. Your doctor determines whether it matters and what, if anything, should happen next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
