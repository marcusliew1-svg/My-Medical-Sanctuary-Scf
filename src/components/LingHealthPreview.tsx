import Link from "next/link";

const signals = [
  { label: "Cardiometabolic", status: "Review", note: "ApoB trend deserves context" },
  { label: "Metabolic", status: "Stable", note: "Glucose pattern within your recent range" },
  { label: "Recovery", status: "Watch", note: "Sleep consistency has shifted" },
];

export function LingHealthPreview() {
  return (
    <section className="overflow-hidden bg-[#f3eee4] px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="editorial-kicker mb-4 text-deep-green">Ling • Your virtual health guide</p>
          <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
            Your health information should become easier to understand over time.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-warm-gray">
            Ling helps organise results, explain terminology and prepare better questions for your care team.
            Personal interpretation and clinical decisions stay with your doctor.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 border-t border-gold/35 pt-6 text-sm text-deep-green">
            <span>Explain plainly</span>
            <span>Track context</span>
            <span>Prepare for review</span>
          </div>
          <Link
            href="/ling"
            className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/50 underline-offset-8"
          >
            Meet Ling
          </Link>
        </div>

        <div className="relative rounded-[2.2rem] border border-white/70 bg-[#07151d] p-4 text-ivory shadow-[0_40px_110px_rgba(11,26,46,0.22)] md:p-6">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#0a1d26]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-light">MMS health view</p>
                <p className="mt-1 font-serif text-xl">Good morning.</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full border border-gold/35 bg-gold/10 text-sm font-semibold text-gold-light">
                L
              </div>
            </div>

            <div className="p-5 md:p-7">
              <div className="rounded-[1.4rem] border border-gold/20 bg-white/[0.045] p-5">
                <p className="text-sm leading-6 text-ivory/82">
                  Three health areas have new information since your previous review. I can help you understand
                  the terminology before you speak with your doctor.
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                {signals.map((signal) => (
                  <div key={signal.label} className="grid gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[0.8fr_0.45fr_1.4fr] sm:items-center">
                    <p className="font-serif text-lg">{signal.label}</p>
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold-light">{signal.status}</p>
                    <p className="text-xs leading-5 text-ivory/58">{signal.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-[1.3rem] bg-[#f6f0e5] p-5 text-navy sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-deep-green">Next step</p>
                  <p className="mt-1 font-serif text-xl">Prepare for physician review</p>
                </div>
                <span className="text-xs leading-5 text-warm-gray">Illustrative interface • not a diagnosis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
