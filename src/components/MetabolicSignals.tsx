const signals = [
  ["Body composition", "Weight alone cannot show muscle, fat distribution or change in lean mass."],
  ["Glucose regulation", "Patterns in glucose and metabolic risk can matter even when appearance changes are modest."],
  ["Sleep & recovery", "Sleep duration, quality and recovery can influence appetite, energy and adherence."],
  ["Medication & hormones", "Some medicines and endocrine conditions can affect weight and should be reviewed clinically."],
  ["Blood pressure & lipids", "Cardiometabolic risk can improve or worsen independently of the number on the scale."],
  ["Lifestyle context", "Food environment, stress, work patterns, travel and activity shape what is sustainable."],
];

export function MetabolicSignals() {
  return (
    <section className="bg-[#f1ece2] px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Metabolic context</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              The scale is one signal. It is not the whole diagnosis.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-warm-gray">
              A useful weight conversation looks at health risk, function and what is changing underneath the number—not only kilograms lost.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {signals.map(([title, text], index) => (
              <article key={title} className="rounded-[1.35rem] border border-gold/20 bg-white/85 p-5 shadow-[0_18px_52px_rgba(11,26,46,0.05)]">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-deep-green/55">0{index + 1}</p>
                <h3 className="mt-3 font-serif text-2xl text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-warm-gray">{text}</p>
              </article>
            ))}
          </div>
        </div>
        <p className="mt-8 border-t border-gold/25 pt-5 text-xs leading-5 text-warm-gray/80">
          Weight-management decisions should consider symptoms, medical history, current medication, metabolic risk and professional suitability review. This section is educational and not a treatment recommendation.
        </p>
      </div>
    </section>
  );
}
