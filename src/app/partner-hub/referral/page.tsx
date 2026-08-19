import type { Metadata } from "next";
import { PartnerHubReferralClient } from "@/components/PartnerHubReferralClient";

export const metadata: Metadata = {
  title: "Referral Tools | MMS Partner Hub",
  robots: { index: false, follow: false },
};

export default function PartnerHubReferralPage() {
  return <PartnerHubReferralClient />;
}
