import type { NextRequest } from "next/server";
import {
  canUsePartnerHubCapability,
  partnerHubCapabilities,
  type PartnerHubAccessState,
  type PartnerHubCapability,
} from "@/lib/partnerHubAccess";
import {
  authenticatePartnerHubRequest,
  partnerIdFromAuthenticatedSession,
  type PartnerHubRequestAuthResult,
} from "@/lib/partnerHubRequestAuth";
import { partnerHubStore, partnerHubStoreAvailable } from "@/lib/partnerHubStore";

export type PartnerHubAuthorizationResult =
  | {
      status: "authorized";
      auth: Extract<PartnerHubRequestAuthResult, { status: "authenticated" }>;
      partnerId: string;
      accessState: PartnerHubAccessState;
      capabilities: PartnerHubCapability[];
    }
  | { status: "unauthenticated"; reason: string }
  | { status: "forbidden"; reason: string }
  | { status: "not_found"; reason: string }
  | { status: "conflict"; reason: string }
  | { status: "unavailable"; reason: string };

export async function authorizePartnerHubCapability(
  request: NextRequest,
  capability: PartnerHubCapability,
): Promise<PartnerHubAuthorizationResult> {
  const auth = await authenticatePartnerHubRequest(request);
  if (auth.status !== "authenticated") return auth;
  if (!partnerHubStoreAvailable()) {
    return { status: "unavailable", reason: "Partner Hub commercial access state is not configured." };
  }

  const partnerId = partnerIdFromAuthenticatedSession(auth);
  const result = await partnerHubStore().getAccessState(partnerId);
  if (result.status === "unavailable") return { status: "unavailable", reason: result.reason };
  if (result.status === "conflict") return { status: "conflict", reason: result.reason };
  if (!result.value) return { status: "not_found", reason: "Partner Hub access record was not found." };

  const accessState = result.value;
  const capabilities = partnerHubCapabilities(accessState);
  if (!canUsePartnerHubCapability(accessState, capability)) {
    return {
      status: "forbidden",
      reason: `Partner account is not permitted to use ${capability}.`,
    };
  }

  return { status: "authorized", auth, partnerId, accessState, capabilities };
}

export function requireStepUpForSensitivePartnerAction(
  authorization: Extract<PartnerHubAuthorizationResult, { status: "authorized" }>,
): void {
  if (authorization.auth.claims.assuranceLevel !== "step-up") {
    throw new Error("Recent step-up authentication is required for this Partner Hub action.");
  }
}
