"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const signals = [
  ["Physician-guided", "Medical decisions remain with qualified professionals."],
  ["Suitability first", "Advanced options are considered only after appropriate review."],
  ["Private & personal", "Sensitive health conversations are treated with discretion."],
  ["Continuity", "MMS is designed around an ongoing relationship, not a one-off sale."],
];

const internalPrefixes = ["/operations", "/partner", "/api"];

export function InstitutionTrustBand() {
  const pathname = usePathname();
  if (internalPrefixes.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <section className="relative overflow-hidden bg-[#102f32] px-5 py-20 text-ivory md:px-8 md:py-28">
      <div className="absolute -right-32 top-1/2 size-[28rem] -translate-y-1/2 rounded-full border border-[#e4ba93]/10" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e4ba93]">The MMS standard</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-[1.04] md:text-6xl">Trust should be visible in the way care is approached.</h2>
          </div>
          <div className="grid gap-0 border-y border-white/14 sm:grid-cols-2">
            {signals.map(([title, copy], index) => (
              <div key={title} className="py-6 sm:px-6 sm:first:pl-0 sm:[&:nth-child(2n)]:border-l sm:[&:nth-child(2n)]:border-white/14 sm:[&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-white/14">
                <span className="text-[9px] font-bold tracking-[.18em] text-[#e4ba93]">0{index + 1}</span>
                <h3 className="mt-3 font-serif text-2xl">{title}</h3>
                <p className="mt-2 max-w-sm text-xs leading-6 text-ivory/58">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-6">
          <p className="text-xs leading-6 text-ivory/48">General information only. Individual suitability and outcomes vary.</p>
          <Link href="/about-mms" className="text-xs font-bold uppercase tracking-[.16em] text-[#e4ba93] transition hover:text-white">How MMS approaches care →</Link>
        </div>
      </div>
    </section>
  );
}
