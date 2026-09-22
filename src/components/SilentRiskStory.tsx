const signals = [
  ["Blood pressure", "Can change quietly"],
  ["Glucose", "May shift before symptoms"],
  ["Lipids", "Risk can accumulate"],
  ["Body composition", "Trends matter"],
];

export function SilentRiskStory() {
  return (
    <section className="relative overflow-hidden bg-[#f3eee5] px-4 py-20 md:py-28">
      <div className="absolute inset-0 mms-science-grid opacity-55" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <div>
          <p className="editorial-kicker mb-5 text-deep-green">Before symptoms</p>
          <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            You can feel well while your health is already changing.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-warm-gray">
            Some health risks develop quietly. Regular, appropriate monitoring can help reveal changes that deserve attention before they become harder to ignore.
          </p>
          <p className="mt-6 max-w-xl border-l border-gold/45 pl-5 text-sm leading-6 text-warm-gray">
            The goal is not more testing. It is knowing what to watch, what to repeat and when a doctor should review it.
          </p>
        </div>

        <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#07151d] p-5 text-ivory shadow-[0_36px_110px_rgba(11,26,46,0.18)] md:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(199,167,106,0.16),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(47,81,71,0.34),transparent_30%)]" />
          <div className="relative grid min-h-[450px] place-items-center">
            <div className="relative grid h-56 w-56 place-items-center rounded-full border border-gold/25 bg-white/[0.035] sm:h-64 sm:w-64">
              <div className="absolute inset-5 rounded-full border border-gold/20 mms-risk-orbit" />
              <div className="absolute inset-12 rounded-full border border-white/10" />
              <div className="relative text-center">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.19em] text-gold-light">You feel fine</p>
                <p className="mt-3 font-serif text-3xl">But trends may be changing.</p>
              </div>
            </div>

            {signals.map(([title, text], index) => {
              const positions = [
                "left-1 top-4 sm:left-5",
                "right-1 top-16 sm:right-5",
                "left-1 bottom-14 sm:left-5",
                "right-1 bottom-2 sm:right-5",
              ];
              return (
                <div
                  key={title}
                  className={`absolute w-[150px] rounded-[1rem] border border-white/10 bg-white/[0.055] p-3 backdrop-blur-md ${positions[index]}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold mms-signal-pulse" />
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-gold-light">{title}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-ivory/56">{text}</p>
                </div>
              );
            })}
          </div>

          <div className="relative mt-2 rounded-[1.2rem] bg-[#f7f1e6] px-5 py-4 text-navy">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-deep-green">MMS principle</p>
            <p className="mt-2 text-sm leading-6 text-warm-gray">
              Monitor the right signals early enough to make calm, informed decisions—not rushed decisions after a health scare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
