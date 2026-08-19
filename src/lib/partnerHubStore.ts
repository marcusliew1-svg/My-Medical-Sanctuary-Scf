import type { PartnerHubAccessState } from "@/lib/partnerHubAccess";
import type { PartnerHubDashboard } from "@/lib/partnerHubDashboard";
import type { PartnerHubAcademySummary } from "@/lib/partnerHubAcademy";

export type PartnerPresentationAsset = {
  assetId: string;
  title: string;
  category: "Membership" | "Brand" | "Education" | "Compliance" | "Campaign";
  version: string;
  effectiveFrom: string;
  expiresAt?: string;
  contentUrl: string;
  approvedBy: string;
  approvedAt: string;
};

export type PartnerHubStoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

export type PartnerHubStore = {
  getAccessState(partnerId: string): Promise<PartnerHubStoreResult<PartnerHubAccessState | null>>;
  getDashboard(partnerId: string): Promise<PartnerHubStoreResult<PartnerHubDashboard | null>>;
  getAcademy(partnerId: string): Promise<PartnerHubStoreResult<PartnerHubAcademySummary | null>>;
  listPresentationAssets(partnerId: string): Promise<PartnerHubStoreResult<PartnerPresentationAsset[]>>;
};

export const PARTNER_HUB_STORE_REQUIREMENTS = Object.freeze([
  "Every Partner Hub read must be scoped to the authenticated permanent MMS Partner ID.",
  "Capability checks must use trusted server-side Partner stage, selling-enabled, certification and CRM-access state; never browser-supplied access flags.",
  "A Partner may only see leads currently owned by that Partner unless an explicitly approved supervisory role applies.",
  "Membership summaries must expose commercial status only and never treatment, diagnosis or clinical-utilisation detail.",
  "Commission summaries must come from the immutable commission ledger and must not be recalculated in the browser.",
  "Approved/Paid commission amounts must remain Finance-controlled and read-only to Sales Partners.",
  "Academy status must come from retained agreement/training/assessment/certification evidence and must never be browser-editable.",
  "Presentation Centre assets must be approved, versioned and effective-dated; Partners cannot upload or alter controlled MMS materials through the Hub.",
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
  const unavailable = <T>(): PartnerHubStoreResult<T> => ({
    status: "unavailable",
    reason:
      "Partner Hub persistence/authentication is not configured. Provision MMS commercial stores and Partner-scoped authentication before enabling Partner Hub access.",
  });

  return {
    async getAccessState() {
      return unavailable();
    },
    async getDashboard() {
      return unavailable();
    },
    async getAcademy() {
      return unavailable();
    },
    async listPresentationAssets() {
      return unavailable();
    },
  };
}
