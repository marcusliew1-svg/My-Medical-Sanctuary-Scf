import type { Metadata } from "next";
import { PublicMedicineIntelligence } from "@/components/PublicMedicineIntelligence";

export const metadata: Metadata = {
  title: "Medicine Price Intelligence",
  description:
    "Understand verified medicine reference observations, market differences and access limitations with MMS.",
};
export default function MedicinePricesPage() {
  return <PublicMedicineIntelligence mode="prices" />;
}
