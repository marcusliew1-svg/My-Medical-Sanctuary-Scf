import type { Metadata } from "next";
import { PartnerHubCommercialStatusClient } from "@/components/PartnerHubCommercialStatusClient";

export const metadata: Metadata = {
  title: "Applications & Memberships",
  robots: { index: false, follow: false },
};

export default function PartnerHubCommercialStatusPage() {
  return <PartnerHubCommercialStatusClient />;
}
