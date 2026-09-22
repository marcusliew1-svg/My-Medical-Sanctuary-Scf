const levels = [
  {
    level: "01",
    label: "Established",
    title: "Standard preventive and clinical care",
    text: "Approaches supported by mature guidelines, routine clinical use and clearer benefit–risk expectations.",
  },
  {
    level: "02",
    label: "Evidence-supported",
    title: "Useful for selected people",
    text: "Approaches with meaningful evidence that still depend strongly on indication, patient selection, clinician judgement and context.",
  },
  {
    level: "03",
    label: "Emerging",
    title: "Promising, but not settled",
    text: "Newer diagnostics or interventions where evidence, long-term outcomes, regulation or appropriate use may still be evolving.",
  },
  {
    level: "04",
    label: "Investigational",
    title: "Research, not routine care",
    text: "Interventions that should be discussed with explicit uncertainty, regulatory awareness and no implied outcome promise.",
  },
];

export function EvidenceLadder() {
  return (
    <section className="bg-[#06151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr]">
          <div>
            <p className="editorial-kicker mb-4 text-gold-light">Evidence hierarchy</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              Not every health innovation deserves the same confidence.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/66">
              MMS should make the level of certainty visible before discussing suitability. That protects trust and makes advanced care easier to understand.
            </p>
          </div>

          <div className="border-t border-white/10">
            {levels.map((item) => (
              <div
                key={item.level}
                className="grid gap-4 border-b border-white/10 py-6 md:grid-cols-[0.16fr_0.44fr_1.4fr] md:items-start"
              >
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-light/65">{item.level}</span>
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-light">{item.label}</p>
                  <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
                </div>
                <p className="text-sm leading-6 text-ivory/58">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 max-w-4xl border-l border-gold/35 pl-5 text-xs leading-5 text-ivory/45">
          This is an MMS communication framework, not a substitute for treatment-specific evidence review. The classification of any individual test or intervention should be based on current evidence, regulation and professional assessment.
        </p>
      </div>
    </section>
  );
}
