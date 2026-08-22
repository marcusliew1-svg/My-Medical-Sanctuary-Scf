import { notFound } from "next/navigation";
import { isRegionalSection, LocalizedRegionalPage } from "@/components/LocalizedRegionalExperience";

type ThaiRegionalPageProps = {
  params: Promise<{ section: string }> | { section: string };
};

export default async function ThaiRegionalPage({ params }: ThaiRegionalPageProps) {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return <LocalizedRegionalPage locale="th" section={section} />;
}
