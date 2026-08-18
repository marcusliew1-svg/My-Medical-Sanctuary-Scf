import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { activationZohoChanges, type PartnerActivationEvidence } from "@/lib/partnerActivation";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import {
  PARTNER_STAGES,
  type ActivationChecklist,
  type PartnerStage,
  normalisePartnerId,
} from "@/lib/salesPartnerPolicy";
import { getZohoRecord, updateZohoRecord, zohoCrmConfigured } from "@/lib/zohoCrm";

const MAX_BODY_BYTES = 24_000;
const partnerStages = new Set<string>(PARTNER_STAGES);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isPartnerStage(value: unknown): value is PartnerStage {
  return typeof value === "string" && partnerStages.has(value);
}

function parseChecklist(value: unknown): ActivationChecklist | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const keys: Array<keyof ActivationChecklist> = [
    "approved",
    "kycDueDiligenceCompleted",
    "agreementCompleted",
    "coreTrainingCompleted",
    "quizPassed",
    "certificationIssued",
    "partnerCodeIssued",
    "crmAccessEnabled",
    "complianceAcknowledged",
  ];

  const result = {} as ActivationChecklist;
  for (const key of keys) {
    if (typeof source[key] !== "boolean") return null;
    result[key] = source[key] as boolean;
  }
  return result;
}

function parseEvidence(value: unknown): PartnerActivationEvidence {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const evidence: PartnerActivationEvidence = {};
  const timestampFields: Array<keyof PartnerActivationEvidence> = [
    "approvedAt",
    "kycDueDiligenceCompletedAt",
    "agreementAcceptedAt",
    "trainingCompletedAt",
    "quizPassedAt",
    "certificationIssuedAt",
    "certificationExpiresAt",
    "complianceAcknowledgedAt",
    "crmAccessEnabledAt",
  ];
  const shortFields: Array<keyof PartnerActivationEvidence> = [
    "agreementVersion",
    "agreementAcceptedIp",
    "trainingVersion",
    "trainingAcknowledgedIp",
    "complianceAcknowledgedIp",
  ];

  for (const key of timestampFields) {
    const cleaned = cleanString(source[key], 80);
    if (cleaned) (evidence as Record<string, unknown>)[key] = cleaned;
  }
  for (const key of shortFields) {
    const cleaned = cleanString(source[key], 120);
    if (cleaned) (evidence as Record<string, unknown>)[key] = cleaned;
  }
  if (typeof source.quizScore === "number") evidence.quizScore = source.quizScore;
  if (typeof source.noMedicalClaimsScore === "number") evidence.noMedicalClaimsScore = source.noMedicalClaimsScore;
  return evidence;
}

function stageFromDescription(description: string): PartnerStage | "" {
  const matches = [...description.matchAll(/^Partner Stage:\s*(.+)$/gim)];
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const candidate = matches[index]?.[1]?.trim();
    if (candidate && partnerStages.has(candidate)) return candidate as PartnerStage;
  }
  return "";
}

function partnerIdFromDescription(description: string): string {
  const matches = [...description.matchAll(/^Partner ID:\s*(MMSP-\d{4,})\s*$/gim)];
  const candidate = matches.at(-1)?.[1] || "";
  return normalisePartnerId(candidate);
}

export async function POST(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal Sales Partner controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }
  if (!zohoCrmConfigured() || process.env.MMS_CRM_DEBUG === "true") {
    return NextResponse.json({ status: "unavailable", message: "CRM activation controls are still in integration test mode." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 });
  }

  const recordId = cleanString(body.recordId, 40);
  const suppliedCurrentStage = body.currentStage;
  const nextStage = body.nextStage;
  const partnerId = normalisePartnerId(cleanString(body.partnerId, 40));
  const actor = cleanString(body.actor, 160);
  const checklist = parseChecklist(body.checklist);
  const evidence = parseEvidence(body.evidence);

  if (!/^\d+$/.test(recordId) || !isPartnerStage(suppliedCurrentStage) || !isPartnerStage(nextStage) || !partnerId || !actor || !checklist) {
    return NextResponse.json({ status: "invalid", message: "Required activation fields are missing or invalid." }, { status: 400 });
  }

  const siteUrl = cleanString(process.env.MMS_SITE_URL, 500);
  if (!siteUrl) {
    return NextResponse.json({ status: "configuration_error", message: "MMS_SITE_URL is not configured." }, { status: 503 });
  }

  const leadsModule = process.env.ZOHO_LEADS_MODULE_API_NAME || "Leads";

  try {
    const crmRecord = await getZohoRecord(leadsModule, recordId);
    if (cleanString(crmRecord.MMS_Inquiry_Type, 120) !== "Sales Partner Applicant") {
      return NextResponse.json({ status: "invalid_record", message: "The CRM record is not an MMS Sales Partner applicant." }, { status: 409 });
    }

    const description = cleanString(crmRecord.Description, 32_000);
    const crmStage = stageFromDescription(description);
    if (!crmStage) {
      return NextResponse.json({ status: "manual_review", message: "The CRM record has no reliable Sales Partner stage and was not changed." }, { status: 409 });
    }
    if (crmStage !== suppliedCurrentStage) {
      return NextResponse.json(
        { status: "stale_state", message: `CRM stage is ${crmStage}; refresh the record before attempting another transition.` },
        { status: 409 },
      );
    }

    const existingPartnerId = partnerIdFromDescription(description);
    if (existingPartnerId && existingPartnerId !== partnerId) {
      return NextResponse.json({ status: "partner_id_conflict", message: "The supplied Partner ID does not match the CRM audit record." }, { status: 409 });
    }

    const changedAt = new Date().toISOString();
    const changes = activationZohoChanges(description, {
      partnerId,
      currentStage: crmStage,
      nextStage,
      checklist,
      evidence,
      actor,
      changedAt,
      siteUrl,
    });

    await updateZohoRecord(leadsModule, recordId, changes);

    return NextResponse.json({
      status: "updated",
      recordId,
      partnerId,
      previousStage: crmStage,
      stage: nextStage,
      changedAt,
    });
  } catch (error) {
    console.error("MMS internal Sales Partner activation failed", {
      recordId,
      error: error instanceof Error ? error.message : "Unknown activation error",
    });
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Sales Partner activation failed." },
      { status: 502 },
    );
  }
}
