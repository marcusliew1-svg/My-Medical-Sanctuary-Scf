const DEFAULT_CANONICAL_SITE_URL = "https://www.scf.center";

export const siteConfig = {
  name: "My Medical Sanctuary",
  tagline: "Preventive Care • Personalised Longevity",
  defaultDescription:
    "My Medical Sanctuary is a premium preventive care and personalised longevity membership platform with discovery-first wellness coordination.",
  defaultSocialImage: "/mms-about-hero.png",
  locale: "en_MY",
} as const;

export function normaliseSiteUrl(value: string | undefined): string {
  const raw = value?.trim();
  if (!raw) return DEFAULT_CANONICAL_SITE_URL;

  try {
    const url = new URL(raw);
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_CANONICAL_SITE_URL;
  }
}

export function getCanonicalSiteUrl(): string {
  return normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.MMS_SITE_URL);
}

export function getCanonicalUrl(path = ""): string {
  const siteUrl = getCanonicalSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanPath, siteUrl).toString();
}

export function composeMetadataTitle(title?: string): string {
  const cleaned = title?.trim();
  if (!cleaned) return `${siteConfig.name} | ${siteConfig.tagline}`;
  const brandSuffix = ` | ${siteConfig.name}`;
  return cleaned.endsWith(brandSuffix) || cleaned === siteConfig.name
    ? cleaned
    : `${cleaned}${brandSuffix}`;
}
