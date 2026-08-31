import { getCanonicalSiteUrl, getCanonicalUrl, siteConfig } from "@/lib/siteConfig";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: siteConfig.name,
    url: getCanonicalSiteUrl(),
    logo: getCanonicalUrl("/mms-logo-lockup.png"),
    description: siteConfig.defaultDescription,
    medicalSpecialty: [
      "PreventiveMedicine",
      "PrimaryCare",
    ],
  };
}

export function jsonLdScriptPayload(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
