const examples = [
  {
    title: "Blood pressure",
    signal: "Established screening",
    text: "Recognised preventive guidance supports screening adults for hypertension, with confirmation outside the clinic before treatment when appropriate.",
    source: "USPSTF",
    href: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hypertension-in-adults-screening",
  },
  {
    title: "Glucose risk",
    signal: "Risk-led screening",
    text: "Screening for prediabetes and type 2 diabetes is recommended for selected asymptomatic adults based on age and weight-related risk.",
    source: "USPSTF",
    href: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-for-prediabetes-and-type-2-diabetes",
  },
  {
    title: "Colorectal cancer",
    signal: "Age + risk context",
    text: "Average-risk colorectal cancer screening is recommended from age 45 through 75 in current USPSTF guidance, with later decisions individualised.",
    source: "USPSTF",
    href: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
  },
];

export function ScreeningEvidence() {
  return (
    <section className="bg-[#f7f3eb] px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Evidence in practice</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Screening should answer a clinical question.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-warm-gray">
              The point is not to order the largest panel. It is to use appropriate measurements to clarify risk, then interpret them in context.
            </p>
            <a
              href="https://www.moh.gov.my/penerbitan-dan-laporan/dasar-akta-polisi-garis-panduan/penerbitan-klinikal/senarai-penerbitan-klinikal/panduan-amalan-klinikal-cpg"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/55 underline-offset-8"
            >
              Malaysia MOH clinical guidelines ↗
            </a>
          </div>

          <div className="grid gap-4">
            {examples.map((item, index) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group grid gap-4 rounded-[1.4rem] border border-gold/20 bg-white/85 p-5 shadow-[0_18px_56px_rgba(11,26,46,0.06)] transition hover:-translate-y-0.5 hover:border-gold/40 md:grid-cols-[0.18fr_0.72fr_1.5fr]"
              >
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-deep-green/55">0{index + 1}</span>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-deep-green">{item.signal}</p>
                  <h3 className="mt-2 font-serif text-2xl text-navy">{item.title}</h3>
                </div>
                <div>
                  <p className="text-sm leading-6 text-warm-gray">{item.text}</p>
                  <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-gold">{item.source} ↗</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 border-t border-gold/25 pt-5 text-xs leading-5 text-warm-gray/80">
          These examples illustrate recognised preventive guidance, not a universal MMS screening schedule. Malaysian guidance,
          personal and family history, symptoms, sex, age, prior results and physician judgement may change what is appropriate.
        </p>
      </div>
    </section>
  );
}
