const systems = [
  { name: "Cardiovascular", mode: "Core", detail: "Blood pressure, lipids and cardiovascular risk interpreted in context." },
  { name: "Metabolic", mode: "Core", detail: "Glucose, weight, body composition and metabolic risk patterns." },
  { name: "Cancer risk", mode: "Risk-led", detail: "Screening choices shaped by age, history, sex and individual risk." },
  { name: "Brain & cognition", mode: "Context-led", detail: "Sleep, cognitive concerns and neurological risk reviewed in context." },
  { name: "Hormonal", mode: "Context-led", detail: "Hormonal testing guided by symptoms, history and clinical indication." },
  { name: "Inflammation", mode: "Context-led", detail: "Non-specific signals interpreted carefully rather than treated as diagnoses." },
  { name: "Musculoskeletal", mode: "Core", detail: "Strength, mobility and body composition as part of healthy ageing." },
  { name: "Biological ageing", mode: "Emerging", detail: "Exploratory markers viewed cautiously and never as a single definitive score." },
];

const modeStyle: Record<string, string> = {
  Core: "border-emerald-200/20 bg-emerald-100/[0.06] text-emerald-100/75",
  "Risk-led": "border-gold/25 bg-gold/10 text-gold-light",
  "Context-led": "border-white/12 bg-white/[0.045] text-ivory/58",
  Emerging: "border-[#9fb8c5]/20 bg-[#9fb8c5]/[0.07] text-[#c4d4dc]",
};

export function LongevityIntelligence() {
  const left = systems.slice(0, 4);
  const right = systems.slice(4);

  return (
    <section className="relative overflow-hidden bg-[#06151d] px-4 py-24 text-ivory md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_35%,rgba(199,167,106,0.12),transparent_28%),radial-gradient(circle_at_78%_68%,rgba(47,81,71,0.2),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <p className="editorial-kicker mb-5 text-gold-light">MMS Longevity Intelligence</p>
          <h2 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
            See your health as one connected system.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-ivory/68">
            One health picture. Eight connected domains. One doctor-led interpretation layer.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-5 border-t border-gold/25 pt-7 text-sm text-ivory/62">
            <div>
              <p className="font-serif text-3xl text-ivory">8</p>
              <p className="mt-1">health domains viewed together</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-ivory">1</p>
              <p className="mt-1">physician-led interpretation layer</p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold-light/72">Domain key</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Core", "Risk-led", "Context-led", "Emerging"].map((mode) => (
                <span key={mode} className={`rounded-full border px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] ${modeStyle[mode]}`}>
                  {mode}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.2rem] border border-gold/18 bg-white/[0.03] p-4 shadow-[0_40px_130px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-6">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.018),transparent)]" />
          <div className="relative grid gap-4 lg:grid-cols-[1fr_170px_1fr] lg:items-stretch">
            <div className="grid gap-3">
              {left.map((system, index) => (
                <article
                  key={system.name}
                  className="group rounded-[1.25rem] border border-white/10 bg-[#081b24]/88 p-4 transition duration-500 hover:-translate-y-0.5 hover:border-gold/32 hover:bg-[#0a222c]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light/55">0{index + 1}</span>
                    <span className={`rounded-full border px-2.5 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.12em] ${modeStyle[system.mode]}`}>
                      {system.mode}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-tight">{system.name}</h3>
                </article>
              ))}
            </div>

            <div className="relative hidden overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#071820] lg:block">
              <div className="absolute inset-x-1/2 top-12 bottom-12 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
              <div className="relative flex h-full min-h-[610px] flex-col items-center justify-between py-10">
                {[
                  ["Measure", "Signals"],
                  ["Context", "History"],
                  ["Trend", "Change"],
                  ["Review", "Doctor"],
                ].map(([title, text], index) => (
                  <div key={title} className="relative z-10 text-center">
                    <div className={`mx-auto grid rounded-full border bg-[#071820] shadow-[0_0_38px_rgba(199,167,106,0.10)] ${index === 1 ? "h-24 w-24 border-gold/45" : "h-14 w-14 border-gold/25"}`}>
                      <div className="self-center">
                        <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-gold-light">{title}</p>
                        <p className="mt-1 text-[0.58rem] text-ivory/40">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {right.map((system, index) => (
                <article
                  key={system.name}
                  className="group rounded-[1.25rem] border border-white/10 bg-[#081b24]/88 p-4 transition duration-500 hover:-translate-y-0.5 hover:border-gold/32 hover:bg-[#0a222c]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light/55">0{index + 5}</span>
                    <span className={`rounded-full border px-2.5 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.12em] ${modeStyle[system.mode]}`}>
                      {system.mode}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-tight">{system.name}</h3>
                </article>
              ))}
            </div>
          </div>

          <div className="relative mt-4 grid gap-3 rounded-[1.25rem] border border-gold/18 bg-gold/[0.06] p-4 text-sm sm:grid-cols-[0.42fr_1.58fr] sm:items-center">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light">Interpretation rule</p>
            <p className="leading-6 text-ivory/58">
              A signal is not a diagnosis. Context and trend determine what deserves attention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
