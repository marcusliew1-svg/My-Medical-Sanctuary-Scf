import Link from "next/link";
import Image from "next/image";
import { legalLinks, lingDisclaimer, navigation } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-stone-950 px-4 py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
        <div>
          <div className="mb-5 w-full max-w-64 rounded-lg bg-white p-4">
            <Image
              src="/mms-logo-lockup.png"
              alt="My Medical Sanctuary"
              width={1180}
              height={575}
              className="h-auto w-full"
            />
          </div>
          <p className="max-w-md text-sm leading-7 text-white/[0.68]">
            Preventive Care. Personalised Longevity. Your lifelong health partner for
            doctor-led screening, education, planning, and long-term follow-up.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Explore</p>
          <div className="grid gap-2 text-sm text-white/[0.72]">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Clinical Boundary</p>
          <p className="text-sm leading-7 text-white/[0.68]">
            {lingDisclaimer}
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Legal</p>
          <div className="grid gap-2 text-sm text-white/[0.72]">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
