import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { MobileNav } from "@/components/MobileNav";

const navItems = [
  { label: "Memberships", href: "/memberships" },
  { label: "Treatments", href: "/treatments" },
  { label: "Health Concerns", href: "/health-concerns" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Care Travel", href: "/medical-tourism" },
  { label: "SCF", href: "/scf-lab-roadmap" },
];

const languages = [
  { label: "EN", href: "/", aria: "English" },
  { label: "BM", href: "/ms", aria: "Bahasa Malaysia" },
  { label: "中文", href: "/zh", aria: "Simplified Chinese" },
  { label: "ไทย", href: "/th", aria: "Thai" },
];

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 px-4 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 rounded-full border border-ivory/18 bg-navy/[0.82] px-4 py-3 text-ivory shadow-[0_18px_46px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-14 place-items-center rounded-full bg-ivory p-1.5 shadow-[inset_0_0_0_1px_rgba(181,111,91,0.22)]">
            <Image src="/mms-logo-mark.png" alt="My Medical Sanctuary" width={430} height={310} className="h-full w-full object-contain" priority />
          </span>
          <span className="hidden text-sm font-semibold tracking-wide md:block">My Medical Sanctuary</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-4 text-sm font-medium xl:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-ivory/76 transition hover:text-gold-light">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/online-doctor" className="hidden text-sm font-semibold text-gold-light transition hover:text-ivory 2xl:block">Online doctor</Link>
          <div className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] p-1 xl:flex" aria-label="Language selection">
            {languages.map((language) => (
              <Link
                key={language.href}
                href={language.href}
                aria-label={language.aria}
                className="rounded-full px-2 py-1 text-[10px] font-semibold text-ivory/78 transition hover:bg-white/[0.10] hover:text-white"
              >
                {language.label}
              </Link>
            ))}
          </div>
          <Link href="/login" className="hidden text-sm font-semibold text-ivory/80 transition hover:text-ivory 2xl:block">Patient login</Link>
          <CTAButton href="/ling" className="hidden min-h-10 px-4 text-xs 2xl:inline-flex">Start with Ling</CTAButton>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
