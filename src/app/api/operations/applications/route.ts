import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decodeOperatorCursor, listOperatorApplications } from "@/lib/operatorCommerceQuery";
import { requireOperatorRead } from "@/lib/operatorSecurity";

export const dynamic = "force-dynamic";
const ALLOWED_STAGES = new Set(["Draft","Submitted","Under Review","Documents Outstanding","Approved","Payment Pending","Paid","Activated","Withdrawn","Rejected"]);

export async function GET(request: NextRequest) {
  const operator = await requireOperatorRead(request, { roles: ["operations", "finance", "auditor"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

  const stageRaw = request.nextUrl.searchParams.get("stage")?.trim() || "";
  if (stageRaw && !ALLOWED_STAGES.has(stageRaw)) return NextResponse.json({ status: "invalid", message: "Application stage filter is invalid." }, { status: 400 });
  const search = (request.nextUrl.searchParams.get("search") || "").trim().slice(0, 120);
  const cursorRaw = request.nextUrl.searchParams.get("cursor");
  const cursor = decodeOperatorCursor(cursorRaw);
  if (cursorRaw && !cursor) return NextResponse.json({ status: "invalid", message: "Application cursor is invalid." }, { status: 400 });

  try {
    const page = await listOperatorApplications({ stage: stageRaw || undefined, search: search || undefined, cursor, limit: 50 });
    const financeOnly = operator.claims.roles.includes("finance") && !operator.claims.roles.some((role) => role === "operations" || role === "admin" || role === "auditor");
    const items = financeOnly ? page.items.map(({ customerEmail: _email, customerPhone: _phone, ...item }) => item) : page.items;
    return NextResponse.json({ status: "ok", items, nextCursor: page.nextCursor }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Application queue data is not available." }, { status: 503 });
  }
}
