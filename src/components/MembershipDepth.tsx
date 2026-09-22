import Link from "next/link";

const tiers = [
  {
    name: "Ascend",
    number: "01",
    promise: "Know where you stand.",
    depth: "Foundation",
    description: "A structured starting point for preventive screening, baseline clarity and physician review.",
  },
  {
    name: "Evolve",
    number: "02",
    promise: "Understand what is changing.",
    depth: "Optimisation",
    description: "Closer coordination around metabolic health, lifestyle, vitality and ongoing optimisation.",
  },
  {
    name: "Eterna",
    number: "03",
    promise: "Take control of long-term health.",
    depth: "Continuity",
    description: "Deeper preventive planning, repeated review and continuity across a longer health horizon.",
  },
  {
    name: "Pinnacle",
    number: "04",
    promise: "The highest level of health oversight.",
    depth: "Private",
    description: "Highly coordinated private care and continuity, subject to capacity and clinical suitability.",
  },
];

export function MembershipDepth() {
  return (
    <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="editorial-kicker mb-4 text-gold-light">Memberships</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              Four levels of one health relationship.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-ivory/68">
              The difference is not simply more tests. It is increasing depth of assessment, continuity and coordination.
            </p>
            <Link
              href="/memberships"
              className="mt-8 inline-flex text-sm font-semibold text-gold-light underline decoration-gold/50 underline-offset-8"
            >
              Compare memberships
            </Link>
          </div>

          <div className="border-t border-white/10">
            {tiers.map((tier, index) => (
              <Link
                key={tier.name}
                href="/memberships"
                className="group grid gap-5 border-b border-white/10 py-7 transition duration-500 hover:bg-white/[0.035] md:grid-cols-[0.18fr_0.52fr_1.3fr] md:items-start md:px-5"
              >
                <div className="flex items-center gap-3 md:block">
                  <span className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-gold-light/70">{tier.number}</span>
                  <span className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-ivory/38 md:mt-2 md:block">{tier.depth}</span>
                </div>
                <div>
                  <h3 className="font-serif text-3xl transition group-hover:text-gold-light md:text-4xl">{tier.name}</h3>
                  <p className="mt-2 text-sm text-ivory/55">Level {index + 1} of 4</p>
                </div>
                <div>
                  <p className="font-serif text-2xl leading-tight md:text-3xl">{tier.promise}</p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-ivory/58">{tier.description}</p>
                  <span className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-gold-light opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100">
                    Explore level →
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
