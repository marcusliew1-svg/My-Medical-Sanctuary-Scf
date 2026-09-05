import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COMMISSION_TRANSACTION_STATUSES } from "@/lib/partnerCommissionLedger";
import { decodeOperatorCommissionCursor, listOperatorCommissions } from "@/lib/operatorCommissionQuery";
import { requireOperatorRead } from "@/lib/operatorReadSecurity";

export const dynamic = "force-dynamic";
const STATUS_SET = new Set<string>(COMMISSION_TRANSACTION_STATUSES);

export async function GET(request: NextRequest) {
  const operator = await requireOperatorRead(request, { roles: ["finance", "auditor"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

  const status = request.nextUrl.searchParams.get("status")?.trim() || "";
  if (status && !STATUS_SET.has(status)) return NextResponse.json({ status: "invalid", message: "Commission status filter is invalid." }, { status: 400 });
  const search = (request.nextUrl.searchParams.get("search") || "").trim().slice(0, 120);
  const ruleVersion = (request.nextUrl.searchParams.get("ruleVersion") || "").trim().slice(0, 80);
  const currency = (request.nextUrl.searchParams.get("currency") || "").trim().toUpperCase().slice(0, 3);
  if (currency && !/^[A-Z]{3}$/.test(currency)) return NextResponse.json({ status: "invalid", message: "Currency filter is invalid." }, { status: 400 });
  const cursorRaw = request.nextUrl.searchParams.get("cursor");
  const cursor = decodeOperatorCommissionCursor(cursorRaw);
  if (cursorRaw && !cursor) return NextResponse.json({ status: "invalid", message: "Commission cursor is invalid." }, { status: 400 });

  try {
    const page = await listOperatorCommissions({ status: status || undefined, search: search || undefined, ruleVersion: ruleVersion || undefined, currency: currency || undefined, cursor, limit: 50 });
    return NextResponse.json({ status: "ok", items: page.items, nextCursor: page.nextCursor }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Commission queue data is not available." }, { status: 503 });
  }
}
