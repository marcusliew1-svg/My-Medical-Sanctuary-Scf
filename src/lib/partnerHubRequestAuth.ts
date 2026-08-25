import type { NextRequest } from "next/server";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";
import { type PartnerHubSessionClaims } from "@/lib/partnerHubSession";
import {
  MMS_SUPABASE_ACCESS_COOKIE,
  getSupabaseUser,
  supabaseAuthConfigured,
} from "@/lib/supabaseAuth";

export type PartnerHubRequestAuthResult =
  | { status: "authenticated"; claims: PartnerHubSessionClaims }
  | { status: "unauthenticated"; reason: string }
  | { status: "unavailable"; reason: string };

export async function authenticatePartnerHubRequest(request: NextRequest): Promise<PartnerHubRequestAuthResult> {
  if (process.env.MMS_PARTNER_HUB_ENABLED !== "true") {
    return { status: "unavailable", reason: "Partner Hub access is disabled." };
  }
  if (!supabaseAuthConfigured()) {
    return { status: "unavailable", reason: "Supabase Partner authentication is not configured." };
  }

  const token = request.cookies.get(MMS_SUPABASE_ACCESS_COOKIE)?.value?.trim() || "";
  if (!token) return { status: "unauthenticated", reason: "Partner session is required." };

  const user = await getSupabaseUser(token);
  if (!user) return { status: "unauthenticated", reason: "Partner session is invalid or expired." };

  // Authorization data must come from app_metadata, which cannot be edited by the end user.
  // Never use user_metadata for Partner Hub authorization.
  const partnerId = normalisePartnerId(
    typeof user.app_metadata?.partner_id === "string" ? user.app_metadata.partner_id : null,
  );
  if (!partnerId) {
    return { status: "unauthenticated", reason: "This account is not linked to an active MMS Partner ID." };
  }

  const now = Date.now();
  return {
    status: "authenticated",
    claims: {
      sessionId: user.id,
      partnerId,
      subject: user.id,
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 60 * 60 * 1000).toISOString(),
      authenticationMethod: "managed-identity",
      assuranceLevel: "standard",
    },
  };
}

export function partnerIdFromAuthenticatedSession(result: Extract<PartnerHubRequestAuthResult, { status: "authenticated" }>): string {
  return result.claims.partnerId;
}
