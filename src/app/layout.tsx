import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { DraftBanner } from "@/components/DraftBanner";
import { FooterV01 } from "@/components/FooterV01";
import { Navbar } from "@/components/Navbar";
import { jsonLdScriptPayload, organizationJsonLd } from "@/lib/schema";
import { composeMetadataTitle, getCanonicalSiteUrl, siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const siteUrl = getCanonicalSiteUrl();
const socialImage = siteConfig.defaultSocialImage;

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
  description: siteConfig.defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/mms-logo-mark.png",
    shortcut: "/mms-logo-mark.png",
    apple: "/mms-logo-mark.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    url: siteUrl,
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    images: [
      {
        url: socialImage,
        alt: "My Medical Sanctuary preventive care and personalised longevity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.tagline,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(organizationJsonLd()) }}
        />
        <DraftBanner />
        <Navbar />
        {children}
        <FooterV01 />
      </body>
    </html>
  );
}
