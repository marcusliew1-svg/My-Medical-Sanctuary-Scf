import type { Metadata } from "next";
import { PartnerHubLeadsClient } from "@/components/PartnerHubLeadsClient";

export const metadata: Metadata = {
  title: "Partner Leads",
  robots: { index: false, follow: false },
};

export default function PartnerHubLeadsPage() {
  return <PartnerHubLeadsClient />;
}
