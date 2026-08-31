import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/siteConfig";

const routes = [
  "",
  "/about-mms",
  "/why-mms",
  "/our-philosophy",
  "/health-journey",
  "/health-discovery",
  "/health-screening",
  "/treatments",
  "/preventive-care",
  "/longevity-medicine",
  "/weight-management",
  "/iv-therapy",
  "/memberships",
  "/membership",
  "/how-it-works",
  "/education",
  "/knowledge-hub",
  "/health-articles",
  "/health-intelligence",
  "/insights",
  "/ling",
  "/clinics",
  "/international-medicine-access",
  "/scf-lab-roadmap",
  "/corporate-executive-wellness",
  "/corporate-wellness",
  "/professional-alliance-programme",
  "/medical-tourism",
  "/malaysia-thailand-care",
  "/faq",
  "/contact",
  "/book-appointment",
  "/privacy-disclaimer",
  "/privacy-pdpa",
  "/privacy-policy",
  "/terms",
  "/terms-of-use",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: getCanonicalUrl(route),
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
