import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/prototype",
        "/partner-hub",
        "/login",
        "/register",
        "/onboarding",
        "/my-sanctuary",
        "/membership-checkout",
      ],
    },
    sitemap: getCanonicalUrl("/sitemap.xml"),
  };
}
