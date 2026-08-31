import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import {
  isMmsFeatureEnabled,
  isProductionDeployment,
} from "@/lib/featureGates";
import {
  internalApiConfigured,
  isValidInternalBearerToken,
} from "@/lib/internalApiAuth";
import type { OperationsRole } from "@/lib/healthIntelligence/operations";

export const HEALTH_INTELLIGENCE_REVIEWER_COOKIE = "mms_hi_reviewer";
const SESSION_SCOPE = "mms-health-intelligence-reviewer-v1";

function sessionSecret(): string {
  return process.env.MMS_OPERATOR_SESSION_SECRET?.trim() || "";
}

function maxAgeSeconds(): number {
  const configured = Number.parseInt(
    process.env.MMS_OPERATOR_SESSION_MAX_AGE_SECONDS || "900",
    10,
  );
  return Number.isFinite(configured)
    ? Math.min(Math.max(configured, 60), 900)
    : 900;
}

function digest(value: string): string {
  return createHmac("sha256", sessionSecret())
    .update(value)
    .digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function healthIntelligenceAuthConfigured(): boolean {
  return (
    isMmsFeatureEnabled("healthIntelligenceInternal") &&
    internalApiConfigured() &&
    sessionSecret().length >= 32
  );
}

export function issueHealthIntelligenceReviewerSession(now = Date.now()): {
  value: string;
  maxAge: number;
} {
  if (!healthIntelligenceAuthConfigured())
    throw new Error(
      "Health Intelligence reviewer authentication is not configured.",
    );
  const issuedAt = Math.floor(now / 1000);
  const nonce = randomBytes(18).toString("base64url");
  const payload = `${SESSION_SCOPE}.${issuedAt}.${nonce}`;
  return { value: `${payload}.${digest(payload)}`, maxAge: maxAgeSeconds() };
}

export function verifyHealthIntelligenceReviewerSession(
  value: string | undefined,
  now = Date.now(),
): boolean {
  if (!value || !healthIntelligenceAuthConfigured()) return false;
  const parts = value.split(".");
  if (parts.length !== 4 || parts[0] !== SESSION_SCOPE) return false;
  const issuedAt = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(issuedAt)) return false;
  const age = Math.floor(now / 1000) - issuedAt;
  if (age < 0 || age > maxAgeSeconds()) return false;
  const payload = parts.slice(0, 3).join(".");
  return safeEqual(digest(payload), parts[3]);
}

export function healthIntelligenceRequestAuthorized(
  request: NextRequest,
): boolean {
  if (!isMmsFeatureEnabled("healthIntelligenceInternal")) return false;
  if (isValidInternalBearerToken(request.headers.get("authorization")))
    return true;
  return verifyHealthIntelligenceReviewerSession(
    request.cookies.get(HEALTH_INTELLIGENCE_REVIEWER_COOKIE)?.value,
  );
}

export function healthIntelligenceOperationsRole(
  request: NextRequest,
): OperationsRole | null {
  if (!isMmsFeatureEnabled("healthIntelligenceInternal")) return null;
  if (isValidInternalBearerToken(request.headers.get("authorization")))
    return "admin";
  if (
    verifyHealthIntelligenceReviewerSession(
      request.cookies.get(HEALTH_INTELLIGENCE_REVIEWER_COOKIE)?.value,
    )
  )
    return "health_intelligence_reviewer";
  return null;
}

export function healthIntelligenceMutationOriginAllowed(
  request: NextRequest,
): boolean {
  if (isValidInternalBearerToken(request.headers.get("authorization")))
    return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    return (
      originUrl.host === request.nextUrl.host &&
      originUrl.protocol === request.nextUrl.protocol
    );
  } catch {
    return false;
  }
}

export function healthIntelligenceDemoModeEnabled(): boolean {
  return (
    !isProductionDeployment() &&
    process.env.MMS_HEALTH_INTELLIGENCE_DEMO_MODE === "true"
  );
}
