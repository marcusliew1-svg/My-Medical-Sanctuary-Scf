import type { Metadata } from "next";
import { PartnerHubCommissionWalletClient } from "@/components/PartnerHubCommissionWalletClient";

export const metadata: Metadata = {
  title: "Commission Wallet | MMS Partner Hub",
  robots: { index: false, follow: false },
};

export default function PartnerHubCommissionWalletPage() {
  return <PartnerHubCommissionWalletClient />;
}
