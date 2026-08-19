import type { Metadata } from "next";
import { PartnerHubAcademyClient } from "@/components/PartnerHubAcademyClient";

export const metadata: Metadata = {
  title: "Partner Academy",
  robots: { index: false, follow: false },
};

export default function PartnerHubAcademyPage() {
  return <PartnerHubAcademyClient />;
}
