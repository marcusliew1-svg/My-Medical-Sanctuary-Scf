"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { navigation } from "@/lib/siteRoutes";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

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
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#06171d] px-4 py-5 text-ivory"
        >
          <div className="mx-auto flex max-w-md items-center justify-between border-b border-champagne/20 pb-5">
            <Link href="/" onClick={() => setOpen(false)} className="text-sm font-semibold text-ivory">
              My Medical Sanctuary
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="grid size-11 place-items-center rounded-full border border-champagne/50 bg-ivory/8 text-2xl leading-none text-ivory"
            >
              ×
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="mx-auto mt-8 grid max-w-md gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-champagne/12 py-4 font-serif text-3xl leading-tight text-ivory transition hover:text-champagne"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto mt-8 grid max-w-md gap-3 border-t border-champagne/20 pt-6">
            <LanguageSwitcher variant="mobile" onNavigate={() => setOpen(false)} />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-navy"
            >
              Book Consultation
            </Link>
            <Link
              href="/my-sanctuary"
              prefetch={false}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-champagne/45 px-5 text-sm font-semibold text-ivory"
            >
              My Sanctuary
            </Link>
            <p className="text-xs leading-5 text-ivory/55">
              Patient portal access remains controlled while MMS prepares the full My Sanctuary experience.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
