import { createHash, randomBytes } from "node:crypto";
import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export type QaPartnerSessionIssueResult =
  | { status: "issued"; partnerId: string; sessionToken: string; expiresAt: string }
  | { status: "not_found"; reason: string }
  | { status: "not_allowed"; reason: string }
  | { status: "unavailable"; reason: string };

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function partnerHubQaBootstrapEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED === "true" &&
    process.env.MMS_PARTNER_HUB_ENABLED === "true" &&
    mmsCommercialDatabaseClientAvailable()
  );
}

/**
 * Non-production integration-test helper only.
 *
 * It deliberately creates the same opaque, database-backed session shape used
 * by the real Partner Hub session verifier so end-to-end tests can exercise
 * authorization, CSRF and Partner-scoped reads before a production identity
 * provider is selected. It must never be enabled in production.
 */
export async function issueQaPartnerSession(params: {
  partnerId: string;
  subject: string;
  ttlMinutes?: number;
}): Promise<QaPartnerSessionIssueResult> {
  if (!partnerHubQaBootstrapEnabled()) {
    return { status: "unavailable", reason: "Partner Hub QA session bootstrap is disabled." };
  }

  const partnerId = normalisePartnerId(params.partnerId);
  if (!partnerId) return { status: "not_found", reason: "A valid MMS Partner ID is required." };
  const subjectValue = params.subject.trim().slice(0, 197);
  const subject = subjectValue ? `qa:${subjectValue}` : "";
  if (!subject) return { status: "not_allowed", reason: "A QA session subject is required." };

  const ttlMinutes = Math.min(60, Math.max(5, Math.trunc(params.ttlMinutes || 30)));
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + ttlMinutes * 60_000);
  const sessionToken = randomBytes(32).toString("base64url");
  const client = mmsCommercialDatabaseClient();

  try {
    const result = await client.query<{ partner_code: string }>(
      `insert into mms_commercial.partner_sessions(
         session_id_hash, partner_id, subject, authentication_method,
         assurance_level, issued_at, expires_at
       )
       select $1, p.id, $3, 'managed-identity', 'standard', $4, $5
         from mms_commercial.partners p
        where upper(p.partner_code) = upper($2)
          and p.stage = 'Active'
          and p.selling_enabled = true
       returning (select partner_code from mms_commercial.partners where id = partner_id) as partner_code`,
      [sha256(sessionToken), partnerId, subject, issuedAt.toISOString(), expiresAt.toISOString()],
    );

    if (!result.rows[0]) {
      return {
        status: "not_allowed",
        reason: "Partner must exist and be Active with selling enabled before a QA session can be issued.",
      };
    }

    return {
      status: "issued",
      partnerId: result.rows[0].partner_code,
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    };
  } catch {
    return { status: "unavailable", reason: "Partner Hub QA session issuance is unavailable." };
  }
}
