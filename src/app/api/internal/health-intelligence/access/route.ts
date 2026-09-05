import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isValidInternalBearerToken } from "@/lib/internalApiAuth";
import {
  HEALTH_INTELLIGENCE_REVIEWER_COOKIE,
  healthIntelligenceAuthConfigured,
  issueHealthIntelligenceReviewerSession,
} from "@/lib/healthIntelligence/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!healthIntelligenceAuthConfigured())
    return new NextResponse("Not Found", { status: 404 });
  const form = await request.formData();
  const action = String(form.get("action") || "login");
  if (action === "logout") {
    const response = NextResponse.redirect(
      new URL("/internal/health-intelligence", request.url),
      303,
    );
    response.cookies.set({
      name: HEALTH_INTELLIGENCE_REVIEWER_COOKIE,
      value: "",
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: request.nextUrl.protocol === "https:",
    });
    return response;
  }
  const token = String(form.get("token") || "").trim();
  if (!isValidInternalBearerToken(`Bearer ${token}`)) {
    return NextResponse.redirect(
      new URL("/internal/health-intelligence?access=denied", request.url),
      303,
    );
  }
  const session = issueHealthIntelligenceReviewerSession();
  const response = NextResponse.redirect(
    new URL("/internal/health-intelligence", request.url),
    303,
  );
  response.cookies.set({
    name: HEALTH_INTELLIGENCE_REVIEWER_COOKIE,
    value: session.value,
    path: "/",
    maxAge: session.maxAge,
    httpOnly: true,
    sameSite: "strict",
    secure: request.nextUrl.protocol === "https:",
  });
  return response;
}
