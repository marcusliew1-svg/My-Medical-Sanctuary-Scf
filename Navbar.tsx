import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-mms" },
  { label: "Memberships", href: "/memberships" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Education", href: "/education" },
  { label: "Corporate", href: "/corporate-executive-wellness" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 px-4 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 rounded-full border border-ivory/20 bg-navy/80 px-4 py-3 text-ivory backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-14 place-items-center rounded-full bg-ivory p-1.5">
            <Image src="/mms-logo-mark.png" alt="My Medical Sanctuary" width={430} height={310} className="h-full w-full object-contain" priority />
          </span>
          <span className="hidden text-sm font-semibold md:block">My Medical Sanctuary</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-sm font-medium lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-ivory/78 transition hover:text-gold-light">
              {item.label}
            </Link>
          ))}
        </nav>
        <CTAButton href="/contact" className="min-h-10 px-4 text-xs">
          Start Discovery
        </CTAButton>
      </div>
    </header>
  );
}
