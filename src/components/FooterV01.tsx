import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/lib/content";

const links = [
  ...navigation.map((item) => [item.label, item.href] as const),
  ["Ling", "/ling"] as const,
  ["Contact", "/contact"] as const,
];

export function FooterV01() {
  return (
    <footer className="relative overflow-hidden bg-[#051117] px-4 pb-10 pt-20 text-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(212,175,55,0.10),transparent_26%),radial-gradient(circle_at_88%_78%,rgba(64,112,103,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.35fr_0.65fr_0.8fr]">
          <div>
            <div className="max-w-56 rounded-[1.1rem] bg-ivory p-4">
              <Image
                src="/mms-logo-lockup.png"
                alt="My Medical Sanctuary"
                width={1180}
                height={575}
                className="h-auto w-full"
              />
            </div>

            <h2 className="mt-9 max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
              Know earlier. Live better.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ivory/60">
              Preventive care, personalised longevity and physician-led health intelligence—designed as one continuous relationship.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/health-discovery"
                className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-gold-light"
              >
                Start my health assessment
              </Link>
              <Link
                href="/ling"
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-white/[0.08]"
              >
                Ask Ling
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-light">Explore MMS</p>
            <div className="mt-6 grid gap-3 text-sm text-ivory/65">
              {links.map(([label, href]) => (
                <Link key={href} href={href} className="transition hover:translate-x-1 hover:text-gold-light">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-light">Medical boundary</p>
            <p className="mt-6 text-sm leading-7 text-ivory/60">
              Website information is educational. Personalised recommendations, diagnosis, prescribing and suitability decisions require qualified professional review.
            </p>
            <p className="mt-6 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-light">Ling</p>
            <p className="mt-3 text-sm leading-7 text-ivory/55">
              Your MMS virtual health spokesperson. Ling explains and prepares; doctors interpret and decide.
            </p>
          </div>
        </div>

        <div className="grid gap-5 py-8 text-xs text-ivory/42 md:grid-cols-[1fr_auto] md:items-center">
          <p>© My Medical Sanctuary. Preventive Care • Personalised Longevity.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              ["Privacy", "/privacy-policy"],
              ["PDPA", "/privacy-pdpa"],
              ["Terms", "/terms-of-use"],
              ["Disclaimer", "/privacy-disclaimer"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-ivory">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
