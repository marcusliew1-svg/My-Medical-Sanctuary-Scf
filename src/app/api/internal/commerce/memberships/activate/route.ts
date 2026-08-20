import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { activateCommercialMembership, type MembershipActivationEvidence } from "@/lib/partnerCommerceWorkflow";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";

const MAX_BODY_BYTES = 10_000;

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!internalApiConfigured()) return NextResponse.json({ status: "unavailable", message: "Internal commerce controls are not configured." }, { status: 503 });
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  if (!partnerCommerceStoreAvailable()) return NextResponse.json({ status: "store_unavailable", message: "MMS commercial workflow persistence is not configured." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 }); }

  const applicationId = cleanString(body.applicationId, 80);
  const membershipId = cleanString(body.membershipId, 80);
  const paymentId = cleanString(body.paymentId, 80);
  const activatedBy = cleanString(body.activatedBy, 160);
  const activatedAt = cleanString(body.activatedAt, 80);
  const financeVerifiedAt = cleanString(body.financeVerifiedAt, 80);
  if (!applicationId || !membershipId || !paymentId || !activatedBy || !activatedAt || !financeVerifiedAt || Number.isNaN(Date.parse(activatedAt)) || Number.isNaN(Date.parse(financeVerifiedAt))) {
    return NextResponse.json({ status: "invalid", message: "Required membership activation fields are missing or invalid." }, { status: 400 });
  }

  const store = partnerCommerceStore();
  const recordResult = await store.getApplication(applicationId);
  if (recordResult.status === "unavailable") return NextResponse.json({ status: "store_unavailable", message: recordResult.reason }, { status: 503 });
  if (recordResult.status === "conflict") return NextResponse.json({ status: "conflict", message: recordResult.reason }, { status: 409 });
  if (!recordResult.value) return NextResponse.json({ status: "not_found", message: "Commercial application was not found." }, { status: 404 });
  if (!recordResult.value.payment || !recordResult.value.membership) {
    return NextResponse.json({ status: "incomplete_record", message: "Payment and pending membership records are required before activation." }, { status: 409 });
  }
  if (recordResult.value.payment.paymentId !== paymentId || recordResult.value.membership.membershipId !== membershipId) {
    return NextResponse.json({ status: "reference_conflict", message: "Payment or membership reference does not match the application." }, { status: 409 });
  }

  const evidence: MembershipActivationEvidence = { membershipId, applicationId, paymentId, activatedBy, activatedAt, financeVerifiedAt };
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
