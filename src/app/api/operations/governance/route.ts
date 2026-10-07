import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { governanceConsoleEnabled, governanceSnapshot, mutateGovernance, type GovernanceMutation } from "@/lib/governanceStore";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import { requireOperatorRead } from "@/lib/operatorReadSecurity";

export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json(
    { status: "unavailable", message: "MMS Governance Console is disabled." },
    { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

export async function GET(request: NextRequest) {
  if (!governanceConsoleEnabled()) return unavailable();
  const operator = await requireOperatorRead(request, { roles: ["operations", "finance", "auditor"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

  try {
    const snapshot = await governanceSnapshot();
    return NextResponse.json(
      { status: "ok", snapshot },
      { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } },
    );
  } catch {
    return NextResponse.json(
      { status: "unavailable", message: "Governance data is not available." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!governanceConsoleEnabled()) return unavailable();

  const operator = await requireOperatorMutation(request, { roles: ["operations"], requireStepUp: true });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

  let body: GovernanceMutation;
  try {
    body = await request.json() as GovernanceMutation;
  } catch {
    return NextResponse.json({ status: "invalid", message: "Valid JSON is required." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || typeof body.type !== "string" || typeof body.key !== "string" || typeof body.reason !== "string" || !body.reason.trim()) {
    return NextResponse.json({ status: "invalid", message: "Governance mutation type, key and reason are required." }, { status: 400 });
  }

  try {
    const record = await mutateGovernance(body, {
      operatorId: operator.claims.operatorId,
      roles: operator.claims.roles,
    });
    return NextResponse.json(
      { status: "ok", record },
      { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Governance update failed.";
    return NextResponse.json({ status: "invalid", message }, { status: 400 });
  }
}
