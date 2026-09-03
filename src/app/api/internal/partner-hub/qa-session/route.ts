import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { MMS_PARTNER_SESSION_COOKIE } from "@/lib/partnerHubSession";
import { issueQaPartnerSession, partnerHubQaBootstrapEnabled } from "@/lib/partnerHubQaSession";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

const MAX_BODY_BYTES = 4_000;

function cleanString(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal MMS controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }
  if (!partnerHubQaBootstrapEnabled()) {
    return NextResponse.json(
      { status: "unavailable", message: "Partner Hub QA session bootstrap is disabled." },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 });
  }

  const allowedFields = new Set(["partnerId", "subject", "ttlMinutes"]);
  for (const key of Object.keys(body)) {
    if (!allowedFields.has(key)) {
      return NextResponse.json({ status: "invalid", message: `Unexpected field: ${key}.` }, { status: 400 });
    }
  }

  const partnerId = normalisePartnerId(cleanString(body.partnerId, 40));
  const subject = cleanString(body.subject, 200);
  const ttlMinutes = typeof body.ttlMinutes === "number" ? body.ttlMinutes : undefined;
  if (!partnerId || !subject) {
    return NextResponse.json({ status: "invalid", message: "partnerId and subject are required." }, { status: 400 });
  }

  const result = await issueQaPartnerSession({ partnerId, subject, ttlMinutes });
  if (result.status === "unavailable") {
    return NextResponse.json({ status: result.status, message: result.reason }, { status: 503 });
  }
  if (result.status === "not_found") {
    return NextResponse.json({ status: result.status, message: result.reason }, { status: 404 });
  }
  if (result.status === "not_allowed") {
    return NextResponse.json({ status: result.status, message: result.reason }, { status: 409 });
  }

  const response = NextResponse.json({
    status: "issued",
    partnerId: result.partnerId,
    expiresAt: result.expiresAt,
    qaOnly: true,
  });
  response.cookies.set({
    name: MMS_PARTNER_SESSION_COOKIE,
    value: result.sessionToken,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
    expires: new Date(result.expiresAt),
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
