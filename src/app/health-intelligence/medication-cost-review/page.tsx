import type { Metadata } from "next";
import { PublicMedicineIntelligence } from "@/components/PublicMedicineIntelligence";

export const metadata: Metadata = {
  title: "Medication Cost Review",
  description:
    "Frame a medication cost question carefully before requesting a professional review with MMS.",
};
export default function MedicationCostReviewPage() {
  return <PublicMedicineIntelligence mode="cost" />;
}
