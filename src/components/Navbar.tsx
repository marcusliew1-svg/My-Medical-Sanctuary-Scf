import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "@/components/MobileNav";
import { moreNavigation, primaryNavigation } from "@/lib/siteRoutes";

const visibleNavigation = primaryNavigation;

export function Navbar() {
  return (
    <header data-public-chrome className="fixed inset-x-0 top-9 z-40 px-3 py-3 sm:px-4">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 border border-ivory/12 bg-[#07151d]/[0.97] px-4 py-2.5 text-ivory shadow-[0_18px_46px_rgba(0,0,0,0.2)] md:px-6">
        <Link href="/" className="flex min-h-11 shrink-0 items-center gap-3" aria-label="My Medical Sanctuary home">
          <span className="grid h-10 w-14 place-items-center rounded-sm bg-ivory p-1.5 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.22)]">
            <Image src="/mms-logo-mark.png" alt="My Medical Sanctuary" width={430} height={310} className="h-full w-full object-contain" priority />
          </span>
          <span className="hidden text-sm font-semibold tracking-wide md:block">My Medical Sanctuary</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-4 text-xs font-medium min-[1180px]:flex 2xl:gap-6">
          {visibleNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-ivory/76 transition hover:text-gold-light">
              {item.label}
            </Link>
          ))}
          <details className="group relative">
            <summary
              aria-label="More: Medical Team, International Patients, Insights, My Sanctuary, Contact and Partner Login"
              className="min-h-11 cursor-pointer list-none content-center text-xs font-medium text-ivory/76 transition marker:content-none hover:text-gold-light focus-visible:text-gold-light"
            >
              More
            </summary>
            <div className="absolute right-0 top-11 w-64 border border-champagne/20 bg-[#06171d] p-3 shadow-[0_26px_70px_rgba(0,0,0,0.32)]">
              {moreNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={"prefetch" in item ? item.prefetch : undefined}
                  className="block border-b border-champagne/10 px-3 py-3 text-sm text-ivory/78 transition last:border-b-0 hover:text-champagne"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </nav>
        <div className="hidden shrink-0 items-center gap-3 min-[1180px]:flex">
          <LanguageSwitcher />
          <Link href="/ling" className="inline-flex min-h-11 items-center text-sm font-semibold text-gold-light transition hover:text-ivory">Ling</Link>
          <CTAButton href="/contact" className="min-h-10 px-4 text-xs">
            Book Consultation
          </CTAButton>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
