import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import { activateCommercialMembership, type MembershipActivationEvidence } from "@/lib/partnerCommerceWorkflow";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";

const MAX_BODY_BYTES = 10_000;
const ALLOWED_FIELDS = new Set(["applicationId", "membershipId", "paymentId"]);

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
  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) return NextResponse.json({ status: "invalid", message: "Unexpected membership activation fields were supplied." }, { status: 400 });

  const applicationId = cleanString(body.applicationId, 80);
  const membershipId = cleanString(body.membershipId, 80);
  const paymentId = cleanString(body.paymentId, 80);
  if (!applicationId || !membershipId || !paymentId) return NextResponse.json({ status: "invalid", message: "Required membership activation references are missing or invalid." }, { status: 400 });

  const store = partnerCommerceStore();
  const recordResult = await store.getApplication(applicationId);
  if (recordResult.status === "unavailable") return NextResponse.json({ status: "store_unavailable", message: recordResult.reason }, { status: 503 });
  if (recordResult.status === "conflict") return NextResponse.json({ status: "conflict", message: recordResult.reason }, { status: 409 });
  if (!recordResult.value) return NextResponse.json({ status: "not_found", message: "Commercial application was not found." }, { status: 404 });
  if (!recordResult.value.payment || !recordResult.value.membership || !recordResult.value.paymentVerification?.verifiedAt) {
    return NextResponse.json({ status: "incomplete_record", message: "Cleared payment evidence and pending membership records are required before activation." }, { status: 409 });
  }
  if (recordResult.value.payment.paymentId !== paymentId || recordResult.value.membership.membershipId !== membershipId) {
    return NextResponse.json({ status: "reference_conflict", message: "Payment or membership reference does not match the application." }, { status: 409 });
  }

  const evidence: MembershipActivationEvidence = {
    membershipId,
    applicationId,
    paymentId,
    activatedBy: operator.actor,
    activatedAt: operator.occurredAt,
    financeVerifiedAt: recordResult.value.paymentVerification.verifiedAt,
  };
  const replayCandidate = recordResult.value.application.stage === "Activated" && recordResult.value.membership.status === "Active";

  try {
    let application = recordResult.value.application;
    let membership = recordResult.value.membership;
    if (!replayCandidate) {
      const activated = activateCommercialMembership({ application, payment: recordResult.value.payment, membership, evidence });
      application = activated.application;
      membership = activated.membership;
    }

    const saveResult = await store.saveMembershipActivation({ application, membership, evidence, events: [] });
    if (saveResult.status === "unavailable") return NextResponse.json({ status: "store_unavailable", message: saveResult.reason }, { status: 503 });
    if (saveResult.status === "conflict") return NextResponse.json({ status: "conflict", message: saveResult.reason }, { status: 409 });

    return NextResponse.json({
      status: replayCandidate ? "already_activated" : "activated",
      replayed: replayCandidate,
      applicationId,
      applicationStage: saveResult.value.application.stage,
      membershipId,
      membershipStatus: saveResult.value.membership?.status || membership.status,
      activatedAt: saveResult.value.membership?.activatedAt || membership.activatedAt,
    });
  } catch (error) {
    return NextResponse.json({ status: "invalid_transition", message: error instanceof Error ? error.message : "Membership activation could not be applied." }, { status: 409 });
  }
}
