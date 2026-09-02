import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "@/components/MobileNav";
import { moreNavigation, navigation } from "@/lib/siteRoutes";

const visibleNavigation = navigation.filter(
  (item) => !["Home", "International Patients", "Insights"].includes(item.label),
);

export function Navbar() {
  return (
    <header data-public-chrome className="fixed inset-x-0 top-9 z-40 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 border border-ivory/12 bg-[#07151d] px-4 py-3 text-ivory shadow-[0_18px_46px_rgba(0,0,0,0.2)] md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-14 place-items-center bg-ivory p-1.5 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.22)]">
            <Image src="/mms-logo-mark.png" alt="My Medical Sanctuary" width={430} height={310} className="h-full w-full object-contain" priority />
          </span>
          <span className="hidden text-sm font-semibold tracking-wide md:block">My Medical Sanctuary</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-4 text-xs font-medium xl:flex">
          {visibleNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-ivory/76 transition hover:text-gold-light">
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              type="button"
              className="text-xs font-medium text-ivory/76 transition hover:text-gold-light focus-visible:text-gold-light"
            >
              More
            </button>
            <div className="invisible absolute right-0 top-8 w-64 translate-y-2 border border-champagne/20 bg-[#06171d]/98 p-3 opacity-0 shadow-[0_26px_70px_rgba(0,0,0,0.32)] transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {moreNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border-b border-champagne/10 px-3 py-3 text-sm text-ivory/78 transition last:border-b-0 hover:text-champagne"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher />
          <Link href="/my-sanctuary" prefetch={false} className="text-sm font-semibold text-gold-light transition hover:text-ivory">My Sanctuary</Link>
          <CTAButton href="/contact" className="min-h-10 px-4 text-xs">
            Book Consultation
          </CTAButton>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
