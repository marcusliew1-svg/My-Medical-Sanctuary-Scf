import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { DraftBanner } from "@/components/DraftBanner";
import { FooterV01 } from "@/components/FooterV01";
import { Navbar } from "@/components/Navbar";
import { isControlledPublicLaunch } from "@/lib/controlledPublicLaunch";
import { jsonLdScriptPayload, websiteJsonLd } from "@/lib/schema";
import { composeMetadataTitle, getCanonicalSiteUrl, getCanonicalUrl, siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const siteUrl = getCanonicalSiteUrl();
const socialImage = siteConfig.defaultSocialImage;
const controlledPublicLaunch = isControlledPublicLaunch();
const controlledDescription = "Interim public information about the planned My Medical Sanctuary concept. Clinical services, bookings and accounts are not currently available through this website.";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: composeMetadataTitle(),
    template: "%s",
  },
  description: controlledPublicLaunch ? controlledDescription : siteConfig.defaultDescription,
  alternates: controlledPublicLaunch ? undefined : { canonical: getCanonicalUrl("/") },
  icons: controlledPublicLaunch
    ? undefined
    : {
        icon: "/mms-logo-mark.png",
        shortcut: "/mms-logo-mark.png",
        apple: "/mms-logo-mark.png",
      },
  openGraph: {
    title: siteConfig.name,
    description: controlledPublicLaunch ? controlledDescription : siteConfig.tagline,
    url: siteUrl,
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    images: controlledPublicLaunch
      ? []
      : [
          {
            url: socialImage,
            alt: "My Medical Sanctuary preventive care and personalised longevity",
          },
        ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: controlledPublicLaunch ? controlledDescription : siteConfig.tagline,
    images: controlledPublicLaunch ? [] : [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {controlledPublicLaunch ? <head><link rel="canonical" href={`${siteUrl}/`} /></head> : null}
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(websiteJsonLd()) }}
        />
        <DraftBanner />
        <Navbar />
        {children}
        <FooterV01 />
      </body>
    </html>
  );
}
