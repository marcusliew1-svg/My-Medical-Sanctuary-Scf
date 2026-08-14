import { notFound } from "next/navigation";
import { isRegionalSection, LocalizedRegionalPage } from "@/components/LocalizedRegionalExperience";

export default function ThaiRegionalPage({ params }: { params: { section: string } }) {
  if (!isRegionalSection(params.section)) notFound();
  return <LocalizedRegionalPage locale="th" section={params.section} />;
}
