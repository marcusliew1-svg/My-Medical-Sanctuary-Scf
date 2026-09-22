import Image from "next/image";

export function JourneyVisual() {
  return (
    <section className="overflow-hidden bg-ivory px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-5 text-deep-green">Your MMS plan</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              Five steps. One health relationship.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-warm-gray">
            Discover what matters. Measure the right signals. Understand them with your doctor. Keep monitoring what changes.
          </p>
        </div>

        <div className="mms-cinematic-frame relative mt-12 aspect-[16/10] overflow-hidden rounded-[2rem] border border-gold/20 shadow-[0_34px_100px_rgba(11,26,46,0.12)] md:aspect-[16/9]">
          <Image
            src="/mms-five-step-journey-v2.webp"
            alt="Asian woman moving through the MMS five-step health journey: Discover, Measure, Understand, Optimise and Monitor."
            fill
            className="mms-cinematic-image object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/10 via-transparent to-transparent" />
          <div className="mms-path-light absolute bottom-[13%] left-[10%] h-px w-[78%] bg-gradient-to-r from-transparent via-gold-light/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}

export function HealthTrendsVisual() {
  return (
    <section className="overflow-hidden bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:items-center">
          <div>
            <p className="editorial-kicker mb-5 text-gold-light">Monitor over time</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
              One result is a snapshot. Trends tell the story.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/62">
              Follow the signals that matter, compare them over time, and bring meaningful change back into a doctor-led conversation.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Baseline", "Trend", "Review", "Follow-up"].map((item) => (
                <span key={item} className="rounded-full border border-gold/20 bg-white/[0.045] px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-gold-light">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mms-cinematic-frame relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_42px_120px_rgba(0,0,0,0.28)] md:aspect-[16/9]">
            <Image
              src="/mms-health-trends-v2.webp"
              alt="Asian couple reviewing longitudinal health trends with a doctor using a visual monitoring dashboard."
              fill
              className="mms-cinematic-image object-cover object-center"
              sizes="(min-width: 1024px) 64vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/14 via-transparent to-transparent" />
            <div className="mms-visual-glow absolute right-[23%] top-[38%] h-28 w-28 rounded-full bg-gold/16 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
