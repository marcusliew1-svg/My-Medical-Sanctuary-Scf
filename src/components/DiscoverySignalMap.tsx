const inputs = [
  {
    label: "What changed",
    title: "Symptoms & patterns",
    text: "Energy, sleep, pain, recovery, weight, mood or other changes that prompted the conversation.",
  },
  {
    label: "What shaped risk",
    title: "History & context",
    text: "Personal history, family history, medication, life stage, work, travel and prior results.",
  },
  {
    label: "What can be measured",
    title: "Screening & signals",
    text: "Selected measurements should answer a question rather than simply add more data.",
  },
  {
    label: "What matters to you",
    title: "Goals & priorities",
    text: "Prevention, longevity, function, confidence, performance or a specific concern.",
  },
];

export function DiscoverySignalMap() {
  return (
    <section className="bg-[#f1ece2] px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="editorial-kicker mb-5 text-deep-green">Discovery signal map</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              Good questions come before more testing.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">
              MMS discovery should connect what changed, what shaped your risk, what can be measured and what matters to you before deciding what deserves clinical attention.
            </p>

            <div className="mt-8 rounded-[1.4rem] border border-gold/25 bg-white/80 p-5 shadow-[0_22px_64px_rgba(11,26,46,0.06)]">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-deep-green">Clinical output</p>
              <p className="mt-3 font-serif text-2xl text-navy">A clearer starting picture.</p>
              <p className="mt-3 text-sm leading-6 text-warm-gray">
                Discovery does not diagnose. It helps organise what should be asked, measured, reviewed or simply watched.
              </p>
            </div>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-2">
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20 lg:block" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-deep-green/15 lg:block" />

            {inputs.map((item, index) => (
              <article
                key={item.title}
                className="relative z-10 min-h-[220px] rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-[0_22px_66px_rgba(11,26,46,0.07)] md:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-deep-green/55">0{index + 1}</span>
                  <span className="rounded-full border border-gold/25 bg-[#f7f1e6] px-2.5 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-deep-green/70">
                    {item.label}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-3xl text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-warm-gray">{item.text}</p>
              </article>
            ))}

            <div className="relative z-20 col-span-full mx-auto -mt-1 grid max-w-md rounded-[1.4rem] border border-gold/30 bg-[#07151d] px-6 py-5 text-center text-ivory shadow-[0_30px_90px_rgba(11,26,46,0.18)] sm:-mt-10">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light">Physician review</p>
              <p className="mt-2 font-serif text-2xl">What actually matters?</p>
              <p className="mt-2 text-xs leading-5 text-ivory/52">
                Clinical meaning depends on context, not the number of tests performed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
