import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import {
  exceptionEvidenceChecklist,
  exceptionGovernanceRules,
  exceptionLifecycle,
} from "@/lib/policyExceptionRiskAcceptance";
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
    operationalLog("warn", "policy_exception_policy_unauthorized", { requestId });
    return NextResponse.json({ status: "unauthorized", requestId }, { status: 401, headers });
  }

  operationalLog("info", "policy_exception_policy_read", { requestId });

  return NextResponse.json({
    status: "ok",
    requestId,
    exceptionLifecycle,
    exceptionGovernanceRules,
    exceptionEvidenceChecklist,
    boundaries: {
      exceptionsApprovedByThisPhase: 0,
      risksAcceptedByThisPhase: 0,
      controlsWaivedByThisPhase: 0,
      productionOverridesCreatedByThisPhase: 0,
      clinicalRegulatoryPrivacySecurityProhibitionsWaivedByThisPhase: false,
    },
  }, { headers });
}
