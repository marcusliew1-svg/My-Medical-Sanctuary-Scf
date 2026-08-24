import Link from "next/link";

const signals = [
  ["01", "Physician-guided", "Medical decisions remain with qualified professionals."],
  ["02", "Suitability first", "Advanced options are considered only after appropriate review."],
  ["03", "Privacy-minded", "Sensitive health conversations are treated as private and personal."],
  ["04", "Continuity", "MMS is designed around an ongoing relationship, not a one-off sale."],
];

export function InstitutionTrustBand() {
  return (
    <section className="mms-trust-grid relative overflow-hidden bg-[#0d2b32] px-4 py-16 text-ivory md:py-20">
      <div className="mms-kinetic-ring -right-20 -top-28 size-80" />
      <div className="mms-kinetic-ring -right-2 -top-14 size-52" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">The MMS standard</p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight md:text-5xl">Trust is built into the way care is approached.</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 sm:grid-cols-2">
            {signals.map(([number, title, copy]) => (
              <div key={number} className="bg-[#0d2b32]/95 p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full border border-[#dcb58d]/35 text-[10px] font-bold text-[#e2bc96]">{number}</span>
                  <h3 className="font-serif text-xl">{title}</h3>
                </div>
                <p className="mt-3 text-xs leading-6 text-ivory/58">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-xs leading-6 text-ivory/52">General information only. Individual suitability and outcomes vary.</p>
          <Link href="/about-mms" className="text-xs font-bold uppercase tracking-[.16em] text-[#e2bc96] transition hover:text-white">How MMS approaches care →</Link>
        </div>
      </div>
    </section>
  );
}
