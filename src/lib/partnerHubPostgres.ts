import type { MmsCommercialDatabaseClient } from "@/lib/mmsCommercialDatabaseClient";
import { buildPartnerHubAcademySummary } from "@/lib/partnerHubAcademy";
import type { PartnerHubAccessState } from "@/lib/partnerHubAccess";
import { buildPartnerHubDashboard, type PartnerHubCertificationSummary } from "@/lib/partnerHubDashboard";
import type { PartnerHubStore, PartnerHubStoreResult, PartnerPresentationAsset } from "@/lib/partnerHubStore";
import type { CommercialLead, CommercialMembership } from "@/lib/partnerCommercialModel";
import type { CommissionTransaction } from "@/lib/partnerCommissionLedger";
import type { SalesPartnerTrainingEvidence } from "@/lib/partnerTraining";
import { referralUrlForPartner, type PartnerLevel, type PartnerStage } from "@/lib/salesPartnerPolicy";

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new Error("Database returned an invalid Partner Hub timestamp.");
  return date.toISOString();
}

function optionalIso(value: unknown): string | undefined {
  return value === null || value === undefined ? undefined : iso(value);
}

function unavailable<T>(): PartnerHubStoreResult<T> {
  return { status: "unavailable", reason: "Partner Hub commercial database read is unavailable." };
}

function certificationSummary(input: {
  issuedAt?: string;
  expiresAt?: string;
  renewalDueAt?: string;
  revokedAt?: string;
  now: string;
}): PartnerHubCertificationSummary {
  if (!input.issuedAt || !input.expiresAt || input.revokedAt) return { status: "Not Issued" };
  const now = Date.parse(input.now);
  const expires = Date.parse(input.expiresAt);
  const renewal = input.renewalDueAt ? Date.parse(input.renewalDueAt) : Number.NaN;
  if (!Number.isFinite(now) || !Number.isFinite(expires)) throw new Error("Certification timestamps are invalid.");
  if (expires <= now) return { status: "Expired", issuedAt: input.issuedAt, expiresAt: input.expiresAt, renewalDueAt: input.renewalDueAt };
  if (Number.isFinite(renewal) && renewal <= now) return { status: "Renewal Due", issuedAt: input.issuedAt, expiresAt: input.expiresAt, renewalDueAt: input.renewalDueAt };
  return { status: "Current", issuedAt: input.issuedAt, expiresAt: input.expiresAt, renewalDueAt: input.renewalDueAt };
}

async function loadPartnerCore(client: MmsCommercialDatabaseClient, partnerId: string) {
  const result = await client.query<{
    id: string;
    partner_code: string;
    stage: PartnerStage;
    level: PartnerLevel | null;
    selling_enabled: boolean;
    crm_access_enabled: boolean;
  }>(
    `select id::text, partner_code, stage, level, selling_enabled, crm_access_enabled
       from mms_commercial.partners
      where upper(partner_code) = upper($1)
      limit 1`,
    [partnerId],
  );
  return result.rows[0] || null;
}

async function loadCertification(client: MmsCommercialDatabaseClient, partnerUuid: string) {
  const result = await client.query<{
    issued_at: unknown;
    renewal_due_at: unknown;
    expires_at: unknown;
    revoked_at: unknown | null;
  }>(
    `select issued_at, renewal_due_at, expires_at, revoked_at
       from mms_commercial.partner_certifications
      where partner_id = $1::uuid
      order by issued_at desc
      limit 1`,
    [partnerUuid],
  );
  return result.rows[0] || null;
}

async function accessState(client: MmsCommercialDatabaseClient, partnerId: string): Promise<PartnerHubAccessState | null> {
  const partner = await loadPartnerCore(client, partnerId);
  if (!partner) return null;
  const certification = await loadCertification(client, partner.id);
  const certificationCurrent = Boolean(
    certification &&
      !certification.revoked_at &&
      Date.parse(iso(certification.expires_at)) > Date.now(),
  );
  return {
    stage: partner.stage,
    sellingEnabled: partner.selling_enabled,
    certificationCurrent,
    crmAccessEnabled: partner.crm_access_enabled,
  };
}

export function postgresPartnerHubStore(client: MmsCommercialDatabaseClient): PartnerHubStore {
  return {
    async getAccessState(partnerId) {
      try {
        return { status: "ok", value: await accessState(client, partnerId) };
      } catch {
        return unavailable();
      }
    },

    async getDashboard(partnerId) {
      try {
        const partner = await loadPartnerCore(client, partnerId);
        if (!partner) return { status: "ok", value: null };
        if (partner.stage !== "Active" && partner.stage !== "Suspended" && partner.stage !== "Inactive") {
          return { status: "conflict", reason: "Partner stage does not permit dashboard access." };
        }

        const [certification, leadsResult, membershipsResult, commissionsResult] = await Promise.all([
          loadCertification(client, partner.id),
          client.query<{
            public_lead_id: string;
            registered_partner_code: string;
            current_partner_code: string;
            source: string | null;
            campaign: string | null;
            consent_version: string;
            consent_captured_at: unknown;
            registered_at: unknown;
            stage: CommercialLead["stage"];
            last_activity_at: unknown | null;
            next_action_at: unknown | null;
          }>(
            `select l.public_lead_id,
                    registered.partner_code as registered_partner_code,
                    current_owner.partner_code as current_partner_code,
                    l.source, l.campaign, l.consent_version, l.consent_captured_at,
                    l.registered_at, l.stage, l.last_activity_at, l.next_action_at
               from mms_commercial.leads l
               join mms_commercial.partners registered on registered.id = l.registered_by_partner_id
               join mms_commercial.partners current_owner on current_owner.id = l.current_partner_id
              where l.current_partner_id = $1::uuid`,
            [partner.id],
          ),
          client.query<{
            public_membership_id: string;
            public_application_id: string;
            member_reference: string;
            membership_code: CommercialMembership["membershipCode"];
            status: CommercialMembership["status"];
            activated_at: unknown | null;
            cancelled_at: unknown | null;
          }>(
            `select m.public_membership_id, a.public_application_id, m.member_reference,
                    m.membership_code, m.status, m.activated_at, m.cancelled_at
               from mms_commercial.memberships m
               join mms_commercial.applications a on a.id = m.application_id
              where a.partner_id = $1::uuid`,
            [partner.id],
          ),
          client.query<{
            public_transaction_id: string;
            public_application_id: string;
            public_payment_id: string;
            public_membership_id: string;
            partner_code: string;
            member_reference: string;
            membership_code: CommissionTransaction["membershipCode"];
            payment_transaction_reference: string;
            currency: string;
            eligible_revenue_minor_units: number;
            commission_rule_version: string;
            partner_level_at_eligibility: PartnerLevel;
            commission_rate: number;
            gross_commission_minor_units: number;
            adjustment_minor_units: number;
            approved_commission_minor_units: number;
            status: CommissionTransaction["status"];
            hold_reason: string | null;
            approved_by: string | null;
            approved_at: unknown | null;
            payout_batch_id: string | null;
            paid_by: string | null;
            paid_at: unknown | null;
            payout_reference: string | null;
            reversed_at: unknown | null;
            reversal_reason: string | null;
            clawback_minor_units: number;
          }>(
            `select c.public_transaction_id, a.public_application_id, pay.public_payment_id,
                    m.public_membership_id, p.partner_code, c.member_reference, c.membership_code,
                    c.payment_transaction_reference, c.currency, c.eligible_revenue_minor_units,
                    c.commission_rule_version, c.partner_level_at_eligibility, c.commission_rate,
                    c.gross_commission_minor_units, c.adjustment_minor_units,
                    c.approved_commission_minor_units, c.status, c.hold_reason, c.approved_by,
                    c.approved_at, c.payout_batch_id, c.paid_by, c.paid_at,
                    c.payout_reference, c.reversed_at, c.reversal_reason, c.clawback_minor_units
               from mms_commercial.commission_transactions c
               join mms_commercial.partners p on p.id = c.partner_id
               join mms_commercial.applications a on a.id = c.application_id
               join mms_commercial.payments pay on pay.id = c.payment_id
               join mms_commercial.memberships m on m.id = c.membership_id
              where c.partner_id = $1::uuid`,
            [partner.id],
          ),
        ]);

        const leads: CommercialLead[] = leadsResult.rows.map((row) => ({
          leadId: row.public_lead_id,
          registeredByPartnerId: row.registered_partner_code,
          currentPartnerId: row.current_partner_code,
          source: row.source || undefined,
          campaign: row.campaign || undefined,
          consentVersion: row.consent_version,
          consentCapturedAt: iso(row.consent_captured_at),
          registeredAt: iso(row.registered_at),
          stage: row.stage,
          lastActivityAt: optionalIso(row.last_activity_at),
          nextActionAt: optionalIso(row.next_action_at),
        }));

        const memberships: CommercialMembership[] = membershipsResult.rows.map((row) => ({
          membershipId: row.public_membership_id,
          applicationId: row.public_application_id,
          memberReference: row.member_reference,
          membershipCode: row.membership_code,
          status: row.status,
          activatedAt: optionalIso(row.activated_at),
          cancelledAt: optionalIso(row.cancelled_at),
        }));

        const commissions: CommissionTransaction[] = commissionsResult.rows.map((row) => ({
          transactionId: row.public_transaction_id,
          partnerId: row.partner_code,
          applicationId: row.public_application_id,
          paymentId: row.public_payment_id,
          membershipId: row.public_membership_id,
          memberReference: row.member_reference,
          membershipCode: row.membership_code,
          paymentTransactionReference: row.payment_transaction_reference,
          currency: row.currency,
          eligibleRevenueMinorUnits: Number(row.eligible_revenue_minor_units),
          commissionRuleVersion: row.commission_rule_version,
          partnerLevelAtEligibility: row.partner_level_at_eligibility,
          commissionRate: Number(row.commission_rate),
          grossCommissionMinorUnits: Number(row.gross_commission_minor_units),
          adjustmentMinorUnits: Number(row.adjustment_minor_units),
          approvedCommissionMinorUnits: Number(row.approved_commission_minor_units),
          status: row.status,
          holdReason: row.hold_reason || undefined,
          approvedBy: row.approved_by || undefined,
          approvedAt: optionalIso(row.approved_at),
          payoutBatchId: row.payout_batch_id || undefined,
          paidBy: row.paid_by || undefined,
          paidAt: optionalIso(row.paid_at),
          payoutReference: row.payout_reference || undefined,
          reversedAt: optionalIso(row.reversed_at),
          reversalReason: row.reversal_reason || undefined,
          clawbackMinorUnits: Number(row.clawback_minor_units || 0),
        }));

        const generatedAt = new Date().toISOString();
        const certIssuedAt = certification ? iso(certification.issued_at) : undefined;
        const certExpiresAt = certification ? iso(certification.expires_at) : undefined;
        const certRenewalDueAt = certification ? iso(certification.renewal_due_at) : undefined;
        const siteUrl = process.env.MMS_SITE_URL?.trim() || "";
        const referralUrl = partner.stage === "Active" && partner.selling_enabled && siteUrl
          ? referralUrlForPartner(siteUrl, partner.partner_code)
          : undefined;

        return {
          status: "ok",
          value: buildPartnerHubDashboard({
            partnerId: partner.partner_code,
            stage: partner.stage,
            level: partner.level || undefined,
            referralUrl,
            certificationIssuedAt: certification?.revoked_at ? undefined : certIssuedAt,
            certificationExpiresAt: certification?.revoked_at ? undefined : certExpiresAt,
            certificationRenewalDueAt: certification?.revoked_at ? undefined : certRenewalDueAt,
            leads,
            memberships,
            commissions,
            generatedAt,
          }),
        };
      } catch {
        return unavailable();
      }
    },

    async getAcademy(partnerId) {
      try {
        const partner = await loadPartnerCore(client, partnerId);
        if (!partner) return { status: "ok", value: null };
        const [certification, trainingResult, assessmentResult] = await Promise.all([
          loadCertification(client, partner.id),
          client.query<{
            module_id: string;
            bundle_version: string;
            module_version: string;
            completed_at: unknown;
            acknowledged_at: unknown;
            passed: boolean | null;
            refresh_required: boolean;
          }>(
            `select module_id, bundle_version, module_version, completed_at, acknowledged_at, passed, refresh_required
               from mms_commercial.partner_training_evidence
              where partner_id = $1::uuid
              order by completed_at desc`,
            [partner.id],
          ),
          client.query<{
            overall_score: number;
            no_medical_claims_score: number;
            passed: boolean;
            attempted_at: unknown;
          }>(
            `select overall_score, no_medical_claims_score, passed, attempted_at
               from mms_commercial.partner_assessment_attempts
              where partner_id = $1::uuid
              order by attempted_at desc
              limit 1`,
            [partner.id],
          ),
        ]);

        const seen = new Set<string>();
        const modules = trainingResult.rows
          .filter((row) => {
            if (seen.has(row.module_id)) return false;
            seen.add(row.module_id);
            return true;
          })
          .map((row) => ({
            moduleId: row.module_id as SalesPartnerTrainingEvidence["modules"][number]["moduleId"],
            version: row.module_version,
            completedAt: iso(row.completed_at),
            acknowledgedAt: iso(row.acknowledged_at),
            passed: row.passed === null ? undefined : row.passed,
            refreshRequired: row.refresh_required,
          }));
        const training: SalesPartnerTrainingEvidence | undefined = modules.length
          ? { bundleVersion: trainingResult.rows[0].bundle_version, modules }
          : undefined;

        const generatedAt = new Date().toISOString();
        const certificationView = certificationSummary({
          issuedAt: certification ? iso(certification.issued_at) : undefined,
          expiresAt: certification ? iso(certification.expires_at) : undefined,
          renewalDueAt: certification ? iso(certification.renewal_due_at) : undefined,
          revokedAt: certification ? optionalIso(certification.revoked_at) : undefined,
          now: generatedAt,
        });
        const assessment = assessmentResult.rows[0];

        return {
          status: "ok",
          value: buildPartnerHubAcademySummary({
            training,
            assessmentResult: assessment ? (assessment.passed ? "Passed" : "Failed") : undefined,
            assessmentOverallScore: assessment ? Number(assessment.overall_score) : undefined,
            assessmentNoMedicalClaimsScore: assessment ? Number(assessment.no_medical_claims_score) : undefined,
            assessmentCompletedAt: assessment ? iso(assessment.attempted_at) : undefined,
            certification: certificationView,
          }),
        };
      } catch {
        return unavailable();
      }
    },

    async listPresentationAssets(partnerId) {
      try {
        const partner = await loadPartnerCore(client, partnerId);
        if (!partner) return { status: "ok", value: [] };
        const result = await client.query<{
          id: string;
          title: string;
          category: PartnerPresentationAsset["category"];
          version: string;
          effective_from: unknown;
          effective_to: unknown | null;
          content_url: string;
          approved_by: string;
          approved_at: unknown;
        }>(
          `select id::text, title, category, version, effective_from, effective_to,
                  content_url, approved_by, approved_at
             from mms_commercial.presentation_assets
            where effective_from <= now()
              and (effective_to is null or effective_to > now())
            order by category, title, effective_from desc`,
        );
        const allowedCategories = new Set(["Membership", "Brand", "Education", "Compliance", "Campaign"]);
        const assets = result.rows
          .filter((row) => allowedCategories.has(row.category))
          .map((row) => ({
            assetId: row.id,
            title: row.title,
            category: row.category,
            version: row.version,
            effectiveFrom: iso(row.effective_from),
            expiresAt: optionalIso(row.effective_to),
            contentUrl: row.content_url,
            approvedBy: row.approved_by,
            approvedAt: iso(row.approved_at),
          }));
        return { status: "ok", value: assets };
      } catch {
        return unavailable();
      }
    },
  };
}
