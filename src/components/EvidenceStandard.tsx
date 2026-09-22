import Link from "next/link";

const standards = [
  {
    number: "01",
    title: "Guideline-led",
    text: "Screening and prevention should begin with recognised clinical guidance, then be adapted to the individual.",
  },
  {
    number: "02",
    title: "Context before conclusion",
    text: "A laboratory value, image or wearable signal becomes meaningful only when interpreted with history, symptoms and risk.",
  },
  {
    number: "03",
    title: "Evidence has levels",
    text: "Established care, promising evidence and emerging science should never be presented as if they carry the same certainty.",
  },
  {
    number: "04",
    title: "Trends matter",
    text: "Repeated measurements can add context that a single snapshot cannot, especially when interpreted by a clinician.",
  },
];

export function EvidenceStandard() {
  return (
    <section className="mms-science-grid relative overflow-hidden bg-[#06151d] px-4 py-24 text-ivory md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(199,167,106,0.13),transparent_26%),radial-gradient(circle_at_88%_74%,rgba(47,81,71,0.22),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-5 text-gold-light">The MMS evidence standard</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
              Science before spectacle.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ivory/68">
              Know what is established. Know what is uncertain. Know when a doctor needs to decide.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_36px_120px_rgba(0,0,0,0.24)] backdrop-blur-sm md:p-7">
            <div className="grid gap-px overflow-hidden rounded-[1.35rem] border border-white/10 sm:grid-cols-2">
              {standards.map((item) => (
                <article key={item.number} className="bg-[#0a2029]/92 p-5 md:p-6">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-light/72">{item.number}</p>
                  <h3 className="mt-3 font-serif text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ivory/58">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-xs leading-5 text-ivory/42">
            Evidence changes. Personal decisions still require context and professional judgement.
          </p>
          <Link
            href="/science-evidence"
            className="inline-flex text-sm font-semibold text-gold-light underline decoration-gold/45 underline-offset-8"
          >
            Explore Science & Evidence
          </Link>
        </div>
      </div>
    </section>
  );
}
