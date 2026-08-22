import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decodeOperatorCursor, listOperatorMemberships } from "@/lib/operatorCommerceQuery";
import { requireOperatorRead } from "@/lib/operatorSecurity";

export const dynamic = "force-dynamic";
const ALLOWED_STATUSES = new Set(["Pending Activation","Active","Cancelled","Expired"]);

export async function GET(request: NextRequest) {
  const operator = await requireOperatorRead(request, { roles: ["operations", "finance", "auditor"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

  const statusRaw = request.nextUrl.searchParams.get("status")?.trim() || "";
  if (statusRaw && !ALLOWED_STATUSES.has(statusRaw)) return NextResponse.json({ status: "invalid", message: "Membership status filter is invalid." }, { status: 400 });
  const search = (request.nextUrl.searchParams.get("search") || "").trim().slice(0, 120);
  const cursorRaw = request.nextUrl.searchParams.get("cursor");
  const cursor = decodeOperatorCursor(cursorRaw);
  if (cursorRaw && !cursor) return NextResponse.json({ status: "invalid", message: "Membership cursor is invalid." }, { status: 400 });

  try {
    const page = await listOperatorMemberships({ status: statusRaw || undefined, search: search || undefined, cursor, limit: 50 });
    return NextResponse.json({ status: "ok", items: page.items, nextCursor: page.nextCursor }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Membership queue data is not available." }, { status: 503 });
  }
}
