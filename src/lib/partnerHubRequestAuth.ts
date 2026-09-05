import type { NextRequest } from "next/server";
import {
  MMS_PARTNER_SESSION_COOKIE,
  partnerHubSessionProvider,
  partnerHubSessionProviderAvailable,
  validatePartnerHubSessionClaims,
  type PartnerHubSessionClaims,
} from "@/lib/partnerHubSession";
import {
  getPartnerIdentityUser,
  MMS_PARTNER_ACCESS_TOKEN_COOKIE,
  partnerIdentityConfigured,
  partnerMetadataFromUser,
} from "@/lib/partnerIdentity";

export type PartnerHubRequestAuthResult =
  | { status: "authenticated"; claims: PartnerHubSessionClaims }
  | { status: "unauthenticated"; reason: string }
  | { status: "unavailable"; reason: string };

export async function authenticatePartnerHubRequest(request: NextRequest): Promise<PartnerHubRequestAuthResult> {
  return authenticatePartnerHubTokens(
    request.cookies.get(MMS_PARTNER_SESSION_COOKIE)?.value?.trim() || "",
    request.cookies.get(MMS_PARTNER_ACCESS_TOKEN_COOKIE)?.value?.trim() || "",
  );
}

export async function authenticatePartnerHubTokens(
  sessionToken: string,
  accessToken: string,
): Promise<PartnerHubRequestAuthResult> {
  if (process.env.MMS_PARTNER_HUB_ENABLED !== "true") {
    return { status: "unavailable", reason: "Partner Hub access is disabled." };
  }
  if (!partnerHubSessionProviderAvailable()) {
    return { status: "unavailable", reason: "Partner Hub identity/session provider is not configured." };
  }

  if (!sessionToken) return { status: "unauthenticated", reason: "Partner session is required." };

  const result = await partnerHubSessionProvider().verify(sessionToken);
  if (result.status !== "authenticated") return result;

  try {
    const claims = validatePartnerHubSessionClaims(result.claims);
    const qaSession = process.env.NODE_ENV !== "production"
      && process.env.MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED === "true"
      && claims.subject.startsWith("qa:");
    if (qaSession) return { status: "authenticated", claims };

    if (!partnerIdentityConfigured()) {
      return { status: "unavailable", reason: "Partner identity provider is not configured." };
    }
    const identity = await getPartnerIdentityUser(accessToken);
    if (identity.status === "unavailable") return { status: "unavailable", reason: "Partner identity verification is unavailable." };
    if (identity.status !== "ok") return { status: "unauthenticated", reason: "Partner identity session is invalid or expired." };
    const metadata = partnerMetadataFromUser(identity.value);
    if (!metadata || metadata.subject !== claims.subject || metadata.partnerId !== claims.partnerId) {
      return { status: "unauthenticated", reason: "Partner identity does not match the active Partner session." };
    }
    return { status: "authenticated", claims };
  } catch {
    return { status: "unauthenticated", reason: "Partner session is invalid or expired." };
  }
}

export function partnerIdFromAuthenticatedSession(result: Extract<PartnerHubRequestAuthResult, { status: "authenticated" }>): string {
  return result.claims.partnerId;
}
