import type { Metadata } from "next";
import { PublicMedicineIntelligence } from "@/components/PublicMedicineIntelligence";

export const metadata: Metadata = {
  title: "Generic Medicine Intelligence",
  description:
    "Explore potential generic medicine relationships with clear boundaries and professional review.",
};
export default function GenericMedicinesPage() {
  return <PublicMedicineIntelligence mode="generic" />;
}
