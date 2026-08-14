"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "How MMS Works", href: "/how-it-works" },
  { label: "Memberships", href: "/memberships" },
  { label: "Treatments & Wellness Guide", href: "/treatments" },
  { label: "Medicine Price Compare", href: "/medicine-intelligence" },
  { label: "Malaysia–Thailand Care Travel", href: "/medical-tourism" },
  { label: "Book Online Doctor", href: "/online-doctor" },
  { label: "Our Clinics", href: "/clinics" },
  { label: "SCF & Future Medicine", href: "/scf-lab-roadmap" },
  { label: "MMS Insights", href: "/insights" },
  { label: "Video & Media Room", href: "/media-room" },
  { label: "Regional Care Access", href: "/malaysia-thailand-care" },
  { label: "About MMS", href: "/about-mms" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center rounded-full border border-white/30 bg-white/[0.14] backdrop-blur-md"
      >
        <span className="grid gap-1.5">
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </span>
      </button>

      {open ? (
        <div className="absolute inset-x-2 top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-white/20 bg-navy/98 p-4 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:inset-x-4 sm:p-5">
          <nav aria-label="Mobile navigation" className="grid gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-white/[0.84] transition hover:bg-white/[0.08] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
            <div className="grid grid-cols-3 gap-2 text-center text-xs"><Link href="/" className="rounded-md border border-white/20 p-2">EN</Link><Link href="/ms" className="rounded-md border border-white/20 p-2">BM</Link><Link href="/zh" className="rounded-md border border-white/20 p-2">中文</Link></div>
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-md bg-white px-3 py-3 text-sm font-semibold text-stone-950">Patient login</Link>
            <Link href="/register" onClick={() => setOpen(false)} className="rounded-md bg-gold px-3 py-3 text-sm font-semibold text-navy">Start with Ling</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
