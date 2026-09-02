import type { MetadataRoute } from "next";
import {
  alternatePaths,
  parseRegionalPath,
  regionalSitemapPaths,
  sectionForEnglishPath,
  type RegionalSection,
} from "@/lib/i18nRouting";
import { getCanonicalUrl } from "@/lib/siteConfig";
import { publicSitemapRoutes } from "@/lib/siteRoutes";

function languageAlternates(section?: RegionalSection) {
  return Object.fromEntries(
    Object.entries(alternatePaths(section)).map(([language, pathname]) => [language, getCanonicalUrl(pathname)]),
  );
}

function sitemapEntry(pathname: string, now: Date): MetadataRoute.Sitemap[number] {
  const regional = parseRegionalPath(pathname);
  const section = regional?.section ?? sectionForEnglishPath(pathname);
  const supportsRegionalAlternates = pathname === "/" || Boolean(regional) || Boolean(section);

  return {
    url: getCanonicalUrl(pathname),
    lastModified: now,
    changeFrequency: pathname === "/" ? "weekly" : "monthly",
    priority: pathname === "/" ? 1 : 0.7,
    ...(supportsRegionalAlternates ? { alternates: { languages: languageAlternates(section) } } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [...publicSitemapRoutes, ...regionalSitemapPaths].map((route) => sitemapEntry(route, now));
}
