import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedRegionalPage, regionalMetadata } from "@/components/LocalizedRegionalExperience";
import { isRegionalSection, regionalSections } from "@/lib/i18nRouting";

type ThaiRegionalPageProps = {
  params: Promise<{ section: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return regionalSections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: ThaiRegionalPageProps): Promise<Metadata> {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return regionalMetadata("th", section);
}

export default async function ThaiRegionalPage({ params }: ThaiRegionalPageProps) {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return <LocalizedRegionalPage locale="th" section={section} />;
}
