import type { Metadata } from "next";
import { FooterV01 } from "@/components/FooterV01";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-medical-sanctuary-scf.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "My Medical Sanctuary | Preventive Care • Personalised Longevity",
    template: "%s | My Medical Sanctuary",
  },
  description:
    "My Medical Sanctuary is a premium preventive care and personalised longevity membership platform with discovery-first wellness coordination.",
  openGraph: {
    title: "My Medical Sanctuary",
    description: "Preventive Care • Personalised Longevity",
    url: siteUrl,
    type: "website",
    locale: "en_MY",
    siteName: "My Medical Sanctuary",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <FooterV01 />
      </body>
    </html>
  );
}
