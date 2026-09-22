"use client";

import Link from "next/link";
import { useState } from "react";
import { navigation } from "@/lib/content";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="grid size-10 place-items-center rounded-full border border-white/18 bg-white/[0.08] backdrop-blur-md"
      >
        <span className="grid gap-1.5">
          <span className={`block h-px w-5 bg-white transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-px w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-white transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </span>
      </button>

      {open ? (
        <div className="absolute inset-x-3 top-[4.8rem] overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#07151d]/[0.985] text-white shadow-[0_35px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold-light">My Medical Sanctuary</p>
            <p className="mt-2 max-w-xs font-serif text-2xl leading-tight">Know earlier. Live better.</p>
          </div>

          <nav aria-label="Mobile navigation" className="grid px-3 py-3">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium text-white/[0.82] transition hover:bg-white/[0.06] hover:text-white"
              >
                <span>{item.label}</span>
                <span className="text-[0.62rem] tracking-[0.16em] text-gold-light/65">0{index + 1}</span>
              </Link>
            ))}
          </nav>

          <div className="grid gap-2 border-t border-white/10 p-4">
            <Link
              href="/health-discovery"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gold px-4 py-3.5 text-center text-sm font-semibold text-navy"
            >
              Start my health assessment
            </Link>
            <Link
              href="/ling"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-3.5 text-center text-sm font-semibold text-white"
            >
              Meet Ling
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
