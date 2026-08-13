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
  "/ling",
  "/international-medicine-access",
  "/medicine-intelligence",
  "/insights",
  "/media-room",
  "/malaysia-thailand-care",
  "/register",
  "/login",
  "/scf-lab-roadmap",
  "/corporate-executive-wellness",
  "/corporate-wellness",
  "/professional-alliance-programme",
  "/medical-tourism",
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
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
