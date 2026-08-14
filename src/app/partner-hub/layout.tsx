import type { Metadata } from "next";
import { PartnerHubShell } from "@/components/PartnerHubShell";

export const metadata: Metadata = {
  title: "Partner Hub",
  description: "MMS partner sales enablement, lead ownership, training and commission workspace.",
};

export default function PartnerHubLayout({ children }: { children: React.ReactNode }) {
  return <PartnerHubShell>{children}</PartnerHubShell>;
}
