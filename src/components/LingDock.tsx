"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const hiddenPrefixes = [
  "/partner-hub",
  "/prototype",
  "/my-sanctuary",
  "/onboarding",
  "/register",
];

export function LingDock() {
  const pathname = usePathname();

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 z-40 sm:bottom-4 sm:right-4">
      <Link
        href="/ling"
        aria-label="Meet Ling, your MMS virtual health spokesperson"
        className="group flex items-center gap-3 rounded-full border border-white/40 bg-[#07151d]/92 p-2 text-ivory shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-gold/45 sm:pr-4"
      >
        <span className="relative h-12 w-12 overflow-hidden rounded-full border border-gold/30 bg-ivory">
          <Image
            src="/ling-mms-guide.png"
            alt=""
            fill
            className="object-cover object-top"
            sizes="48px"
          />
        </span>
        <span className="hidden sm:block">
          <span className="block text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
            Ask Ling
          </span>
          <span className="mt-0.5 block text-xs text-ivory/76">
            Your MMS health guide
          </span>
        </span>
        <span className="ml-1 hidden text-gold-light transition group-hover:translate-x-0.5 sm:inline">→</span>
      </Link>
    </div>
  );
}
