import { getCanonicalSiteUrl, siteConfig } from "@/lib/siteConfig";
import { isControlledPublicLaunch } from "@/lib/controlledPublicLaunch";

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(): JsonLd {
  const controlledDescription = "Interim public information about the planned My Medical Sanctuary concept. Clinical services, bookings and accounts are not currently available through this website.";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getCanonicalSiteUrl(),
    description: isControlledPublicLaunch() ? controlledDescription : siteConfig.defaultDescription,
  };
}

export function jsonLdScriptPayload(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
