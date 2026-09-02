import type { Metadata } from "next";
import { LocalizedRegionalHome, regionalMetadata } from "@/components/LocalizedRegionalExperience";

export const metadata: Metadata = regionalMetadata("zh");

export default function ChineseHome() {
  return <LocalizedRegionalHome locale="zh" />;
}
