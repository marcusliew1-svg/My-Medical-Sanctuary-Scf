import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { bodyTooLarge, clean, fieldsWithinLimits, hasAllowedPublicOrigin, hasOnlyFields, isEmail, isPhone, publicRequestClientKey, publicSubmissionErrorStatus, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";
import { createZohoRecord, findZohoLeadDuplicateMatches, zohoCrmConfigured } from "@/lib/zohoCrm";

const allowedTerritories = new Set(["Malaysia", "Thailand", "Malaysia + Thailand", "Other"]);
const allowedActivityBands = new Set(["0-5", "6-15", "16+", "Building team / leadership"]);
const allowedLeadSources = new Set([
  "Advertisement",
  "Cold Call",
  "Employee Referral",
  "External Referral",
  "OnlineStore",
  "Partner",
  "Public Relations",
  "Sales Mail Alias",
  "Seminar Partner",
  "Seminar-Internal",
  "Trade Show",
  "Web Download",
  "Web Research",
  "Chat",
  "Twitter",
  "Facebook",
]);
const partnerApplicationFields = new Set(["fullName", "email", "mobile", "country", "city", "nationality", "occupation", "salesBackground", "relevantExperience", "preferredTerritory", "expectedMonthlyActivity", "referrerCode", "introducer", "complianceDeclaration", "approvedRepresentationsDeclaration", "agreementAcknowledgement", "privacyConsent", "sourcePath", "website"]);
const partnerApplicationLimits = { fullName: 120, email: 254, mobile: 60, country: 80, city: 80, nationality: 80, occupation: 120, salesBackground: 1500, relevantExperience: 1500, preferredTerritory: 120, expectedMonthlyActivity: 80, referrerCode: 40, introducer: 120, complianceDeclaration: 10, approvedRepresentationsDeclaration: 10, agreementAcknowledgement: 10, privacyConsent: 10, sourcePath: 160, website: 120 };

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: "", lastName: fullName.slice(0, 80) };
  return {
    firstName: parts.shift()!.slice(0, 40),
    lastName: parts.join(" ").slice(0, 80),
  };
}

function applicationReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `MMS-SPA-${date}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request)) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  if (!hasAllowedPublicOrigin(request)) {
    return NextResponse.json({ status: "denied", message: "This request could not be accepted." }, { status: 403 });
  }

  const rateLimit = checkInMemoryRateLimit(`sales-partner:${publicRequestClientKey(request)}`, { limit: 4, windowMs: 15 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ status: "rate_limited", message: "Too many application attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } });
  }

  let form: Record<string, string>;
  try {
    form = await readPublicForm(request);
  } catch (error) {
    const status = publicSubmissionErrorStatus(error);
    return NextResponse.json({ status: "invalid", message: status === 413 ? "Request is too large." : "Unsupported or invalid request format." }, { status });
  }

  if (clean(form.website, 120)) {
    return NextResponse.json({ status: "accepted" }, { status: 202 });
  }

  if (!hasOnlyFields(form, partnerApplicationFields) || !fieldsWithinLimits(form, partnerApplicationLimits)) {
    return NextResponse.json({ status: "invalid", message: "One or more application fields are invalid or too long." }, { status: 400 });
  }

  const preferredTerritory = clean(form.preferredTerritory, 120);
  const expectedMonthlyActivity = clean(form.expectedMonthlyActivity, 80);
  const rawReferrerCode = clean(form.referrerCode, 40).toUpperCase();
  const referrerCode = normalisePartnerId(rawReferrerCode);

  const payload = {
    fullName: clean(form.fullName, 120),
    email: clean(form.email, 254).toLowerCase(),
    mobile: clean(form.mobile, 60),
    country: clean(form.country, 80),
    city: clean(form.city, 80),
    nationality: clean(form.nationality, 80),
    occupation: clean(form.occupation, 120),
    salesBackground: clean(form.salesBackground, 1_500),
    relevantExperience: clean(form.relevantExperience, 1_500),
    preferredTerritory,
    expectedMonthlyActivity,
    referrerCode,
    introducer: clean(form.introducer, 120),
    complianceDeclaration: clean(form.complianceDeclaration, 10) === "true",
    approvedRepresentationsDeclaration: clean(form.approvedRepresentationsDeclaration, 10) === "true",
    agreementAcknowledgement: clean(form.agreementAcknowledgement, 10) === "true",
    privacyConsent: clean(form.privacyConsent, 10) === "true",
    sourcePath: clean(form.sourcePath, 160),
  };

  if (
    payload.fullName.length < 2 ||
    !isEmail(payload.email) ||
    !isPhone(payload.mobile) ||
    !payload.country ||
    !payload.salesBackground ||
    !allowedTerritories.has(payload.preferredTerritory) ||
    !allowedActivityBands.has(payload.expectedMonthlyActivity) ||
    (rawReferrerCode && !payload.referrerCode) ||
    !payload.complianceDeclaration ||
    !payload.approvedRepresentationsDeclaration ||
    !payload.agreementAcknowledgement ||
    !payload.privacyConsent ||
    payload.sourcePath !== "/join-mms"
  ) {
    return NextResponse.json(
      { status: "invalid", message: "Please complete the required professional, territory and consent fields." },
      { status: 400 },
    );
  }

  if (process.env.MMS_SALES_PARTNER_APPLICATIONS_ENABLED !== "true") {
    return NextResponse.json(
      { status: "unavailable", message: "Online Sales Partner applications are not active yet." },
      { status: 503 },
    );
  }

  const crmMode = (process.env.MMS_SALES_PARTNER_CRM_MODE || "leads").trim().toLowerCase();
  if (crmMode !== "leads") {
    return NextResponse.json(
      { status: "not_persisted", message: "The approved Sales Partner CRM destination is not connected yet." },
      { status: 503 },
    );
  }

  if (process.env.MMS_CRM_DEBUG === "true" || !zohoCrmConfigured()) {
    return NextResponse.json(
      { status: "not_persisted", message: "Sales Partner CRM intake is still in integration test mode." },
      { status: 503 },
    );
  }

  const configuredLeadSource = (process.env.MMS_SALES_PARTNER_LEAD_SOURCE || "Partner").trim();
  if (!allowedLeadSources.has(configuredLeadSource)) {
    console.error("MMS Sales Partner Zoho intake blocked: invalid configured Lead_Source");
    return NextResponse.json(
      { status: "configuration_error", message: "Sales Partner CRM intake is not configured correctly yet." },
      { status: 503 },
    );
  }

  const leadsModule = process.env.ZOHO_LEADS_MODULE_API_NAME || "Leads";

  try {
    const duplicate = await findZohoLeadDuplicateMatches(leadsModule, payload.email, payload.mobile);
    if (duplicate.recordIds.length > 0 || duplicate.matchedByEmail || duplicate.matchedByPhone) {
      console.info("MMS Sales Partner application held for duplicate review", {
        recordCount: duplicate.recordIds.length,
        matchedByEmail: duplicate.matchedByEmail,
        matchedByPhone: duplicate.matchedByPhone,
      });
      return NextResponse.json(
        {
          status: "duplicate_review",
          message: "This application matches an existing CRM record and has not been duplicated. Please contact MMS if you need the existing record reviewed or updated.",
        },
        { status: 409 },
      );
    }
  } catch (error) {
    console.error("MMS Sales Partner duplicate check failed", {
      error: error instanceof Error ? error.message : "Unknown Zoho CRM search error",
    });
    return NextResponse.json(
      {
        status: "error",
        message: "Your application could not be checked safely against existing records. Please try again later.",
      },
      { status: 502 },
    );
  }

  const applicantTag = clean(process.env.MMS_SALES_PARTNER_APPLICANT_TAG || "MMS Sales Partner Applicant", 80);
  const reference = applicationReference();
  const { firstName, lastName } = splitName(payload.fullName);

  // The current Zoho edition has no remaining custom-field capacity in Leads.
  // Reuse the MMS intake fields that already exist and keep the remaining audit metadata
  // structured in Description so no additional CRM fields are required for go-live.
  const description = [
    `MMS Sales Partner application: ${reference}`,
    "[MMS_PARTNER_APPLICATION]",
    `Application Reference: ${reference}`,
    "Partner Stage: Applicant",
    `Nationality: ${payload.nationality || "Not supplied"}`,
    `Occupation/Company: ${payload.occupation || "Not supplied"}`,
    `Referrer Partner ID: ${payload.referrerCode || "None"}`,
    "Approved Representations Declaration: accepted",
    "Sales Partner Agreement Acknowledgement: accepted",
    "Permanent Partner ID: not assigned - approval, agreement, training and activation required.",
    "[/MMS_PARTNER_APPLICATION]",
  ].join("\n");

  try {
    await createZohoRecord(leadsModule, {
      First_Name: firstName || undefined,
      Last_Name: lastName,
      Email: payload.email,
      Phone: payload.mobile.slice(0, 30),
      Mobile: payload.mobile.slice(0, 30),
      City: payload.city || undefined,
      Country: payload.country,
      Company: payload.occupation.slice(0, 200) || "Individual Sales Partner Applicant",
      Designation: payload.occupation.slice(0, 100) || undefined,
      Lead_Source: configuredLeadSource,
      Lead_Status: "Not Contacted",
      Data_Source: "API",
      MMS_Inquiry_Type: "Sales Partner Applicant",
      Preferred_Territory: payload.preferredTerritory,
      Sales_Background: payload.salesBackground,
      Relevant_Experience: payload.relevantExperience || undefined,
      Expected_Monthly_Activity: payload.expectedMonthlyActivity,
      Introducer: payload.referrerCode || payload.introducer || undefined,
      Compliance_Declaration: payload.complianceDeclaration,
      Privacy_Consent: payload.privacyConsent,
      Source_Path: payload.sourcePath || "/join-mms",
      Description: description.slice(0, 32_000),
      Tag: applicantTag ? [{ name: applicantTag }] : undefined,
    });
  } catch (error) {
    console.error("MMS Sales Partner Zoho intake failed", {
      reference,
      error: error instanceof Error ? error.message : "Unknown Zoho CRM error",
    });
    return NextResponse.json(
      { status: "error", message: "Your application could not be saved safely. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      status: "accepted",
      reference,
      message: `Application received. Your reference is ${reference}.`,
    },
    { status: 201 },
  );
}
