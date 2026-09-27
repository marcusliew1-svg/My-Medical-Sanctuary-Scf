import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { listCrmManagementObservations } from "@/lib/crmOperationsStore";
import { buildManagementPipelineSnapshot, generateManagementBrief } from "@/lib/managementIntelligence";
import { requireOperatorRead } from "@/lib/operatorReadSecurity";
import { previewPilotFeatureReady } from "@/lib/crmPreviewRuntime";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const operator = await requireOperatorRead(request, { roles: ["operations", "auditor"] });
  if (operator.status !== "ok") {
    const status = operator.status === "unavailable" ? 503 : operator.status === "unauthorized" ? 401 : 403;
    return NextResponse.json({ status: operator.status, message: operator.reason }, { status });
  }
  if (!previewPilotFeatureReady("managementIntelligence")) return NextResponse.json({ status: "unavailable", message: "Preview management intelligence is disabled." }, { status: 404 });
  try {
    const snapshot = buildManagementPipelineSnapshot({ observations: await listCrmManagementObservations() });
    return NextResponse.json({ status: "ok", snapshot, brief: generateManagementBrief(snapshot) }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Preview management intelligence is not available." }, { status: 503 });
  }
}
