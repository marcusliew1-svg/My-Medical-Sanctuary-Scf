import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-medical-sanctuary-scf.vercel.app";

const routes = [
  "",
  "/about-mms",
  "/why-mms",
  "/our-philosophy",
  "/health-journey",
  "/health-discovery",
  "/health-screening",
  "/science-evidence",
  "/insights",
  "/treatments",
  "/preventive-care",
  "/longevity-medicine",
  "/weight-management",
  "/iv-therapy",
  "/memberships",
  "/how-it-works",
  "/ling",
  "/online-doctor",
  "/clinics",
  "/international-medicine-access",
  "/malaysia-thailand-care",
  "/corporate-executive-wellness",
  "/professional-alliance-programme",
  "/media-room",
  "/faq",
  "/contact",
  "/privacy-disclaimer",
  "/privacy-pdpa",
  "/privacy-policy",
  "/terms",
  "/terms-of-use",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/science-evidence" || route === "/health-discovery" ? 0.85 : 0.7,
  }));
}
