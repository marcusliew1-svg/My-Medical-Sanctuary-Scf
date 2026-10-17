import { notFound } from "next/navigation";
import { isRegionalSection, LocalizedRegionalPage } from "@/components/LocalizedRegionalExperience";

type ChineseRegionalPageProps = {
  params: Promise<{ section: string }> | { section: string };
};

export default async function ChineseRegionalPage({ params }: ChineseRegionalPageProps) {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return <LocalizedRegionalPage locale="zh" section={section} />;
}
