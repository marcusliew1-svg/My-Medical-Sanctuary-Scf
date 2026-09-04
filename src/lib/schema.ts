import { getCanonicalSiteUrl, siteConfig } from "@/lib/siteConfig";

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getCanonicalSiteUrl(),
    description: siteConfig.defaultDescription,
  };
}

export function jsonLdScriptPayload(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
