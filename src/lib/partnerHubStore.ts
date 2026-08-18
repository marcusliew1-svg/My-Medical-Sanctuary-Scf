import type { PartnerHubDashboard } from "@/lib/partnerHubDashboard";

export type PartnerHubStoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

export type PartnerHubStore = {
  getDashboard(partnerId: string): Promise<PartnerHubStoreResult<PartnerHubDashboard | null>>;
};

export const PARTNER_HUB_STORE_REQUIREMENTS = Object.freeze([
  "Every Partner Hub read must be scoped to the authenticated permanent MMS Partner ID.",
  "A Partner may only see leads currently owned by that Partner unless an explicitly approved supervisory role applies.",
  "Membership summaries must expose commercial status only and never treatment, diagnosis or clinical-utilisation detail.",
  "Commission summaries must come from the immutable commission ledger and must not be recalculated in the browser.",
  "Approved/Paid commission amounts must remain Finance-controlled and read-only to Sales Partners.",
  "Referral URLs may only be exposed while the Partner is Active and selling-enabled.",
  "Suspended or Inactive Partners must not receive selling-enabled controls.",
  "No clinical data may be stored in or returned by the Partner Hub data layer.",
]);

export function partnerHubStoreAvailable(): boolean {
  return false;
}

/**
 * The Partner Hub remains fail-closed until MMS provisions the transactional
 * commercial stores plus a real Partner authentication/session layer. Do not
 * expose this data using a shared internal bearer token as the Partner-facing
 * authentication mechanism.
 */
export function partnerHubStore(): PartnerHubStore {
  return {
    async getDashboard() {
      return {
        status: "unavailable",
        reason:
          "Partner Hub persistence/authentication is not configured. Provision MMS commercial stores and Partner-scoped authentication before enabling dashboard reads.",
      };
    },
  };
}
