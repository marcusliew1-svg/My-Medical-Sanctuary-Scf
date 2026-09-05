import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { operatorDashboardSummary } from "@/lib/operatorCommerceQuery";
import { requireOperatorRead } from "@/lib/operatorReadSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const operator = await requireOperatorRead(request, { roles: ["operations", "finance", "auditor"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

  try {
    const summary = await operatorDashboardSummary();
    return NextResponse.json({ status: "ok", summary }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Operations dashboard data is not available." }, { status: 503 });
  }
}
