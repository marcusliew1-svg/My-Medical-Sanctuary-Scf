import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import {
  managementReviewEvidenceChecklist,
  managementReviewLifecycle,
  managementReviewRules,
} from "@/lib/managementReviewPolicy";
import { operationalLog, operationalRequestId } from "@/lib/operationalObservability";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestId = operationalRequestId(request);
  const headers = {
    "Cache-Control": "no-store, max-age=0",
    Pragma: "no-cache",
    "X-Request-Id": requestId,
  };

  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", requestId }, { status: 503, headers });
  }

  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    operationalLog("warn", "management_review_policy_unauthorized", { requestId });
    return NextResponse.json({ status: "unauthorized", requestId }, { status: 401, headers });
  }

  operationalLog("info", "management_review_policy_read", { requestId });

  return NextResponse.json({
    status: "ok",
    requestId,
    managementReviewLifecycle,
    managementReviewEvidenceChecklist,
    managementReviewRules,
    boundaries: {
      managementReviewsCompletedByThisPhase: 0,
      managementAssuranceConclusionsCreatedByThisPhase: 0,
      namedChairAssignedByThisPhase: false,
      productionReadinessApprovedByThisPhase: false,
      legalClinicalRegulatoryConclusionClaimedByThisPhase: false,
    },
  }, { headers });
}
