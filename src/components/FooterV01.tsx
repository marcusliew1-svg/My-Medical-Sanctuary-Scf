import Image from "next/image";
import Link from "next/link";
import { footerNavigation, legalNavigation, platformNavigation } from "@/lib/siteRoutes";

export function FooterV01() {
  return (
    <footer className="bg-navy px-4 py-14 text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-5 max-w-64 rounded-lg bg-ivory p-4">
            <Image src="/mms-logo-lockup.png" alt="My Medical Sanctuary" width={1180} height={575} className="h-auto w-full" />
          </div>
          <p className="max-w-md leading-7 text-ivory/70">
            Preventive Care • Personalised Longevity. A structured wellness journey supported by discovery, care coordination and professional review.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Explore</h2>
          <div className="grid gap-2 text-sm text-ivory/72">
            {footerNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-gold-light">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 grid gap-2 border-t border-white/10 pt-4 text-sm text-ivory/72">
            {legalNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-gold-light">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Medical boundary</h2>
          <p className="text-sm leading-7 text-ivory/70">
            General information only. Professional review is required before any personalised recommendation. Individual outcomes vary.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Platform</h2>
          <div className="grid gap-2 text-sm text-ivory/72">
            {platformNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-gold-light">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
