import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { MobileNav } from "@/components/MobileNav";
import { navigation } from "@/lib/content";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-9 z-40 px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 border border-ivory/12 bg-[#07151d]/88 px-4 py-3 text-ivory shadow-[0_18px_46px_rgba(0,0,0,0.2)] backdrop-blur-xl md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-14 place-items-center bg-ivory p-1.5 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.22)]">
            <Image src="/mms-logo-mark.png" alt="My Medical Sanctuary" width={430} height={310} className="h-full w-full object-contain" priority />
          </span>
          <span className="hidden text-sm font-semibold tracking-wide md:block">My Medical Sanctuary</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-4 text-xs font-medium xl:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-ivory/76 transition hover:text-gold-light">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 xl:flex">
          <Link href="/ling" className="text-sm font-semibold text-gold-light transition hover:text-ivory">Ling</Link>
          <CTAButton href="/contact" className="min-h-10 px-4 text-xs">
            Book
          </CTAButton>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
