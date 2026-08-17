import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { bodyTooLarge, clean, isEmail, readPublicForm } from "@/lib/publicSubmission";
import { MMS_PARTNER_REFERRAL_COOKIE } from "@/lib/referralTracking";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

const priceEnvByMembership = {
  ASCEND: "STRIPE_PRICE_ASCEND",
  EVOLVE: "STRIPE_PRICE_EVOLVE",
  ETERNA: "STRIPE_PRICE_ETERNA",
  PINNACLE: "STRIPE_PRICE_PINNACLE",
} as const;

type MembershipCode = keyof typeof priceEnvByMembership;

function isMembershipCode(value: string): value is MembershipCode {
  return value in priceEnvByMembership;
}

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

  const membership = clean(form.membership, 32).toUpperCase();
  const email = clean(form.email, 254).toLowerCase();
  const fullName = clean(form.fullName, 120);
  const website = clean(form.website, 120);

  if (website) {
    return NextResponse.json({ status: "accepted" }, { status: 202 });
  }

  if (!isMembershipCode(membership) || !isEmail(email) || fullName.length < 2) {
    return NextResponse.json(
      { status: "invalid", message: "A valid membership, name and email are required." },
      { status: 400 },
    );
  }

  if (process.env.MMS_STRIPE_CHECKOUT_ENABLED !== "true" || process.env.MMS_STRIPE_FULFILMENT_ENABLED !== "true") {
    return NextResponse.json(
      { status: "unavailable", message: "Online membership payment is not active yet. Please contact MMS." },
      { status: 503 },
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[priceEnvByMembership[membership]];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!secretKey || !priceId || !siteUrl) {
    return NextResponse.json({ status: "misconfigured", message: "Checkout is temporarily unavailable." }, { status: 503 });
  }

  const partnerId = normalisePartnerId(request.cookies.get(MMS_PARTNER_REFERRAL_COOKIE)?.value);
  const referenceId = `mms_${randomUUID()}`;
  const payload = new URLSearchParams();
  payload.set("mode", "payment");
  payload.set("line_items[0][price]", priceId);
  payload.set("line_items[0][quantity]", "1");
  payload.set("customer_email", email);
  payload.set("client_reference_id", referenceId);
  payload.set("metadata[mms_membership]", membership);
  payload.set("metadata[mms_reference_id]", referenceId);
  if (partnerId) payload.set("metadata[mms_partner_id]", partnerId);
  payload.set("success_url", `${siteUrl}/membership-checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`);
  payload.set("cancel_url", `${siteUrl}/membership-checkout?payment=cancelled`);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ status: "error", message: "Checkout could not be started." }, { status: 502 });
  }

  const session = (await response.json()) as { id?: string; url?: string };
  if (!session.id || !session.url) {
    return NextResponse.json({ status: "error", message: "Checkout did not return a usable session." }, { status: 502 });
  }

  return NextResponse.json({ status: "ready", sessionId: session.id, checkoutUrl: session.url });
}
