import type { Metadata } from "next";
import { LocalizedRegionalHome, regionalMetadata } from "@/components/LocalizedRegionalExperience";

export const metadata: Metadata = regionalMetadata("th");

export default function ThaiHome() {
  return <LocalizedRegionalHome locale="th" />;
}
