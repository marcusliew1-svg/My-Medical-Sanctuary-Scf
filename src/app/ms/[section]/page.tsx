import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedRegionalPage, regionalMetadata } from "@/components/LocalizedRegionalExperience";
import { isRegionalSection, regionalSections } from "@/lib/i18nRouting";

type MalayRegionalPageProps = {
  params: Promise<{ section: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return regionalSections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: MalayRegionalPageProps): Promise<Metadata> {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return regionalMetadata("ms", section);
}

export default async function MalayRegionalPage({ params }: MalayRegionalPageProps) {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return <LocalizedRegionalPage locale="ms" section={section} />;
}
