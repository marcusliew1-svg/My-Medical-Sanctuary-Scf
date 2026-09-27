import { createHash, randomBytes } from "node:crypto";
import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { partnerIdentitySessionMethod } from "@/lib/partnerIdentity";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export type PartnerIdentitySessionIssueResult =
  | { status: "issued"; partnerId: string; sessionToken: string; expiresAt: string }
  | { status: "not_allowed"; reason: string }
  | { status: "unavailable"; reason: string };

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export async function issuePartnerIdentitySession(params: {
  partnerId: string;
  subject: string;
  ttlHours?: number;
}): Promise<PartnerIdentitySessionIssueResult> {
  if (process.env.MMS_PARTNER_HUB_ENABLED !== "true" || !mmsCommercialDatabaseClientAvailable()) {
    return { status: "unavailable", reason: "Partner Hub session services are not enabled." };
  }

  const partnerId = normalisePartnerId(params.partnerId);
  const subject = params.subject.trim().slice(0, 200);
  if (!partnerId || !subject) {
    return { status: "not_allowed", reason: "Partner identity is not linked to an authorised MMS Partner account." };
  }

  const ttlHours = Math.min(12, Math.max(1, Math.trunc(params.ttlHours || 8)));
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + ttlHours * 60 * 60 * 1000);
  const sessionToken = randomBytes(32).toString("base64url");
  const client = mmsCommercialDatabaseClient();

  try {
    const result = await client.transaction(async (tx) => {
      const partner = await tx.query<{ id: string; partner_code: string }>(
        `select id::text, partner_code
           from mms_commercial.partners
          where upper(partner_code) = upper($1)
            and stage in ('Approved', 'Agreement Pending', 'Training', 'Active', 'Suspended', 'Inactive')
          limit 1`,
        [partnerId],
      );

      const row = partner.rows[0];
      if (!row) return null;

      await tx.query(
        `update mms_commercial.partner_sessions
            set revoked_at = coalesce(revoked_at, now()),
                revoke_reason = coalesce(revoke_reason, 'Superseded by new partner sign-in')
          where subject = $1
            and revoked_at is null
            and expires_at > now()`,
        [subject],
      );

      await tx.query(
        `insert into mms_commercial.partner_sessions(
           session_id_hash, partner_id, subject, authentication_method,
           assurance_level, issued_at, expires_at
         )
         values ($1, $2::uuid, $3, $4, 'standard', $5, $6)`,
        [
          sha256(sessionToken),
          row.id,
          subject,
          partnerIdentitySessionMethod(),
          issuedAt.toISOString(),
          expiresAt.toISOString(),
        ],
      );

      return row.partner_code;
    });

    if (!result) {
      return { status: "not_allowed", reason: "This identity is not linked to a Partner account permitted to use the Hub." };
    }

    return {
      status: "issued",
      partnerId: result,
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    };
  } catch {
    return { status: "unavailable", reason: "Partner Hub session issuance is temporarily unavailable." };
  }
}
