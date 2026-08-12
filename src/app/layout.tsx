import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { FooterV01 } from "@/components/FooterV01";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-medical-sanctuary-scf.vercel.app";

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
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Navbar />
        {children}
        <FooterV01 />
      </body>
    </html>
  );
}
