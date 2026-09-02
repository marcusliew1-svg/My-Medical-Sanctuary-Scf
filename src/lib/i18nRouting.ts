export const regionalLocales = ["ms", "zh", "th"] as const;
export type RegionalLocale = (typeof regionalLocales)[number];
export type SupportedLocale = "en" | RegionalLocale;

export const regionalSections = [
  "ling",
  "memberships",
  "treatments",
  "health-concerns",
  "clinics",
  "medical-tourism",
  "online-doctor",
  "contact",
] as const;
export type RegionalSection = (typeof regionalSections)[number];

export const localeOptions = [
  { locale: "en", label: "EN", name: "English", htmlLang: "en" },
  { locale: "ms", label: "BM", name: "Bahasa Malaysia", htmlLang: "ms" },
  { locale: "zh", label: "中文", name: "Simplified Chinese", htmlLang: "zh-CN" },
  { locale: "th", label: "ไทย", name: "Thai", htmlLang: "th" },
] as const;

export const englishPathBySection: Record<RegionalSection, string> = {
  ling: "/ling",
  memberships: "/memberships",
  treatments: "/treatments",
  "health-concerns": "/health-concerns",
  clinics: "/clinics",
  "medical-tourism": "/medical-tourism",
  "online-doctor": "/online-doctor",
  contact: "/contact",
};

const sectionByEnglishPath = new Map(
  Object.entries(englishPathBySection).map(([section, pathname]) => [pathname, section as RegionalSection]),
);

const SAFE_QUERY_KEYS = ["ref", "utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

export function isRegionalLocale(value: string): value is RegionalLocale {
  return regionalLocales.includes(value as RegionalLocale);
}

export function isRegionalSection(value: string): value is RegionalSection {
  return regionalSections.includes(value as RegionalSection);
}

export function localizedPath(locale: RegionalLocale, section?: RegionalSection): string {
  return section ? `/${locale}/${section}` : `/${locale}`;
}

export function parseRegionalPath(pathname: string): { locale: RegionalLocale; section?: RegionalSection } | null {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length || !isRegionalLocale(parts[0])) return null;
  if (parts.length === 1) return { locale: parts[0] };
  if (parts.length === 2 && isRegionalSection(parts[1])) return { locale: parts[0], section: parts[1] };
  return null;
}

export function currentLocaleForPath(pathname: string): SupportedLocale {
  return parseRegionalPath(pathname)?.locale || "en";
}

export function languageSwitchTarget(pathname: string, targetLocale: SupportedLocale): string {
  const regional = parseRegionalPath(pathname);
  const section = regional?.section || sectionByEnglishPath.get(pathname);

  if (targetLocale === "en") {
    if (section) return englishPathBySection[section];
    return regional ? "/" : pathname;
  }

  if (section) return localizedPath(targetLocale, section);
  if (pathname === "/" || regional) return localizedPath(targetLocale);
  return localizedPath(targetLocale);
}

export function appendSafeAttributionQuery(pathname: string, search: string): string {
  const source = new URLSearchParams(search);
  const safe = new URLSearchParams();
  for (const key of SAFE_QUERY_KEYS) {
    const value = source.get(key)?.trim();
    if (value) safe.set(key, value.slice(0, 200));
  }
  const query = safe.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function alternatePaths(section?: RegionalSection): Record<string, string> {
  const englishPath = section ? englishPathBySection[section] : "/";
  return {
    en: englishPath,
    ms: localizedPath("ms", section),
    "zh-CN": localizedPath("zh", section),
    th: localizedPath("th", section),
    "x-default": englishPath,
  };
}

export function sectionForEnglishPath(pathname: string): RegionalSection | undefined {
  return sectionByEnglishPath.get(pathname);
}

export const regionalSitemapPaths = regionalLocales.flatMap((locale) => [
  localizedPath(locale),
  ...regionalSections.map((section) => localizedPath(locale, section)),
]);
