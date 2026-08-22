import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getOperatorApplicationDetail } from "@/lib/operatorCommerceQuery";
import { requireOperatorRead } from "@/lib/operatorSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: { applicationId: string } }) {
  const operator = await requireOperatorRead(request, { roles: ["operations", "finance", "auditor"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

  const applicationId = decodeURIComponent(context.params.applicationId || "").trim().slice(0, 100);
  if (!/^MMSA-[A-Za-z0-9-]+$/.test(applicationId)) return NextResponse.json({ status: "invalid", message: "Application ID is invalid." }, { status: 400 });

  try {
    const detail = await getOperatorApplicationDetail(applicationId);
    if (!detail) return NextResponse.json({ status: "not_found", message: "Application was not found." }, { status: 404 });
    const financeOnly = operator.claims.roles.includes("finance") && !operator.claims.roles.some((role) => role === "operations" || role === "admin" || role === "auditor");
    if (financeOnly) {
      const { customerEmail: _email, customerPhone: _phone, ...application } = detail.application;
      return NextResponse.json({ status: "ok", detail: { ...detail, application } }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
    }
    return NextResponse.json({ status: "ok", detail }, { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Application detail is not available." }, { status: 503 });
  }
}
