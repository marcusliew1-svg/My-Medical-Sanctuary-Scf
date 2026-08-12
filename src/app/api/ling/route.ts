import { NextResponse } from "next/server";
import { lingDisclaimer } from "@/lib/content";

const safeRoutes = [
  {
    keywords: ["screening", "checkup", "check-up", "blood", "baseline"],
    route: "/health-screening",
    label: "Health Screening",
  },
  {
    keywords: ["medicine", "drug", "price", "country", "access"],
    route: "/international-medicine-access",
    label: "International Medicine Access Intelligence",
  },
  {
    keywords: ["lab", "scf", "roadmap", "manufacturing"],
    route: "/scf-lab-roadmap",
    label: "SCF Lab Roadmap",
  },
  {
    keywords: ["longevity", "ageing", "aging"],
    route: "/longevity-medicine",
    label: "Longevity Medicine",
  },
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = String(body?.message ?? "").toLowerCase();
  const match = safeRoutes.find((item) =>
    item.keywords.some((keyword) => message.includes(keyword)),
  );

  return NextResponse.json({
    status: "education-routing-placeholder",
    message:
      "Ling is currently configured as an education and routing placeholder. Add server-side OpenAI after OPENAI_API_KEY, clinical policy and safety review are approved.",
    suggestedRoute: match
      ? { href: match.route, label: match.label }
      : { href: "/contact", label: "Start Discovery" },
    disclaimer: lingDisclaimer,
  });
}
