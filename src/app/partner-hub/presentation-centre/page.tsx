import type { Metadata } from "next";
import { PartnerPresentationCentreClient } from "@/components/PartnerPresentationCentreClient";

export const metadata: Metadata = {
  title: "Presentation Centre",
  robots: { index: false, follow: false },
};

export default function PartnerPresentationCentrePage() {
  return <PartnerPresentationCentreClient />;
}
