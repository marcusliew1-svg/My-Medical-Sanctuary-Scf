const systems = [
  { name: "Cardiovascular", detail: "Heart, vessels, lipid and blood-pressure context" },
  { name: "Metabolic", detail: "Glucose, insulin, weight and energy regulation" },
  { name: "Cancer risk", detail: "Age-, history- and suitability-led screening pathways" },
  { name: "Brain & cognition", detail: "Cognitive health, sleep and neurological risk context" },
  { name: "Hormonal", detail: "Hormonal patterns interpreted in clinical context" },
  { name: "Inflammation", detail: "Signals that may deserve deeper medical review" },
  { name: "Musculoskeletal", detail: "Strength, mobility, body composition and resilience" },
  { name: "Biological ageing", detail: "Longitudinal markers viewed as trends, not a single score" },
];

export function LongevityIntelligence() {
  return (
    <section className="relative overflow-hidden bg-[#06151d] px-4 py-20 text-[#f7f2e8] md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_45%,rgba(212,175,55,0.13),transparent_28%),radial-gradient(circle_at_70%_22%,rgba(64,112,103,0.16),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="editorial-kicker mb-5 text-[#dfc66b]">MMS Longevity Intelligence</p>
          <h2 className="text-balance font-serif text-4xl leading-[1.04] md:text-6xl">
            See your health as one connected system.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#f7f2e8]/70">
            Screening is only the beginning. MMS brings together the signals that matter, physician interpretation
            and longitudinal follow-through so your health story becomes clearer over time.
          </p>
          <div className="mt-9 grid grid-cols-2 gap-5 border-t border-[#dfc66b]/25 pt-7 text-sm text-[#f7f2e8]/70">
            <div>
              <p className="text-2xl font-serif text-[#f7f2e8]">8</p>
              <p className="mt-1">health domains viewed together</p>
            </div>
            <div>
              <p className="text-2xl font-serif text-[#f7f2e8]">1</p>
              <p className="mt-1">physician-led picture of you</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[620px] overflow-hidden rounded-[2.2rem] border border-[#dfc66b]/20 bg-white/[0.035] p-5 shadow-[0_36px_120px_rgba(0,0,0,0.28)] backdrop-blur-sm md:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#dfc66b]/15" />
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#dfc66b]/20" />
            <div className="absolute left-1/2 top-1/2 h-[185px] w-[185px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#dfc66b]/30" />
            <div className="absolute left-1/2 top-1/2 h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dfc66b]/10 shadow-[0_0_70px_rgba(212,175,55,0.16)]" />
          </div>

          <div className="relative z-10 grid min-h-[560px] grid-cols-2 content-between gap-4">
            {systems.map((system, index) => (
              <div
                key={system.name}
                className={`group max-w-[250px] rounded-2xl border border-white/10 bg-[#071b24]/80 p-4 transition duration-500 hover:-translate-y-1 hover:border-[#dfc66b]/45 hover:bg-[#0a222c] ${
                  index % 2 ? "justify-self-end text-right" : ""
                }`}
              >
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#dfc66b]">
                  0{index + 1}
                </span>
                <h3 className="mt-2 font-serif text-xl leading-tight">{system.name}</h3>
                <p className="mt-2 text-xs leading-5 text-[#f7f2e8]/55 transition group-hover:text-[#f7f2e8]/75">
                  {system.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-[#dfc66b]/35 bg-[#07151d]/95 shadow-[0_0_90px_rgba(212,175,55,0.18)]">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#dfc66b]">Your</p>
                <p className="mt-1 font-serif text-lg">Health</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
