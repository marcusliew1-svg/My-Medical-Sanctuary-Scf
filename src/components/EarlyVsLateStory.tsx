const early = [
  ["Check", "Understand your baseline"],
  ["Watch", "Follow meaningful trends"],
  ["Review", "Discuss changes with a doctor"],
  ["Act", "Adjust when there is a reason"],
];

const late = [
  ["Symptoms", "Something finally feels wrong"],
  ["Urgency", "Decisions happen under pressure"],
  ["Complexity", "More intensive investigations may be needed"],
  ["Treatment", "Care can become more disruptive and costly"],
];

export function EarlyVsLateStory() {
  return (
    <section className="overflow-hidden bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-5 text-gold-light">Two very different health journeys</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
              Calm monitoring now can mean more options later.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ivory/66">
            Earlier monitoring cannot prevent every illness. But finding meaningful changes sooner can create time for review, follow-up and action before a situation becomes urgent.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-white/[0.035] p-6 md:p-8">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-gold-light via-gold to-transparent" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold-light">Monitor early</p>
                <h3 className="mt-2 font-serif text-4xl">Planned. Measured. Calm.</h3>
              </div>
              <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.13em] text-gold-light">
                More time
              </span>
            </div>

            <div className="mt-8 grid gap-3">
              {early.map(([title, text], index) => (
                <div key={title} className="grid grid-cols-[44px_1fr] gap-4 rounded-[1.15rem] bg-white/[0.045] p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/25 text-[0.58rem] font-semibold text-gold-light">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="font-serif text-2xl">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-ivory/54">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[2rem] border border-[#a96b5d]/22 bg-[#241819]/70 p-6 md:p-8">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#d29887] via-[#a96b5d] to-transparent" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[#e0b3a5]">React later</p>
                <h3 className="mt-2 font-serif text-4xl">Urgent. Disruptive. Harder.</h3>
              </div>
              <span className="rounded-full border border-[#d29887]/20 bg-[#d29887]/10 px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.13em] text-[#e0b3a5]">
                Less time
              </span>
            </div>

            <div className="mt-8 grid gap-3">
              {late.map(([title, text], index) => (
                <div key={title} className="grid grid-cols-[44px_1fr] gap-4 rounded-[1.15rem] bg-white/[0.035] p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-[#d29887]/20 text-[0.58rem] font-semibold text-[#e0b3a5]">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="font-serif text-2xl">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-ivory/50">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 md:grid-cols-[0.6fr_1.4fr] md:items-center">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold-light">The point</p>
          <p className="text-sm leading-6 text-ivory/52">
            Prevention is not a guarantee against disease. It is a way to reduce avoidable delay, create earlier opportunities for review and potentially avoid some of the disruption that comes with discovering a problem late.
          </p>
        </div>
      </div>
    </section>
  );
}
