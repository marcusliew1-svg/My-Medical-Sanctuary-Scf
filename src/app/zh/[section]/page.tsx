import { notFound } from "next/navigation";
import { isRegionalSection, LocalizedRegionalPage } from "@/components/LocalizedRegionalExperience";

export default function ChineseRegionalPage({ params }: { params: { section: string } }) {
  if (!isRegionalSection(params.section)) notFound();
  return <LocalizedRegionalPage locale="zh" section={params.section} />;
}
