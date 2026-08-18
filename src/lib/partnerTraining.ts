import { SALES_PARTNER_CORE_TRAINING_VERSION } from "@/lib/salesPartnerPolicy";

export const SALES_PARTNER_CORE_MODULES = [
  { id: "MMS-SP-T01", title: "MMS brand, vision and positioning" },
  { id: "MMS-SP-T02", title: "Membership tiers and approved package explanations" },
  { id: "MMS-SP-T03", title: "Ling: what it can and cannot do" },
  { id: "MMS-SP-T04", title: "Treatment/service explanation boundaries" },
  { id: "MMS-SP-T05", title: "No diagnosis, prescription or guaranteed medical outcomes" },
  { id: "MMS-SP-T06", title: "No unapproved earnings, investment, return or recruitment-chain representations" },
  { id: "MMS-SP-T07", title: "Lead/referral handling and attribution" },
  { id: "MMS-SP-T08", title: "Privacy/PDPA and prohibited collection of clinical information" },
  { id: "MMS-SP-T09", title: "Payment, refund/cancellation and commission eligibility basics" },
  { id: "MMS-SP-T10", title: "Complaint, escalation and compliance incident procedure" },
] as const;

export type SalesPartnerTrainingModuleId = (typeof SALES_PARTNER_CORE_MODULES)[number]["id"];

export type SalesPartnerTrainingModuleEvidence = {
  moduleId: SalesPartnerTrainingModuleId;
  version: string;
  completedAt: string;
  acknowledgedAt: string;
  passed?: boolean;
  refreshRequired: boolean;
};

export type SalesPartnerTrainingEvidence = {
  bundleVersion: string;
  modules: SalesPartnerTrainingModuleEvidence[];
};

export type SalesPartnerTrainingValidation = {
  complete: boolean;
  missingModuleIds: SalesPartnerTrainingModuleId[];
  invalidModuleIds: SalesPartnerTrainingModuleId[];
};

function validTimestamp(value: string): boolean {
  return Boolean(value) && !Number.isNaN(Date.parse(value));
}

export function validateSalesPartnerTrainingEvidence(
  evidence: SalesPartnerTrainingEvidence | undefined,
): SalesPartnerTrainingValidation {
  const requiredIds = SALES_PARTNER_CORE_MODULES.map((module) => module.id);
  if (!evidence || evidence.bundleVersion !== SALES_PARTNER_CORE_TRAINING_VERSION || !Array.isArray(evidence.modules)) {
    return { complete: false, missingModuleIds: requiredIds, invalidModuleIds: [] };
  }

  const byId = new Map<SalesPartnerTrainingModuleId, SalesPartnerTrainingModuleEvidence>();
  const invalidModuleIds = new Set<SalesPartnerTrainingModuleId>();

  for (const module of evidence.modules) {
    if (!requiredIds.includes(module.moduleId)) continue;
    if (byId.has(module.moduleId)) {
      invalidModuleIds.add(module.moduleId);
      continue;
    }
    byId.set(module.moduleId, module);

    if (
      module.version !== SALES_PARTNER_CORE_TRAINING_VERSION ||
      !validTimestamp(module.completedAt) ||
      !validTimestamp(module.acknowledgedAt) ||
      module.refreshRequired ||
      module.passed === false
    ) {
      invalidModuleIds.add(module.moduleId);
    }
  }

  const missingModuleIds = requiredIds.filter((moduleId) => !byId.has(moduleId));
  return {
    complete: missingModuleIds.length === 0 && invalidModuleIds.size === 0,
    missingModuleIds,
    invalidModuleIds: [...invalidModuleIds],
  };
}

export function assertSalesPartnerTrainingComplete(evidence: SalesPartnerTrainingEvidence | undefined): void {
  const result = validateSalesPartnerTrainingEvidence(evidence);
  if (result.complete) return;

  const details = [
    result.missingModuleIds.length ? `missing: ${result.missingModuleIds.join(", ")}` : "",
    result.invalidModuleIds.length ? `invalid/refresh-required: ${result.invalidModuleIds.join(", ")}` : "",
  ].filter(Boolean).join("; ");

  throw new Error(`Core Sales Partner training evidence is incomplete${details ? ` (${details})` : ""}.`);
}
