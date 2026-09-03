import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { lingDisclaimer } from "@/lib/content";
import {
  bodyTooLarge,
  clean,
  hasAllowedPublicOrigin,
  publicRequestClientKey,
  publicSubmissionErrorStatus,
  readPublicForm,
} from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

const safeRoutes = [
  { keywords: ["screening", "checkup", "check-up", "blood", "baseline"], route: "/health-screening", label: "Health Screening" },
  { keywords: ["medicine", "drug", "price", "country", "access"], route: "/international-medicine-access", label: "International Medicine Access Intelligence" },
  { keywords: ["lab", "scf", "roadmap", "manufacturing"], route: "/scf-lab-roadmap", label: "SCF Lab Roadmap" },
  { keywords: ["longevity", "ageing", "aging"], route: "/longevity-medicine", label: "Longevity Medicine" },
];

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request)) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }
  if (!hasAllowedPublicOrigin(request)) {
    return NextResponse.json({ status: "denied", message: "This request could not be accepted." }, { status: 403 });
  }

  const rateLimit = checkInMemoryRateLimit(`ling:${publicRequestClientKey(request)}`, { limit: 20, windowMs: 10 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ status: "rate_limited", message: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } });
  }

  let body: Record<string, string>;
  try {
    body = await readPublicForm(request);
  } catch (error) {
    const status = publicSubmissionErrorStatus(error);
    return NextResponse.json({ status: "invalid", message: status === 413 ? "Request is too large." : "Unsupported or invalid request format." }, { status });
  }

  if (Object.keys(body).some((key) => key !== "message") || (body.message ?? "").length > 1_000) {
    return NextResponse.json({ status: "invalid", message: "The education request is invalid or too long." }, { status: 400 });
  }

  const message = clean(body.message, 1_000).toLowerCase();
  const match = safeRoutes.find((item) => item.keywords.some((keyword) => message.includes(keyword)));

  return NextResponse.json({
    status: "education-routing-placeholder",
    message: "Ling is currently configured as an education and routing placeholder. Add server-side OpenAI only after clinical policy and safety review are approved.",
    suggestedRoute: match ? { href: match.route, label: match.label } : { href: "/contact", label: "Start Discovery" },
    disclaimer: lingDisclaimer,
  });
}
