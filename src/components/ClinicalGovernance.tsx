const layers = [
  {
    label: "01",
    title: "Data quality",
    text: "Use validated measurements where possible, record context and avoid treating one isolated number as a conclusion.",
  },
  {
    label: "02",
    title: "Ling organises",
    text: "Ling can explain terminology, show trends and prepare questions without making a diagnosis.",
  },
  {
    label: "03",
    title: "Doctor interprets",
    text: "Clinical significance depends on history, symptoms, examination, prior results, medications and professional judgement.",
  },
  {
    label: "04",
    title: "Plan is documented",
    text: "Next steps should be explicit: what to do, what to watch, what to repeat and what does not need action yet.",
  },
];

export function ClinicalGovernance() {
  return (
    <section className="mms-science-grid bg-ivory px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="editorial-kicker mb-5 text-deep-green">Clinical governance</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              Intelligence is useful only when responsibility is clear.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">
              MMS should make the handoff between technology and medicine visible. Data can be organised digitally; interpretation and clinical decisions remain accountable to qualified professionals.
            </p>
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-gold/25 md:left-[2.1rem]" />
            <div className="grid gap-6">
              {layers.map((item) => (
                <article key={item.label} className="relative grid gap-4 pl-12 md:grid-cols-[0.18fr_0.72fr_1.1fr] md:items-start md:pl-0">
                  <span className="absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border border-gold/35 bg-[#f7f1e6] text-[0.6rem] font-semibold tracking-[0.14em] text-deep-green md:relative md:left-auto md:h-11 md:w-11">
                    {item.label}
                  </span>
                  <h3 className="font-serif text-3xl leading-tight text-navy">{item.title}</h3>
                  <p className="text-sm leading-7 text-warm-gray">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 border-t border-gold/25 pt-7 md:grid-cols-3">
          {[
            ["Transparent uncertainty", "Not every result needs action and not every emerging idea deserves recommendation."],
            ["Professional accountability", "Diagnosis, prescribing and treatment suitability stay under qualified clinical review."],
            ["Continuity", "What changes over time matters more when prior context remains visible and comparable."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-[1.25rem] bg-[#f7f3eb] p-5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-deep-green">{title}</p>
              <p className="mt-3 text-sm leading-6 text-warm-gray">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
