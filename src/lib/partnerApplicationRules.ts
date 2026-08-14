export type ApplicationStage = "Draft" | "Submitted" | "Payment pending" | "Payment verified" | "Cooling-off" | "Activated" | "Cancelled" | "Refunded";

export type ApplicationStateInput = {
  submitted: boolean;
  paymentVerified: boolean;
  coolingOffComplete: boolean;
  cancelled: boolean;
  refunded: boolean;
  activationApproved: boolean;
};

export function deriveApplicationStage(input: ApplicationStateInput): ApplicationStage {
  if (input.cancelled) return "Cancelled";
  if (input.refunded) return "Refunded";
  if (!input.submitted) return "Draft";
  if (!input.paymentVerified) return "Payment pending";
  if (!input.coolingOffComplete) return "Cooling-off";
  if (input.activationApproved) return "Activated";
  return "Payment verified";
}

export function applicationCommissionGate(stage: ApplicationStage) {
  if (stage === "Cancelled" || stage === "Refunded") return { eligible: false, reason: "Cancelled/refunded applications earn zero commission." };
  if (stage !== "Activated") return { eligible: false, reason: "Commission cannot become payable before membership activation." };
  return { eligible: true, reason: "Application is activated; commission remains subject to the commission-rule engine and compliance approval." };
}
