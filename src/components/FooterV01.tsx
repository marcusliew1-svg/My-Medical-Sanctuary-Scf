import Image from "next/image";
import Link from "next/link";
import { legalNavigation, primaryNavigation, utilityNavigation } from "@/lib/siteRoutes";

export function FooterV01() {
  return (
    <footer data-public-chrome className="border-t border-champagne/15 bg-[#07151d] px-4 py-16 text-ivory md:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.35fr_0.9fr_0.9fr_1fr]">
        <div>
          <div className="mb-7 max-w-64 rounded-sm bg-ivory p-4">
            <Image src="/mms-logo-lockup.png" alt="My Medical Sanctuary" width={1180} height={575} className="h-auto w-full" />
          </div>
          <p className="max-w-md leading-7 text-ivory/70">
            Preventive Care • Personalised Longevity. A private health journey supported by discovery, professional review and continuity.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Explore</h2>
          <div className="grid gap-2 text-sm text-ivory/72">
            {primaryNavigation.map(({ label, href }) => (
              <Link key={href} href={href} className="inline-flex min-h-8 items-center transition hover:text-gold-light">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Connect</h2>
          <div className="grid gap-1 text-sm text-ivory/72">
            {utilityNavigation.map((item) => (
              <Link key={item.href} href={item.href} prefetch={"prefetch" in item ? item.prefetch : undefined} className="inline-flex min-h-8 items-center transition hover:text-gold-light">
                {item.label}
              </Link>
            ))}
            <Link href="/ling" className="inline-flex min-h-8 items-center transition hover:text-gold-light">Ling</Link>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Medical boundary</h2>
          <p className="text-sm leading-7 text-ivory/70">
            General information only. Professional review is required before any personalised recommendation. Individual outcomes vary.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-champagne">Understand earlier. Personalise carefully. Continue over time.</p>
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Legal</h2>
          <div className="grid gap-2 text-sm text-ivory/72">
            {legalNavigation.map(({ label, href }) => (
              <Link key={href} href={href} className="transition hover:text-gold-light">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
