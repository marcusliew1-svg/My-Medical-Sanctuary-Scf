import type { MetadataRoute } from "next";
import { isControlledPublicLaunch } from "@/lib/controlledPublicLaunch";
import { getCanonicalUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  if (isControlledPublicLaunch()) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/about-mms",
          "/education",
          "/health-",
          "/insights",
          "/international-",
          "/knowledge-hub",
          "/ling",
          "/malaysia-thailand-care",
          "/media-room",
          "/membership",
          "/ms",
          "/operations",
          "/partner-",
          "/prototype",
          "/treatments",
          "/why-mms",
          "/zh",
          "/th",
        ],
      },
      sitemap: getCanonicalUrl("/sitemap.xml"),
    };
  }

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
