import type { NextRequest } from "next/server";
import type { PartnerHubSessionClaims } from "@/lib/partnerHubSession";

export const MMS_PARTNER_CSRF_HEADER = "x-mms-csrf-token";

export type PartnerHubCsrfProvider = {
  issue(params: {
    sessionId: string;
  }): Promise<
    | { status: "issued"; csrfToken: string; expiresAt: string }
    | { status: "unavailable"; reason: string }
  >;
  verify(params: {
    sessionId: string;
    csrfToken: string;
  }): Promise<{ status: "valid" } | { status: "invalid" } | { status: "unavailable"; reason: string }>;
};

export type PartnerHubMutationSecurityResult =
  | { status: "ok" }
  | { status: "forbidden"; reason: string }
  | { status: "unavailable"; reason: string };

export const PARTNER_HUB_MUTATION_SECURITY_REQUIREMENTS = Object.freeze([
  "Cookie-authenticated Partner mutations must enforce same-origin checks and CSRF validation server-side.",
  "The Origin header must match the configured first-party MMS site origin.",
  "Sec-Fetch-Site must be same-origin or same-site when supplied; cross-site mutation requests must be rejected.",
  "CSRF tokens must be opaque, session-bound, short-lived and validated server-side; they must not be accepted from query parameters.",
  "CSRF tokens must be issued only after successful Partner session authentication and must not expose the underlying session token.",
  "CSRF validation supplements Partner authentication and capability authorization; it never replaces either control.",
  "Sensitive future mutations may additionally require recent step-up authentication.",
]);

function configuredSiteOrigin(): string {
  const raw = process.env.MMS_SITE_URL?.trim() || "";
  if (!raw) return "";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
}

export function partnerHubCsrfProviderAvailable(): boolean {
  return false;
}

/**
 * Deliberately unavailable until the Partner identity/session backend can issue
 * and validate session-bound anti-CSRF tokens. Do not substitute a static
 * application secret or a browser-generated unsigned token.
 */
export function partnerHubCsrfProvider(): PartnerHubCsrfProvider {
  return {
    async issue() {
      return {
        status: "unavailable",
        reason: "Partner Hub CSRF token provider is not configured.",
      };
    },
    async verify() {
      return {
        status: "unavailable",
        reason: "Partner Hub CSRF token provider is not configured.",
      };
    },
  };
}

export async function protectPartnerHubMutation(
  request: NextRequest,
  claims: PartnerHubSessionClaims,
): Promise<PartnerHubMutationSecurityResult> {
  const allowedOrigin = configuredSiteOrigin();
  if (!allowedOrigin) {
    return { status: "unavailable", reason: "Canonical MMS site origin is not configured." };
  }

  const origin = request.headers.get("origin")?.trim() || "";
  if (!origin || origin !== allowedOrigin) {
    return { status: "forbidden", reason: "Partner Hub mutation origin is not permitted." };
  }

  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase() || "";
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") {
    return { status: "forbidden", reason: "Cross-site Partner Hub mutation requests are not permitted." };
  }

  const csrfToken = request.headers.get(MMS_PARTNER_CSRF_HEADER)?.trim() || "";
  if (!csrfToken) {
    return { status: "forbidden", reason: "Partner Hub CSRF token is required." };
  }
  if (!partnerHubCsrfProviderAvailable()) {
    return { status: "unavailable", reason: "Partner Hub CSRF token provider is not configured." };
  }

  const result = await partnerHubCsrfProvider().verify({
    sessionId: claims.sessionId,
    csrfToken,
  });
  if (result.status === "unavailable") return { status: "unavailable", reason: result.reason };
  if (result.status !== "valid") return { status: "forbidden", reason: "Partner Hub CSRF token is invalid." };
  return { status: "ok" };
}
