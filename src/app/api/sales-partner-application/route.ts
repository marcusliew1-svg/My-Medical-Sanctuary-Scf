import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { bodyTooLarge, clean, isEmail, readPublicForm } from "@/lib/publicSubmission";

const allowedTerritories = new Set(["Malaysia", "Thailand", "Malaysia + Thailand", "Other"]);
const allowedActivityBands = new Set(["0-5", "6-15", "16+", "Building team / leadership"]);

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request)) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  let form: Record<string, string>;
  try {
    form = await readPublicForm(request);
  } catch {
    return NextResponse.json({ status: "invalid", message: "Unsupported request format." }, { status: 415 });
  }

  if (clean(form.website, 120)) {
    return NextResponse.json({ status: "accepted" }, { status: 202 });
  }

  const preferredTerritory = clean(form.preferredTerritory, 120);
  const expectedMonthlyActivity = clean(form.expectedMonthlyActivity, 80);

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
    referrerCode: clean(form.referrerCode, 40).toUpperCase(),
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
    payload.mobile.length < 6 ||
    !payload.country ||
    !payload.salesBackground ||
    !allowedTerritories.has(payload.preferredTerritory) ||
    !allowedActivityBands.has(payload.expectedMonthlyActivity) ||
    !payload.complianceDeclaration ||
    !payload.approvedRepresentationsDeclaration ||
    !payload.agreementAcknowledgement ||
    !payload.privacyConsent
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

  // The route intentionally does not claim success until the approved Zoho module/workflow is connected.
  // A permanent Partner ID is assigned only after approval, agreement and activation checks.
  return NextResponse.json(
    {
      status: "not_persisted",
      message: "Sales Partner application persistence is not connected yet.",
      acceptedFields: Object.keys(payload),
      targetModule: process.env.MMS_SALES_PARTNER_MODULE_API_NAME || null,
    },
    { status: 503 },
  );
}
