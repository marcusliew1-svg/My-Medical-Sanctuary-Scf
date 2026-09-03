"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { primaryNavigation, utilityNavigation } from "@/lib/siteRoutes";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const triggerButton = triggerButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerButton?.focus();
    };
  }, [open]);

  return (
    <div className="min-[1180px]:hidden">
      <button
        ref={triggerButtonRef}
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
        onClick={() => setOpen((value) => !value)}
        className={`grid size-11 place-items-center rounded-md border border-white/30 bg-white/[0.14] backdrop-blur-md ${open ? "invisible" : ""}`}
      >
        <span className="grid gap-1.5">
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </span>
      </button>

      {open ? createPortal(
        <div
          ref={dialogRef}
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
              className="grid size-11 place-items-center rounded-md border border-champagne/50 bg-ivory/8 text-2xl leading-none text-ivory"
            >
              ×
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="mx-auto mt-8 grid max-w-md gap-1">
            <p className="editorial-kicker mb-2 text-champagne">Explore MMS</p>
            {primaryNavigation.map((item) => (
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
          <div className="mx-auto mt-8 max-w-md border-t border-champagne/20 pt-6">
            <p className="editorial-kicker mb-3 text-champagne">Account &amp; support</p>
            <div className="grid grid-cols-2 gap-x-5">
              {utilityNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={"prefetch" in item ? item.prefetch : undefined}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center border-b border-champagne/12 py-2 text-sm text-ivory/78 transition hover:text-champagne"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-md gap-3 border-t border-champagne/20 pt-6">
            <LanguageSwitcher variant="mobile" onNavigate={() => setOpen(false)} />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-5 text-sm font-semibold text-navy"
            >
              Book Consultation
            </Link>
            <Link
              href="/ling"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-champagne/45 px-5 text-sm font-semibold text-ivory"
            >
              Meet Ling
            </Link>
          </div>
        </div>,
        document.body,
      ) : null}
    </div>
  );
}
