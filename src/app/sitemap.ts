import type { MetadataRoute } from "next";
import { publicSitemapRoutes } from "@/lib/siteRoutes";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-medical-sanctuary-scf.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSitemapRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
