import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { listCrmQueue } from "@/lib/crmOperationsStore";
import { requireOperatorRead } from "@/lib/operatorReadSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const operator = await requireOperatorRead(request, { roles: ["operations", "auditor"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });
  try {
    return NextResponse.json({ status: "ok", items: await listCrmQueue() }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Preview CRM queue data is not available." }, { status: 503 });
  }
}
