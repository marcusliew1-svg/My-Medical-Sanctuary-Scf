import type { Metadata } from "next";
import { PartnerHubDashboardClient } from "@/components/PartnerHubDashboardClient";

export const metadata: Metadata = {
  title: "Partner Hub",
  description: "My Medical Sanctuary Sales Partner Hub.",
  robots: { index: false, follow: false },
};

export default function PartnerHubPage() {
  return <PartnerHubDashboardClient />;
}
