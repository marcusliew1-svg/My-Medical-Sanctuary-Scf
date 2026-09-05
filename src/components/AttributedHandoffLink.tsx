"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { appendSafeAttributionQuery, type RegionalLocale } from "@/lib/i18nRouting";

export function AttributedHandoffLink({
  href,
  locale,
  children,
  className,
}: {
  href: string;
  locale: RegionalLocale;
  children: ReactNode;
  className: string;
}) {
  const router = useRouter();
  const fallbackHref = `${href}?locale=${locale}`;

  function follow(event: MouseEvent<HTMLAnchorElement>) {
    const attributed = appendSafeAttributionQuery(href, window.location.search);
    const url = new URL(attributed, window.location.origin);
    url.searchParams.set("locale", locale);
    event.preventDefault();
    router.push(`${url.pathname}?${url.searchParams.toString()}`);
  }

  return <Link href={fallbackHref} onClick={follow} className={className}>{children}</Link>;
}
