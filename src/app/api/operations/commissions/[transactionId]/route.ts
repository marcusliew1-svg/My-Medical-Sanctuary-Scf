import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getOperatorCommissionDetail } from "@/lib/operatorCommissionQuery";
import { requireOperatorRead } from "@/lib/operatorSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: { transactionId: string } }) {
  const operator = await requireOperatorRead(request, { roles: ["finance", "auditor"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

  const transactionId = context.params.transactionId.trim();
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId)) return NextResponse.json({ status: "invalid", message: "Commission transaction ID is invalid." }, { status: 400 });

  try {
    const detail = await getOperatorCommissionDetail(transactionId);
    if (!detail) return NextResponse.json({ status: "not_found", message: "Commission transaction was not found." }, { status: 404 });
    return NextResponse.json({ status: "ok", detail }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Commission detail is not available." }, { status: 503 });
  }
}
