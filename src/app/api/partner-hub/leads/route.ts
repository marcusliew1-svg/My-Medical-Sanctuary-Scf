import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";
import { protectPartnerHubMutation } from "@/lib/partnerHubMutationSecurity";
import {
  PARTNER_LEAD_CONSENT_VERSION,
  assertCommercialLeadPayloadOnly,
  validatePartnerLeadDraft,
} from "@/lib/partnerLeadRegistry";
import { partnerLeadRegistryStore, partnerLeadRegistryStoreAvailable } from "@/lib/partnerLeadRegistryStore";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 10_000;
const PARTNER_LEAD_ALLOWED_FIELDS = new Set([
  "fullName",
  "email",
  "phone",
  "source",
  "campaign",
  "consentAccepted",
  "consentVersion",
  "consentCapturedAt",
]);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function authFailure(auth: Awaited<ReturnType<typeof authorizePartnerHubCapability>>) {
  if (auth.status === "authorized") return null;
  if (auth.status === "unauthenticated") {
    return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  }
  if (auth.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", message: auth.reason }, { status: 403 });
  }
  if (auth.status === "not_found") {
    return NextResponse.json({ status: "not_found", message: auth.reason }, { status: 404 });
  }
  if (auth.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: auth.reason }, { status: 409 });
  }
  return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });
}

export async function GET(request: NextRequest) {
  const auth = await authorizePartnerHubCapability(request, "VIEW_LEADS");
  const failure = authFailure(auth);
  if (failure) return failure;
  if (auth.status !== "authorized") {
    return NextResponse.json({ status: "error", message: "Partner authorization failed." }, { status: 500 });
  }

  if (!partnerLeadRegistryStoreAvailable()) {
    return NextResponse.json({ status: "registry_unavailable", message: "Partner Lead Registry is not configured." }, { status: 503 });
  }

  const result = await partnerLeadRegistryStore().listOwnedByPartner(auth.partnerId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "registry_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }

  const leads = result.value.map((record) => {
    if (record.lead.currentPartnerId !== auth.partnerId) {
      throw new Error("Partner Lead Registry returned a lead outside authenticated ownership scope.");
    }
    return {
      leadId: record.lead.leadId,
      stage: record.lead.stage,
      registeredAt: record.lead.registeredAt,
      source: record.lead.source || null,
      campaign: record.lead.campaign || null,
      duplicateStatus: record.lead.duplicateStatus || "Unchecked",
      fullName: record.contact.fullName,
      email: record.contact.email || null,
      phone: record.contact.phone || null,
    };
  });

  return NextResponse.json(
    { status: "ok", leads },
    { headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" } },
  );
}

export async function POST(request: NextRequest) {
  const auth = await authorizePartnerHubCapability(request, "REGISTER_LEAD");
  const failure = authFailure(auth);
  if (failure) return failure;
  if (auth.status !== "authorized") {
    return NextResponse.json({ status: "error", message: "Partner authorization failed." }, { status: 500 });
  }

  const security = await protectPartnerHubMutation(request, auth.auth.claims);
  if (security.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", message: security.reason }, { status: 403 });
  }
  if (security.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: security.reason }, { status: 503 });
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

  const unexpectedFields = Object.keys(body).filter((key) => !PARTNER_LEAD_ALLOWED_FIELDS.has(key));
  if (unexpectedFields.length > 0) {
    return NextResponse.json(
      { status: "invalid", message: "Partner lead registration contains unsupported fields." },
      { status: 400 },
    );
  }

  try {
    assertCommercialLeadPayloadOnly(body);
  } catch {
    return NextResponse.json({ status: "invalid", message: "Clinical information is not permitted in the Partner Lead Registry." }, { status: 400 });
  }

  const idempotencyKey = cleanString(request.headers.get("idempotency-key"), 120);
  if (!/^[A-Za-z0-9._:-]{16,120}$/.test(idempotencyKey)) {
    return NextResponse.json({ status: "invalid", message: "A valid Idempotency-Key header is required." }, { status: 400 });
  }

  const registeredAt = new Date().toISOString();
  let draft;
  try {
    draft = validatePartnerLeadDraft({
      partnerId: auth.partnerId,
      contact: {
        fullName: cleanString(body.fullName, 160),
        email: cleanString(body.email, 254) || undefined,
        phone: cleanString(body.phone, 50) || undefined,
      },
      source: cleanString(body.source, 120) || undefined,
      campaign: cleanString(body.campaign, 120) || undefined,
      consentAccepted: body.consentAccepted === true,
      consentVersion: cleanString(body.consentVersion, 120),
      consentCapturedAt: cleanString(body.consentCapturedAt, 80),
      registeredAt,
    });
  } catch {
    return NextResponse.json(
      { status: "invalid", message: "Lead registration details or controlled consent evidence are invalid.", requiredConsentVersion: PARTNER_LEAD_CONSENT_VERSION },
      { status: 400 },
    );
  }

  if (!partnerLeadRegistryStoreAvailable()) {
    return NextResponse.json(
      { status: "registry_unavailable", message: "Partner Lead Registry is not configured.", requiredConsentVersion: PARTNER_LEAD_CONSENT_VERSION },
      { status: 503 },
    );
  }

  try {
    const created = await partnerLeadRegistryStore().createIdempotent({
      idempotencyKey,
      partnerId: draft.partnerId,
      contact: draft.contact,
      source: draft.source,
      campaign: draft.campaign,
      consentVersion: draft.consentVersion,
      consentCapturedAt: draft.consentCapturedAt,
      registeredAt: draft.registeredAt,
    });

    if (created.status === "unavailable") {
      return NextResponse.json({ status: "registry_unavailable", message: created.reason }, { status: 503 });
    }
    if (created.status === "conflict") {
      const possibleDuplicate = created.reason.toLowerCase().includes("duplicate");
      return NextResponse.json(
        {
          status: possibleDuplicate ? "possible_duplicate" : "registration_conflict",
          message: possibleDuplicate
            ? "A possible matching lead requires MMS duplicate review before registration can proceed."
            : created.reason,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        status: "registered",
        lead: {
          leadId: created.value.lead.leadId,
          stage: created.value.lead.stage,
          registeredAt: created.value.lead.registeredAt,
          duplicateStatus: created.value.lead.duplicateStatus,
        },
      },
      { status: 201, headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" } },
    );
  } catch (error) {
    console.error("MMS Partner Hub lead registration failed", {
      partnerId: auth.partnerId,
      error: error instanceof Error ? error.message : "Unknown Partner Hub lead registration error",
    });
    return NextResponse.json({ status: "error", message: "Unable to register lead." }, { status: 502 });
  }
}
