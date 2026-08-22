import { notFound } from "next/navigation";
import { isRegionalSection, LocalizedRegionalPage } from "@/components/LocalizedRegionalExperience";

type MalayRegionalPageProps = {
  params: Promise<{ section: string }> | { section: string };
};

export default async function MalayRegionalPage({ params }: MalayRegionalPageProps) {
  const { section } = await params;
  if (!isRegionalSection(section)) notFound();
  return <LocalizedRegionalPage locale="ms" section={section} />;
}
