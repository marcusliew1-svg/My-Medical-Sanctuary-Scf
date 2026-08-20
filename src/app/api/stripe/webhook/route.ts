import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ALLOWED_SKEW_SECONDS = 300;

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string): boolean {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) return false;
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNumber) > ALLOWED_SKEW_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return signatures.some((signature) => {
    const actualBuffer = Buffer.from(signature, "utf8");
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!secret || !signature || !verifyStripeSignature(rawBody, signature, secret)) {
    return NextResponse.json({ status: "invalid_signature" }, { status: 400 });
  }

  let event: { id?: string; type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ status: "invalid_payload" }, { status: 400 });
  }

  const relevantEvents = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
  ]);

  if (!event.type || !relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  if (process.env.MMS_STRIPE_FULFILMENT_ENABLED !== "true") {
    return NextResponse.json(
      { status: "fulfilment_unavailable", eventId: event.id ?? null },
      { status: 503 },
    );
  }

  // Durable CRM/member fulfilment must be added before the feature gate is enabled.
  // Do not acknowledge a completed payment as fulfilled until that write succeeds.
  return NextResponse.json(
    { status: "fulfilment_not_connected", eventId: event.id ?? null },
    { status: 503 },
  );
}
