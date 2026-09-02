import type { Metadata } from "next";
import { LocalizedRegionalHome, regionalMetadata } from "@/components/LocalizedRegionalExperience";

export const metadata: Metadata = regionalMetadata("ms");

export default function MalayHome() {
  return <LocalizedRegionalHome locale="ms" />;
}
