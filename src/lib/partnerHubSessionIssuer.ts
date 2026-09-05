import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export type PartnerSessionIssueResult =
  | { status: "issued"; sessionToken: string; partnerId: string; subject: string; expiresAt: string; maxAge: number }
  | { status: "not_allowed" }
  | { status: "unavailable" };

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export async function issuePartnerHubSession(params: {
  partnerId: string;
  subject: string;
  maxAgeSeconds: number;
}): Promise<PartnerSessionIssueResult> {
  if (process.env.MMS_PARTNER_HUB_ENABLED !== "true" || !mmsCommercialDatabaseClientAvailable()) {
    return { status: "unavailable" };
  }
  const partnerId = normalisePartnerId(params.partnerId);
  const subject = params.subject.trim().slice(0, 200);
  if (!partnerId || !subject) return { status: "not_allowed" };

  const configured = Number(process.env.MMS_PARTNER_SESSION_MAX_AGE_SECONDS || 3600);
  const configuredMax = Number.isFinite(configured) ? Math.min(Math.max(Math.floor(configured), 300), 3600) : 3600;
  const maxAge = Math.min(configuredMax, Math.max(60, Math.floor(params.maxAgeSeconds)));
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + maxAge * 1000);
  const sessionToken = randomBytes(32).toString("base64url");

  try {
    const result = await mmsCommercialDatabaseClient().query<{ partner_code: string }>(
      `insert into mms_commercial.partner_sessions(
         session_id_hash, partner_id, subject, authentication_method,
         assurance_level, issued_at, expires_at
       )
       select $1, p.id, $3, 'managed-identity', 'standard', $4, $5
         from mms_commercial.partners p
        where upper(p.partner_code) = upper($2)
          and p.stage in ('Approved','Agreement Pending','Training','Active')
       returning (select partner_code from mms_commercial.partners where id = partner_id) as partner_code`,
      [sha256(sessionToken), partnerId, subject, issuedAt.toISOString(), expiresAt.toISOString()],
    );
    const row = result.rows[0];
    if (!row) return { status: "not_allowed" };
    return { status: "issued", sessionToken, partnerId: row.partner_code, subject, expiresAt: expiresAt.toISOString(), maxAge };
  } catch {
    return { status: "unavailable" };
  }
}
