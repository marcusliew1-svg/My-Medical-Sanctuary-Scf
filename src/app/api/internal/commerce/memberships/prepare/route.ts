import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";

const MAX_BODY_BYTES = 4_000;
const ALLOWED_FIELDS = new Set(["applicationId", "memberReference"]);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const operator = await requireOperatorMutation(request, { roles: ["operations"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });
  if (!partnerCommerceStoreAvailable()) return NextResponse.json({ status: "store_unavailable", message: "MMS commercial workflow persistence is not configured." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 }); }
  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) return NextResponse.json({ status: "invalid", message: "Membership preparation contains unsupported fields." }, { status: 400 });

  const applicationId = cleanString(body.applicationId, 80);
  const memberReference = cleanString(body.memberReference, 160);
  if (!applicationId || !memberReference) return NextResponse.json({ status: "invalid", message: "Valid application and member reference are required." }, { status: 400 });

  const result = await partnerCommerceStore().prepareMembership({ applicationId, memberReference, preparedBy: operator.actor, preparedAt: operator.occurredAt });
  if (result.status === "unavailable") return NextResponse.json({ status: "store_unavailable", message: result.reason }, { status: 503 });
  if (result.status === "conflict") return NextResponse.json({ status: "membership_conflict", message: result.reason }, { status: 409 });

  const membership = result.value.record.membership;
  if (!membership) return NextResponse.json({ status: "membership_conflict", message: "Prepared membership could not be verified." }, { status: 409 });

  return NextResponse.json({
    status: result.value.replayed ? "already_prepared" : "prepared",
    replayed: result.value.replayed,
    applicationId,
    membershipId: membership.membershipId,
    memberReference: membership.memberReference,
    membershipCode: membership.membershipCode,
    membershipStatus: membership.status,
    note: "Commercial membership reference only. No clinical information is accepted by this endpoint.",
  }, { status: result.value.replayed ? 200 : 201 });
}
