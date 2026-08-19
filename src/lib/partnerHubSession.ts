import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { postgresPartnerHubSessionProvider } from "@/lib/partnerHubSessionPostgres";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export const MMS_PARTNER_SESSION_COOKIE = "mms_partner_session";

export type PartnerHubSessionClaims = {
  sessionId: string;
  partnerId: string;
  subject: string;
  issuedAt: string;
  expiresAt: string;
  authenticationMethod: "passwordless" | "oidc" | "sso" | "managed-identity";
  assuranceLevel: "standard" | "step-up";
};

export type PartnerHubSessionResult =
  | { status: "authenticated"; claims: PartnerHubSessionClaims }
  | { status: "unauthenticated"; reason: string }
  | { status: "unavailable"; reason: string };

export type PartnerHubSessionProvider = {
  verify(sessionToken: string): Promise<PartnerHubSessionResult>;
  revoke(sessionId: string): Promise<{ status: "ok" } | { status: "unavailable"; reason: string }>;
};

export const PARTNER_HUB_SESSION_REQUIREMENTS = Object.freeze([
  "Partner-facing access must use an individual authenticated session, never MMS_INTERNAL_API_TOKEN or MMS_FINANCE_API_TOKEN.",
  "The authenticated Partner ID must be derived server-side from verified session claims and must never come from a query parameter or browser-supplied Partner ID.",
  "Session identifiers must be opaque, unguessable and revocable.",
  "Session cookies must be HttpOnly, Secure in production, SameSite=Lax or stricter and scoped to the MMS first-party domain/path.",
  "Sessions must have an explicit expiry and be rejected after expiry.",
  "Suspension or inactivation must be able to revoke existing Partner sessions promptly.",
  "Sensitive future mutations should require recent/step-up authentication plus CSRF protection where cookie sessions are used.",
  "Partner Hub authentication must not expose Finance or internal-operations credentials to the browser.",
]);

function requireTimestamp(value: string, field: string): number {
  const timestamp = Date.parse(value);
  if (!value || Number.isNaN(timestamp)) throw new Error(`${field} must be a valid timestamp.`);
  return timestamp;
}

export function validatePartnerHubSessionClaims(claims: PartnerHubSessionClaims, now = Date.now()): PartnerHubSessionClaims {
  if (!/^[A-Za-z0-9_-]{16,200}$/.test(claims.sessionId.trim())) throw new Error("Partner session ID is invalid.");
  if (!claims.subject.trim()) throw new Error("Partner session subject is required.");
  const partnerId = normalisePartnerId(claims.partnerId);
  if (!partnerId) throw new Error("Partner session does not contain a valid permanent MMS Partner ID.");
  const issuedAt = requireTimestamp(claims.issuedAt, "issuedAt");
  const expiresAt = requireTimestamp(claims.expiresAt, "expiresAt");
  if (expiresAt <= issuedAt) throw new Error("Partner session expiry must be after issue time.");
  if (expiresAt <= now) throw new Error("Partner session has expired.");
  if (issuedAt > now + 5 * 60 * 1000) throw new Error("Partner session issue time is invalid.");
  return { ...claims, partnerId };
}

export function partnerHubSessionProviderAvailable(): boolean {
  return process.env.MMS_PARTNER_HUB_ENABLED === "true" && mmsCommercialDatabaseClientAvailable();
}

/**
 * Uses the dedicated MMS commercial PostgreSQL backend only when both the Hub
 * feature gate and database client are operational. Otherwise authentication
 * remains fail-closed; never substitute a shared bearer token or unsigned
 * browser identity.
 */
export function partnerHubSessionProvider(): PartnerHubSessionProvider {
  if (partnerHubSessionProviderAvailable()) {
    return postgresPartnerHubSessionProvider(mmsCommercialDatabaseClient());
  }

  return {
    async verify() {
      return {
        status: "unavailable",
        reason: "Partner Hub identity/session provider is not configured.",
      };
    },
    async revoke() {
      return {
        status: "unavailable",
        reason: "Partner Hub identity/session provider is not configured.",
      };
    },
  };
}
