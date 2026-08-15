"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { languages, mobileNavigation } from "@/lib/siteRoutes";

const menuId = "mms-mobile-navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="relative z-[80] grid size-11 place-items-center rounded-full border border-white/35 bg-[#102d39] shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
      >
        <span className="grid gap-1.5" aria-hidden="true">
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-[#020b10]/80"
          />
          <div
            id={menuId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-x-3 top-24 z-[70] max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[1.75rem] border border-white/15 bg-[#071c29] p-4 text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:inset-x-5 sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c9baa0]">My Medical Sanctuary</p>
                <p className="mt-1 text-sm font-semibold text-white">Explore MMS</p>
              </div>
              <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold text-white/70">Menu</span>
            </div>

            <nav aria-label="Mobile navigation links" className="grid gap-1">
              {mobileNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/55">Language</p>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {languages.map((language) => (
                    <Link
                      key={language.href}
                      href={language.href}
                      aria-label={language.aria}
                      onClick={() => setOpen(false)}
                      className="rounded-lg border border-white/20 bg-white/[0.06] px-2 py-2.5 font-semibold text-white transition hover:bg-white/[0.12]"
                    >
                      {language.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/ling" onClick={() => setOpen(false)} className="rounded-xl bg-gold px-3 py-3 text-center text-sm font-semibold text-navy">Start with Ling</Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
