import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";
import { protectPartnerHubMutation } from "@/lib/partnerHubMutationSecurity";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";
import { type MembershipCode } from "@/lib/partnerCommercialModel";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2_000;
const MEMBERSHIP_CODES = new Set<MembershipCode>(["ASCEND", "EVOLVE", "ETERNA", "PINNACLE"]);
const ALLOWED_FIELDS = new Set(["leadId", "membershipCode"]);

function cleanString(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function authFailure(auth: Awaited<ReturnType<typeof authorizePartnerHubCapability>>) {
  if (auth.status === "authorized") return null;
  if (auth.status === "unauthenticated") return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  if (auth.status === "forbidden") return NextResponse.json({ status: "forbidden", message: auth.reason }, { status: 403 });
  if (auth.status === "not_found") return NextResponse.json({ status: "not_found", message: auth.reason }, { status: 404 });
  if (auth.status === "conflict") return NextResponse.json({ status: "conflict", message: auth.reason }, { status: 409 });
  return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });
}

export async function POST(request: NextRequest) {
  const auth = await authorizePartnerHubCapability(request, "CREATE_APPLICATION");
  const failure = authFailure(auth);
  if (failure) return failure;
  if (auth.status !== "authorized") return NextResponse.json({ status: "error", message: "Partner authorization failed." }, { status: 500 });

  const security = await protectPartnerHubMutation(request, auth.auth.claims);
  if (security.status === "forbidden") return NextResponse.json({ status: "forbidden", message: security.reason }, { status: 403 });
  if (security.status === "unavailable") return NextResponse.json({ status: "hub_unavailable", message: security.reason }, { status: 503 });

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

  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) {
    return NextResponse.json({ status: "invalid", message: "Application submission contains unsupported fields." }, { status: 400 });
  }

  const leadId = cleanString(body.leadId, 100);
  const membershipCode = cleanString(body.membershipCode, 20).toUpperCase() as MembershipCode;
  const idempotencyKey = cleanString(request.headers.get("idempotency-key"), 120);
  if (!leadId || !MEMBERSHIP_CODES.has(membershipCode) || !/^[A-Za-z0-9._:-]{16,120}$/.test(idempotencyKey)) {
    return NextResponse.json({ status: "invalid", message: "A valid lead, membership package and Idempotency-Key are required." }, { status: 400 });
  }

  if (!partnerCommerceStoreAvailable()) {
    return NextResponse.json({ status: "hub_unavailable", message: "Partner commercial application store is not configured." }, { status: 503 });
  }

  const submitted = await partnerCommerceStore().submitPartnerApplication({
    partnerId: auth.partnerId,
    leadId,
    membershipCode,
    idempotencyKey,
    submittedAt: new Date().toISOString(),
  });
  if (submitted.status === "unavailable") return NextResponse.json({ status: "hub_unavailable", message: submitted.reason }, { status: 503 });
  if (submitted.status === "conflict") {
    return NextResponse.json({ status: "application_conflict", message: submitted.reason }, { status: 409 });
  }

  const application = submitted.value.record.application;
  if (application.partnerId.toUpperCase() !== auth.partnerId.toUpperCase()) {
    return NextResponse.json({ status: "conflict", message: "Application attribution could not be verified." }, { status: 409 });
  }

  return NextResponse.json(
    {
      status: submitted.value.replayed ? "already_submitted" : "submitted",
      replayed: submitted.value.replayed,
      application: {
        applicationId: application.applicationId,
        leadId: application.leadId,
        membershipCode: application.membershipCode,
        stage: application.stage,
        submittedAt: application.submittedAt || null,
      },
      note: "Commercial membership application only. No clinical information is accepted or stored here.",
    },
    {
      status: submitted.value.replayed ? 200 : 201,
      headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" },
    },
  );
}
