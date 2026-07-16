"use client";

import Link from "next/link";
import { useState } from "react";
import { navigation } from "@/lib/content";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
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
        <div className="absolute inset-x-4 top-20 rounded-lg border border-white/20 bg-stone-950/96 p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
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
            <Link
              href="/health-screening"
              onClick={() => setOpen(false)}
              className="rounded-md bg-white px-3 py-3 text-sm font-semibold text-stone-950"
            >
              Health Screening
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-md bg-teal-700 px-3 py-3 text-sm font-semibold text-white"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
