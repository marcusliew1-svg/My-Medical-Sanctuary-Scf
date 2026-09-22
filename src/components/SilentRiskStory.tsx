import Image from "next/image";

export function SilentRiskStory() {
  return (
    <section className="overflow-hidden bg-[#f3eee5] px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:items-center">
        <div className="relative z-10">
          <p className="editorial-kicker mb-5 text-deep-green">Before symptoms</p>
          <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            You can feel well while your health is already changing.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-warm-gray">
            Some health risks develop quietly. The point is to know what to watch before a health scare forces the conversation.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Blood pressure", "Glucose", "Lipids", "Body composition"].map((item) => (
              <span key={item} className="rounded-full border border-gold/30 bg-white/65 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-deep-green">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mms-cinematic-frame relative aspect-[16/10] overflow-hidden rounded-[2rem] shadow-[0_36px_110px_rgba(11,26,46,0.18)] md:aspect-[16/9]">
          <Image
            src="/mms-silent-risk-v2.webp"
            alt="Asian woman appearing well while subtle health signals and monitoring data surround her."
            fill
            className="mms-cinematic-image object-cover object-center"
            sizes="(min-width: 1024px) 64vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/12 via-transparent to-transparent" />
          <div className="mms-visual-glow absolute left-[52%] top-[42%] h-24 w-24 rounded-full bg-gold/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
