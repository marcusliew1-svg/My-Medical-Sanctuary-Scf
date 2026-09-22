import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { navigation } from "@/lib/content";

export function Navbar() {
  const topClass = process.env.VERCEL_ENV === "production" ? "top-0" : "top-9";

  return (
    <header className={`fixed inset-x-0 z-40 px-3 py-3 md:px-4 ${topClass}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 rounded-full border border-ivory/12 bg-[#07151d]/88 px-3 py-2.5 text-ivory shadow-[0_18px_46px_rgba(0,0,0,0.2)] backdrop-blur-xl md:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-12 shrink-0 place-items-center rounded-full bg-ivory p-1.5 shadow-[inset_0_0_0_1px_rgba(199,167,106,0.22)]">
            <Image src="/mms-logo-mark.png" alt="My Medical Sanctuary" width={430} height={310} className="h-full w-full object-contain" priority />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="block truncate text-[0.82rem] font-semibold tracking-[0.02em]">My Medical Sanctuary</span>
            <span className="mt-0.5 block text-[0.58rem] uppercase tracking-[0.2em] text-gold-light/85">Preventive care · Personalised longevity</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-[0.72rem] font-medium xl:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-ivory/72 transition hover:text-gold-light">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link href="/ling" className="rounded-full px-4 py-2.5 text-xs font-semibold text-gold-light transition hover:bg-white/[0.06] hover:text-ivory">
            Meet Ling
          </Link>
          <Link href="/health-discovery" className="rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-gold-light">
            Start assessment
          </Link>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
