import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedRegionalPage, regionalMetadata } from "@/components/LocalizedRegionalExperience";
import { isRegionalSection, regionalSections } from "@/lib/i18nRouting";

type ChineseRegionalPageProps = {
  params: Promise<{ section: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return regionalSections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: ChineseRegionalPageProps): Promise<Metadata> {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return regionalMetadata("zh", section);
}

export default async function ChineseRegionalPage({ params }: ChineseRegionalPageProps) {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return <LocalizedRegionalPage locale="zh" section={section} />;
}
