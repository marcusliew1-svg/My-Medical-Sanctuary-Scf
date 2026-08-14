import { NextResponse } from "next/server";
import { evaluateCommission, type CommissionEvaluationInput } from "@/lib/partnerHubRules";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CommissionEvaluationInput>;

    const requiredBooleanFields: Array<keyof CommissionEvaluationInput> = [
      "certifiedPartner",
      "verifiedPayment",
      "coolingOffComplete",
      "complianceCleared",
      "cancelled",
      "refunded",
    ];

    const invalidField = requiredBooleanFields.find((field) => typeof body[field] !== "boolean");
    if (invalidField) {
      return NextResponse.json(
        { error: `Missing or invalid boolean field: ${invalidField}` },
        { status: 400 },
      );
    }

    const result = evaluateCommission(body as CommissionEvaluationInput);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
