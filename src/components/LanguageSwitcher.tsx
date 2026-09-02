"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import {
  appendSafeAttributionQuery,
  currentLocaleForPath,
  languageSwitchTarget,
  localeOptions,
} from "@/lib/i18nRouting";

export function LanguageSwitcher({ variant = "desktop", onNavigate }: { variant?: "desktop" | "mobile"; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = currentLocaleForPath(pathname);
  const mobile = variant === "mobile";

  function navigate(event: MouseEvent<HTMLAnchorElement>, target: string) {
    const attributedTarget = appendSafeAttributionQuery(target, window.location.search);
    onNavigate?.();
    if (attributedTarget !== target) {
      event.preventDefault();
      router.push(attributedTarget);
    }
  }

  return (
    <nav aria-label="Language" className={mobile ? "grid grid-cols-4 gap-2" : "flex items-center gap-1"}>
      {localeOptions.map((option) => {
        const target = languageSwitchTarget(pathname, option.locale);
        const active = currentLocale === option.locale;
        return (
          <Link
            key={option.locale}
            href={target}
            hrefLang={option.htmlLang}
            lang={option.htmlLang}
            aria-label={`View in ${option.name}`}
            aria-current={active ? "page" : undefined}
            onClick={(event) => navigate(event, target)}
            className={mobile
              ? `grid min-h-11 place-items-center rounded-full border px-2 text-sm font-semibold ${active ? "border-gold bg-gold text-navy" : "border-champagne/35 text-ivory"}`
              : `rounded-full px-2 py-1 text-[11px] font-semibold transition ${active ? "bg-gold text-navy" : "text-ivory/70 hover:text-gold-light"}`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
