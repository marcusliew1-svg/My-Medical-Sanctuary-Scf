import { createHash, randomBytes } from "node:crypto";
import type { MmsCommercialDatabaseClient } from "@/lib/mmsCommercialDatabaseClient";
import type { PartnerHubCsrfProvider } from "@/lib/partnerHubMutationSecurity";

const CSRF_TTL_MS = 15 * 60 * 1000;

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function postgresPartnerHubCsrfProvider(
  client: MmsCommercialDatabaseClient,
): PartnerHubCsrfProvider {
  return {
    async issue({ sessionId }) {
      if (!/^[0-9a-fA-F-]{36}$/.test(sessionId.trim())) {
        return { status: "unavailable", reason: "Partner Hub session identifier is invalid." };
      }

      const csrfToken = randomBytes(32).toString("base64url");
      const expiresAt = new Date(Date.now() + CSRF_TTL_MS).toISOString();
      try {
        const result = await client.query(
          `insert into mms_commercial.partner_csrf_tokens(session_id, token_hash, issued_at, expires_at)
           select s.id, $2, now(), $3::timestamptz
             from mms_commercial.partner_sessions s
            where s.id = $1::uuid
              and s.revoked_at is null
              and s.expires_at > now()
           returning id`,
          [sessionId, sha256(csrfToken), expiresAt],
        );
        if (result.rowCount !== 1) {
          return { status: "unavailable", reason: "Partner Hub session is not active for CSRF issuance." };
        }
        return { status: "issued", csrfToken, expiresAt };
      } catch {
        return { status: "unavailable", reason: "Partner Hub CSRF issuance is unavailable." };
      }
    },

    async verify({ sessionId, csrfToken }) {
      if (!/^[0-9a-fA-F-]{36}$/.test(sessionId.trim()) || !/^[A-Za-z0-9_-]{32,200}$/.test(csrfToken.trim())) {
        return { status: "invalid" };
      }

      try {
        const result = await client.query(
          `update mms_commercial.partner_csrf_tokens t
              set consumed_at = now()
             from mms_commercial.partner_sessions s
            where t.session_id = s.id
              and s.id = $1::uuid
              and s.revoked_at is null
              and s.expires_at > now()
              and t.token_hash = $2
              and t.consumed_at is null
              and t.expires_at > now()
           returning t.id`,
          [sessionId, sha256(csrfToken.trim())],
        );
        return result.rowCount === 1 ? { status: "valid" } : { status: "invalid" };
      } catch {
        return { status: "unavailable", reason: "Partner Hub CSRF verification is unavailable." };
      }
    },
  };
}
