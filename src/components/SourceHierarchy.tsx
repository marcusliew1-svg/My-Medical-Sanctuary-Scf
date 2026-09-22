const hierarchy = [
  {
    rank: "01",
    title: "Clinical guidelines & consensus standards",
    text: "Recognised local and international guidance provides the strongest starting framework for routine preventive decisions.",
    width: "w-full",
  },
  {
    rank: "02",
    title: "Systematic reviews & high-quality trials",
    text: "Useful for understanding treatment effects, limitations and where evidence is consistent or mixed.",
    width: "w-[92%]",
  },
  {
    rank: "03",
    title: "Well-designed observational evidence",
    text: "Can reveal associations and long-term patterns, but usually carries more uncertainty about cause and effect.",
    width: "w-[84%]",
  },
  {
    rank: "04",
    title: "Early clinical & mechanistic evidence",
    text: "Helpful for generating hypotheses and understanding plausibility, but not enough on its own to promise outcomes.",
    width: "w-[76%]",
  },
  {
    rank: "05",
    title: "Testimonials, influencer claims & vendor marketing",
    text: "May be useful for understanding interest or experience, but should not be treated as clinical proof.",
    width: "w-[68%]",
  },
];

export function SourceHierarchy() {
  return (
    <section className="bg-[#f1ece2] px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
          <div>
            <p className="editorial-kicker mb-5 text-deep-green">Source hierarchy</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              Not all evidence deserves equal weight.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">
              MMS should make the quality of the source visible. A new idea can be interesting without being clinically established, and a compelling story is not the same thing as proof.
            </p>
          </div>

          <div className="grid gap-3">
            {hierarchy.map((item, index) => (
              <article
                key={item.rank}
                className={\`\${item.width} rounded-[1.35rem] border p-5 transition md:p-6 \${
                  index === 0
                    ? "border-deep-green/18 bg-[#e8efeb] shadow-[0_20px_64px_rgba(11,26,46,0.06)]"
                    : index === hierarchy.length - 1
                      ? "border-[#b97868]/20 bg-[#f7eee9]"
                      : "border-gold/20 bg-white/80"
                }\`}
              >
                <div className="grid gap-3 sm:grid-cols-[0.16fr_0.7fr_1.14fr] sm:items-start">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-deep-green/55">{item.rank}</span>
                  <h3 className="font-serif text-2xl leading-tight text-navy">{item.title}</h3>
                  <p className="text-sm leading-6 text-warm-gray">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-gold/25 pt-7 sm:grid-cols-3">
          {[
            ["Ask", "What kind of evidence is this?"],
            ["Check", "Does it apply to this person and this indication?"],
            ["Decide", "What level of certainty is reasonable?"],
          ].map(([title, text]) => (
            <div key={title}>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-deep-green">{title}</p>
              <p className="mt-2 text-sm text-warm-gray">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
