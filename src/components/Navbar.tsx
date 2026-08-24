import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { MobileNav } from "@/components/MobileNav";
import { languages, primaryNavigation } from "@/lib/siteRoutes";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 px-5 text-ivory md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 border-b border-white/16 py-5 backdrop-blur-[2px]">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-14 place-items-center bg-ivory/96 p-1.5">
            <Image src="/mms-logo-mark.png" alt="My Medical Sanctuary" width={430} height={310} className="h-full w-full object-contain" priority />
          </span>
          <span className="hidden font-serif text-lg tracking-[.01em] md:block">My Medical Sanctuary</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-[13px] font-medium xl:flex">
          {primaryNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-ivory/74 transition hover:text-[#efc9a6]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 xl:flex" aria-label="Language selection">
            {languages.map((language) => (
              <Link key={language.href} href={language.href} aria-label={language.aria} className="text-[9px] font-semibold uppercase tracking-[.12em] text-ivory/58 transition hover:text-white">
                {language.label}
              </Link>
            ))}
          </div>
          <CTAButton href="/ling" className="hidden min-h-10 px-4 text-xs 2xl:inline-flex">Start with Ling</CTAButton>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
