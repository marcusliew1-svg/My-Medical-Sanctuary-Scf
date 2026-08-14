import { notFound } from "next/navigation";
import { isRegionalSection, LocalizedRegionalPage } from "@/components/LocalizedRegionalExperience";

export default function MalayRegionalPage({ params }: { params: { section: string } }) {
  if (!isRegionalSection(params.section)) notFound();
  return <LocalizedRegionalPage locale="ms" section={params.section} />;
}
