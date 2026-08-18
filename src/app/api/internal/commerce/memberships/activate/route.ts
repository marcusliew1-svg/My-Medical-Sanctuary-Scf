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
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal commerce controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }
  if (!partnerCommerceStoreAvailable()) {
    return NextResponse.json(
      { status: "store_unavailable", message: "MMS commercial workflow persistence is not configured." },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 });
  }

  const applicationId = cleanString(body.applicationId, 80);
  const membershipId = cleanString(body.membershipId, 80);
  const paymentId = cleanString(body.paymentId, 80);
  const activatedBy = cleanString(body.activatedBy, 160);
  const activatedAt = cleanString(body.activatedAt, 80);
  const financeVerifiedAt = cleanString(body.financeVerifiedAt, 80);

  if (!applicationId || !membershipId || !paymentId || !activatedBy || !activatedAt || !financeVerifiedAt) {
    return NextResponse.json({ status: "invalid", message: "Required membership activation fields are missing." }, { status: 400 });
  }

  const store = partnerCommerceStore();
  const recordResult = await store.getApplication(applicationId);
  if (recordResult.status === "unavailable") {
    return NextResponse.json({ status: "store_unavailable", message: recordResult.reason }, { status: 503 });
  }
  if (recordResult.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: recordResult.reason }, { status: 409 });
  }
  if (!recordResult.value) {
    return NextResponse.json({ status: "not_found", message: "Commercial application was not found." }, { status: 404 });
  }
  if (!recordResult.value.payment || !recordResult.value.membership) {
    return NextResponse.json(
      { status: "incomplete_record", message: "Payment and pending membership records are required before activation." },
      { status: 409 },
    );
  }

  const evidence: MembershipActivationEvidence = {
    membershipId,
    applicationId,
    paymentId,
    activatedBy,
    activatedAt,
    financeVerifiedAt,
  };

  try {
    const activated = activateCommercialMembership({
      application: recordResult.value.application,
      payment: recordResult.value.payment,
      membership: recordResult.value.membership,
      evidence,
    });
    const saveResult = await store.saveMembershipActivation({
      application: activated.application,
      membership: activated.membership,
      evidence,
      events: activated.events,
    });
    if (saveResult.status === "unavailable") {
      return NextResponse.json({ status: "store_unavailable", message: saveResult.reason }, { status: 503 });
    }
    if (saveResult.status === "conflict") {
      return NextResponse.json({ status: "conflict", message: saveResult.reason }, { status: 409 });
    }

    return NextResponse.json({
      status: "activated",
      applicationId,
      applicationStage: activated.application.stage,
      membershipId,
      membershipStatus: activated.membership.status,
      activatedAt: activated.membership.activatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "invalid_transition", message: error instanceof Error ? error.message : "Membership activation could not be applied." },
      { status: 409 },
    );
  }
}
