import {
  mmsCommercialDatabaseClient,
  mmsCommercialDatabaseClientAvailable,
  type MmsCommercialDatabaseClient,
} from "@/lib/mmsCommercialDatabaseClient";
import { parsePartnerCrmState } from "@/lib/partnerCrmState";
import { SALES_PARTNER_CORE_MODULES } from "@/lib/partnerTraining";

const CERTIFICATION_VERSION = "MMS-SP-CERT-2026-08-v1";
const moduleIds = new Set<string>(SALES_PARTNER_CORE_MODULES.map((trainingModule) => trainingModule.id));

export type PartnerRegistrySyncResult =
  | {
      status: "synced";
      partnerId: string;
      crmRecordId: string;
      stage: string;
      trainingEvidenceRows: number;
      assessmentRows: number;
      certificationRows: number;
      auditRows: number;
    }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

type ParsedTrainingModule = {
  moduleId: string;
  version: string;
  completedAt: string;
  acknowledgedAt: string;
  passed: boolean;
  refreshRequired: boolean;
};

function latestLine(description: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...description.matchAll(new RegExp(`^${escaped}:\\s*(.*)$`, "gim"))];
  return matches.at(-1)?.[1]?.trim() || "";
}

function nullableTimestamp(value: string): string | null {
  if (!value || value.toLowerCase() === "pending" || Number.isNaN(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function parseTrainingModules(description: string): ParsedTrainingModule[] {
  const latestByModule = new Map<string, ParsedTrainingModule>();
  const pattern = /^Training Module\s+([^|\r\n]+)\s*\|\s*version=([^|\r\n]+)\s*\|\s*completed=([^|\r\n]+)\s*\|\s*acknowledged=([^|\r\n]+)\s*\|\s*passed=(yes|no)\s*\|\s*refresh=(yes|no)\s*$/gim;

  for (const match of description.matchAll(pattern)) {
    const moduleId = String(match[1] || "").trim();
    const version = String(match[2] || "").trim();
    const completedAt = nullableTimestamp(String(match[3] || "").trim());
    const acknowledgedAt = nullableTimestamp(String(match[4] || "").trim());
    if (!moduleIds.has(moduleId) || !version || !completedAt || !acknowledgedAt) continue;
    latestByModule.set(moduleId, {
      moduleId,
      version,
      completedAt,
      acknowledgedAt,
      passed: String(match[5] || "").toLowerCase() === "yes",
      refreshRequired: String(match[6] || "").toLowerCase() === "yes",
    });
  }

  return [...latestByModule.values()].sort((left, right) => left.moduleId.localeCompare(right.moduleId));
}

function score(value: number | null): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
}

async function syncWithClient(
  client: MmsCommercialDatabaseClient,
  params: { crmRecordId: string; description: string; reconciliationActor: string },
): Promise<PartnerRegistrySyncResult> {
  const crmRecordId = params.crmRecordId.trim();
  if (!/^\d+$/.test(crmRecordId)) return { status: "conflict", reason: "Invalid CRM Sales Partner record ID." };

  const state = parsePartnerCrmState(params.description);
  if (!state.partnerId || !state.stage) {
    return { status: "conflict", reason: "CRM record does not contain a permanent Partner ID and controlled Partner stage." };
  }

  const changedAt = nullableTimestamp(state.lastAuditTimestamp) || new Date().toISOString();
  const actor = state.lastAuditActor || params.reconciliationActor.trim() || "registry-reconciliation";
  const agreementAcceptedAt = nullableTimestamp(latestLine(params.description, "Agreement Accepted At"));
  const complianceAcknowledgedAt = nullableTimestamp(latestLine(params.description, "Compliance Acknowledged At"));
  const certificationIssuedAt = nullableTimestamp(state.certificationIssuedAt);
  const certificationRenewalDueAt = nullableTimestamp(state.certificationRenewalDueAt);
  const certificationExpiresAt = nullableTimestamp(state.certificationExpiresAt);
  const assessmentCompletedAt = nullableTimestamp(latestLine(params.description, "Quiz Passed At"));
  const trainingModules = parseTrainingModules(params.description);
  const overallScore = score(state.quizScore);
  const noMedicalClaimsScore = score(state.noMedicalClaimsScore);

  try {
    return await client.transaction(async (tx) => {
      const partnerResult = await tx.query<{
        id: string;
        partner_code: string | null;
        crm_record_id: string | null;
        stage: string;
      }>(
        `select id::text, partner_code, crm_record_id, stage
           from mms_commercial.partners
          where crm_record_id = $1 or upper(partner_code) = upper($2)
          order by case when crm_record_id = $1 then 0 else 1 end
          for update`,
        [crmRecordId, state.partnerId],
      );
      if (partnerResult.rows.length === 0) {
        return { status: "conflict", reason: "Permanent Partner registry row does not exist. Issue the Partner ID first." } as const;
      }
      if (partnerResult.rows.length > 1) {
        return { status: "conflict", reason: "CRM record and permanent Partner ID resolve to different registry rows. Manual review is required." } as const;
      }

      const partner = partnerResult.rows[0]!;
      if (partner.crm_record_id !== crmRecordId) {
        return { status: "conflict", reason: "Partner registry CRM record does not match the requested Sales Partner record." } as const;
      }
      if (!partner.partner_code || partner.partner_code.toUpperCase() !== state.partnerId.toUpperCase()) {
        return { status: "conflict", reason: "Permanent Partner ID does not match the database registry. Issue the Partner ID first." } as const;
      }

      await tx.query(
        `update mms_commercial.partners
            set stage = $2,
                selling_enabled = $3,
                crm_access_enabled = $4,
                agreement_version = case when $5::boolean then nullif($6, '') else agreement_version end,
                agreement_accepted_at = case when $5::boolean then coalesce($7::timestamptz, agreement_accepted_at) else agreement_accepted_at end,
                compliance_acknowledged_at = case when $8::boolean then coalesce($9::timestamptz, compliance_acknowledged_at) else compliance_acknowledged_at end,
                activated_at = case when $2 = 'Active' then coalesce(activated_at, $10::timestamptz) else activated_at end,
                suspended_at = case when $2 = 'Suspended' then coalesce(suspended_at, $10::timestamptz) else suspended_at end,
                inactive_at = case when $2 = 'Inactive' then coalesce(inactive_at, $10::timestamptz) else inactive_at end
          where id = $1::uuid`,
        [
          partner.id,
          state.stage,
          state.sellingEnabled && state.stage === "Active",
          state.checklist.crmAccessEnabled,
          state.checklist.agreementCompleted,
          state.agreementVersion,
          agreementAcceptedAt,
          state.checklist.complianceAcknowledged,
          complianceAcknowledgedAt,
          changedAt,
        ],
      );

      const audit = await tx.query<{ id: string }>(
        `insert into mms_commercial.partner_audit_events(
           partner_id, event_type, previous_state, next_state, actor, reason, occurred_at
         )
         select $1::uuid, 'crm_registry_reconciled', jsonb_build_object('stage', $2::text),
                jsonb_build_object('stage', $3::text, 'sellingEnabled', $4::boolean,
                                   'crmAccessEnabled', $5::boolean),
                $6, 'Reconciled from controlled Zoho Sales Partner audit state.', $7::timestamptz
          where not exists (
            select 1 from mms_commercial.partner_audit_events
             where partner_id = $1::uuid
               and event_type = 'crm_registry_reconciled'
               and occurred_at = $7::timestamptz
          )
         returning id::text`,
        [partner.id, partner.stage, state.stage, state.sellingEnabled, state.checklist.crmAccessEnabled, actor, changedAt],
      );

      let trainingEvidenceRows = 0;
      if (state.checklist.coreTrainingCompleted && state.trainingVersion) {
        for (const trainingModule of trainingModules) {
          const inserted = await tx.query<{ id: string }>(
            `insert into mms_commercial.partner_training_evidence(
               partner_id, module_id, bundle_version, module_version, completed_at,
               acknowledged_at, passed, refresh_required
             ) values ($1::uuid,$2,$3,$4,$5::timestamptz,$6::timestamptz,$7,$8)
             on conflict (partner_id, module_id, module_version, completed_at) do nothing
             returning id::text`,
            [
              partner.id,
              trainingModule.moduleId,
              state.trainingVersion,
              trainingModule.version,
              trainingModule.completedAt,
              trainingModule.acknowledgedAt,
              trainingModule.passed,
              trainingModule.refreshRequired,
            ],
          );
          trainingEvidenceRows += inserted.rowCount;
        }
      }

      let assessmentRows = 0;
      if (
        state.checklist.quizPassed &&
        state.assessmentVersion &&
        assessmentCompletedAt &&
        overallScore !== null &&
        noMedicalClaimsScore !== null
      ) {
        const inserted = await tx.query<{ id: string }>(
          `insert into mms_commercial.partner_assessment_attempts(
             partner_id, assessment_version, overall_score, no_medical_claims_score, passed, attempted_at
           )
           select $1::uuid,$2,$3,$4,$5,$6::timestamptz
            where not exists (
              select 1 from mms_commercial.partner_assessment_attempts
               where partner_id = $1::uuid
                 and assessment_version = $2
                 and attempted_at = $6::timestamptz
            )
           returning id::text`,
          [
            partner.id,
            state.assessmentVersion,
            overallScore,
            noMedicalClaimsScore,
            state.assessmentResult === "Passed",
            assessmentCompletedAt,
          ],
        );
        assessmentRows += inserted.rowCount;
      }

      let certificationRows = 0;
      if (
        state.checklist.certificationIssued &&
        certificationIssuedAt &&
        certificationRenewalDueAt &&
        certificationExpiresAt
      ) {
        const inserted = await tx.query<{ id: string }>(
          `insert into mms_commercial.partner_certifications(
             partner_id, certification_version, issued_at, renewal_due_at, expires_at, issued_by
           )
           select $1::uuid,$2,$3::timestamptz,$4::timestamptz,$5::timestamptz,$6
            where not exists (
              select 1 from mms_commercial.partner_certifications
               where partner_id = $1::uuid
                 and certification_version = $2
                 and issued_at = $3::timestamptz
            )
           returning id::text`,
          [partner.id, CERTIFICATION_VERSION, certificationIssuedAt, certificationRenewalDueAt, certificationExpiresAt, actor],
        );
        certificationRows += inserted.rowCount;
      }

      return {
        status: "synced",
        partnerId: state.partnerId,
        crmRecordId,
        stage: state.stage,
        trainingEvidenceRows,
        assessmentRows,
        certificationRows,
        auditRows: audit.rowCount,
      } as const;
    });
  } catch {
    return {
      status: "unavailable",
      reason: "MMS Partner registry reconciliation could not be completed.",
    };
  }
}

export async function syncPartnerRegistryFromCrm(params: {
  crmRecordId: string;
  description: string;
  reconciliationActor: string;
}): Promise<PartnerRegistrySyncResult> {
  if (!mmsCommercialDatabaseClientAvailable()) {
    return {
      status: "unavailable",
      reason: "Dedicated MMS commercial PostgreSQL runtime is not operational.",
    };
  }
  return syncWithClient(mmsCommercialDatabaseClient(), params);
}
