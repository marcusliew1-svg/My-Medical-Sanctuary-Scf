import { createHash } from "node:crypto";
import type { MmsCommercialDatabaseClient } from "@/lib/mmsCommercialDatabaseClient";
import type {
  PartnerHubSessionClaims,
  PartnerHubSessionProvider,
  PartnerHubSessionResult,
} from "@/lib/partnerHubSession";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new Error("Database returned an invalid session timestamp.");
  return date.toISOString();
}

function unavailable(): PartnerHubSessionResult {
  return {
    status: "unavailable",
    reason: "Partner Hub session database operation is unavailable.",
  };
}

function claimsFromRow(row: {
  session_id: string;
  partner_code: string;
  subject: string;
  authentication_method: PartnerHubSessionClaims["authenticationMethod"];
  assurance_level: PartnerHubSessionClaims["assuranceLevel"];
  issued_at: unknown;
  expires_at: unknown;
}): PartnerHubSessionClaims {
  const partnerId = normalisePartnerId(row.partner_code);
  if (!partnerId) throw new Error("Database returned an invalid permanent Partner ID.");
  const issuedAt = iso(row.issued_at);
  const expiresAt = iso(row.expires_at);
  if (Date.parse(expiresAt) <= Date.parse(issuedAt) || Date.parse(expiresAt) <= Date.now()) {
    throw new Error("Database returned an expired or invalid Partner session.");
  }
  if (!row.subject.trim()) throw new Error("Database returned a Partner session without a subject.");
  return {
    sessionId: row.session_id,
    partnerId,
    subject: row.subject,
    issuedAt,
    expiresAt,
    authenticationMethod: row.authentication_method,
    assuranceLevel: row.assurance_level,
  };
}

export function postgresPartnerHubSessionProvider(
  client: MmsCommercialDatabaseClient,
): PartnerHubSessionProvider {
  return {
    async verify(sessionToken) {
      const token = sessionToken.trim();
      if (!/^[A-Za-z0-9_-]{32,512}$/.test(token)) {
        return { status: "unauthenticated", reason: "Partner session token is invalid." };
      }

      try {
        const result = await client.query<{
          session_id: string;
          partner_code: string;
          subject: string;
          authentication_method: PartnerHubSessionClaims["authenticationMethod"];
          assurance_level: PartnerHubSessionClaims["assuranceLevel"];
          issued_at: unknown;
          expires_at: unknown;
          partner_stage: string;
        }>(
          `select s.id::text as session_id,
                  p.partner_code,
                  s.subject,
                  s.authentication_method,
                  s.assurance_level,
                  s.issued_at,
                  s.expires_at,
                  p.stage as partner_stage
             from mms_commercial.partner_sessions s
             join mms_commercial.partners p on p.id = s.partner_id
            where s.session_id_hash = $1
              and s.revoked_at is null
              and s.expires_at > now()
            limit 1`,
          [sha256(token)],
        );

        const row = result.rows[0];
        if (!row) return { status: "unauthenticated", reason: "Partner session is not active." };
        if (row.partner_stage === "Suspended" || row.partner_stage === "Inactive" || row.partner_stage === "Rejected") {
          return { status: "unauthenticated", reason: "Partner account is not permitted to use an active session." };
        }

        return { status: "authenticated", claims: claimsFromRow(row) };
      } catch {
        return unavailable();
      }
    },

    async revoke(sessionId) {
      if (!/^[0-9a-fA-F-]{36}$/.test(sessionId.trim())) {
        return { status: "ok" };
      }
      try {
        await client.query(
          `update mms_commercial.partner_sessions
              set revoked_at = coalesce(revoked_at, now()),
                  revoke_reason = coalesce(revoke_reason, 'Partner logout')
            where id = $1::uuid`,
          [sessionId],
        );
        return { status: "ok" };
      } catch {
        return { status: "unavailable", reason: "Partner Hub session revocation is unavailable." };
      }
    },
  };
}
