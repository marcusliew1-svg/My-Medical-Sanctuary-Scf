const checks = [
  ["Clinical reason", "What problem or goal is the infusion actually intended to address?"],
  ["Evidence", "Is there evidence for this formulation and indication, or mainly marketing tradition?"],
  ["Suitability", "Do history, kidney function, cardiovascular status, medication or other factors change the risk?"],
  ["Dose & composition", "The ingredients, concentration and dose matter more than the label on the package."],
  ["Monitoring", "What should be checked before, during or after treatment if clinically relevant?"],
];

export function SupportiveTherapyBoundary() {
  return (
    <section className="bg-[#06151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="editorial-kicker mb-4 text-gold-light">Evidence & suitability</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              “IV therapy” is not one evidence category.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/66">
              The indication, formulation, dose and patient context determine whether an infusion is medically sensible. A premium experience should make that distinction clear before treatment.
            </p>
          </div>
          <div className="border-t border-white/10">
            {checks.map(([title, text], index) => (
              <div key={title} className="grid gap-3 border-b border-white/10 py-5 md:grid-cols-[0.15fr_0.55fr_1.3fr]">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-gold-light/55">0{index + 1}</span>
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="text-sm leading-6 text-ivory/58">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-8 max-w-4xl border-l border-gold/35 pl-5 text-xs leading-5 text-ivory/44">
          MMS should not imply that a branded infusion has a universal preventive, anti-ageing or performance benefit. Doctor assessment and treatment-specific evidence remain essential.
        </p>
      </div>
    </section>
  );
}
