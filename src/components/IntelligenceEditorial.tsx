import Link from "next/link";

const topics = [
  ["Preventive health", "Understand risk before symptoms define the conversation."],
  ["Longevity science", "Separate useful evidence from hype and overpromising."],
  ["Treatments explained", "Know what a therapy is trying to address before discussing suitability."],
  ["Metabolic health", "Connect energy, body composition, glucose and lifestyle in context."],
];

export function IntelligenceEditorial() {
  return (
    <section className="overflow-hidden bg-[#faf7f1] px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-36">
            <p className="editorial-kicker mb-5 text-deep-green">Health intelligence</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              Understand the signal. Respect the uncertainty.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-warm-gray">
              MMS content is designed to help people become better prepared for clinical conversations—not to turn education into diagnosis.
            </p>
            <Link
              href="/insights"
              className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/60 underline-offset-8"
            >
              Explore Health Intelligence
            </Link>
          </div>

          <div className="border-t border-gold/25">
            {topics.map(([title, text], index) => (
              <Link
                key={title}
                href="/insights"
                className="group grid gap-5 border-b border-gold/20 py-7 transition md:grid-cols-[0.18fr_0.82fr_1.2fr] md:px-3"
              >
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-deep-green/55">0{index + 1}</span>
                <h3 className="font-serif text-3xl leading-tight text-navy transition group-hover:text-deep-green md:text-4xl">{title}</h3>
                <div>
                  <p className="text-sm leading-6 text-warm-gray">{text}</p>
                  <span className="mt-4 inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-deep-green/55 transition group-hover:translate-x-1 group-hover:text-deep-green">
                    Read with Ling →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
