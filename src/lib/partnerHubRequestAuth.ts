import type { NextRequest } from "next/server";
import {
  MMS_PARTNER_SESSION_COOKIE,
  partnerHubSessionProvider,
  partnerHubSessionProviderAvailable,
  validatePartnerHubSessionClaims,
  type PartnerHubSessionClaims,
} from "@/lib/partnerHubSession";

export type PartnerHubRequestAuthResult =
  | { status: "authenticated"; claims: PartnerHubSessionClaims }
  | { status: "unauthenticated"; reason: string }
  | { status: "unavailable"; reason: string };

export async function authenticatePartnerHubRequest(request: NextRequest): Promise<PartnerHubRequestAuthResult> {
  if (process.env.MMS_PARTNER_HUB_ENABLED !== "true") {
    return { status: "unavailable", reason: "Partner Hub access is disabled." };
  }
  if (!partnerHubSessionProviderAvailable()) {
    return { status: "unavailable", reason: "Partner Hub identity/session provider is not configured." };
  }

  const token = request.cookies.get(MMS_PARTNER_SESSION_COOKIE)?.value?.trim() || "";
  if (!token) return { status: "unauthenticated", reason: "Partner session is required." };

  const result = await partnerHubSessionProvider().verify(token);
  if (result.status !== "authenticated") return result;

  try {
    return { status: "authenticated", claims: validatePartnerHubSessionClaims(result.claims) };
  } catch {
    return { status: "unauthenticated", reason: "Partner session is invalid or expired." };
  }
}

export function partnerIdFromAuthenticatedSession(result: Extract<PartnerHubRequestAuthResult, { status: "authenticated" }>): string {
  return result.claims.partnerId;
}
