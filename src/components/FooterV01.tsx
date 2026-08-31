import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/lib/content";

const links = [
  ...navigation.map((item) => [item.label, item.href] as const),
  ["Ling", "/ling"],
  ["Contact", "/contact"],
];

export function FooterV01() {
  return (
    <footer data-public-chrome className="bg-[#07151d] px-4 py-14 text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-5 max-w-64 bg-ivory p-4">
            <Image src="/mms-logo-lockup.png" alt="My Medical Sanctuary" width={1180} height={575} className="h-auto w-full" />
          </div>
          <p className="max-w-md leading-7 text-ivory/70">
            Preventive Care • Personalised Longevity. A private health journey supported by discovery, professional review and continuity.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Explore</h2>
          <div className="grid gap-2 text-sm text-ivory/72">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-gold-light">
                {label}
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
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Legal</h2>
          <div className="grid gap-2 text-sm text-ivory/72">
            {[
              ["Privacy Policy", "/privacy-policy"],
              ["Privacy / PDPA", "/privacy-pdpa"],
              ["Terms of Use", "/terms-of-use"],
              ["Disclaimer", "/privacy-disclaimer"],
            ].map(([label, href]) => (
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
