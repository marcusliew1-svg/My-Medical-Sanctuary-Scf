import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { aiGovernanceRules, aiValidationChecklist } from "@/lib/aiModelGovernancePolicy";
import { operationalLog, operationalRequestId } from "@/lib/operationalObservability";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestId = operationalRequestId(request);
  const headers = { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache", "X-Request-Id": requestId };

  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", requestId }, { status: 503, headers });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    operationalLog("warn", "ai_model_governance_policy_unauthorized", { requestId });
    return NextResponse.json({ status: "unauthorized", requestId }, { status: 401, headers });
  }

  operationalLog("info", "ai_model_governance_policy_read", { requestId });
  return NextResponse.json({
    status: "ok",
    requestId,
    aiGovernanceRules,
    aiValidationChecklist,
    boundaries: {
      aiUseCasesActivatedByThisPhase: 0,
      modelsApprovedByThisPhase: 0,
      clinicalAiApprovedByThisPhase: 0,
      autonomousDecisionsEnabledByThisPhase: false,
      productionAiEnabledByThisPhase: false,
    },
  }, { headers });
}
