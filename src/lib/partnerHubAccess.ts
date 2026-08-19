import type { PartnerStage } from "@/lib/salesPartnerPolicy";

export type PartnerHubCapability =
  | "VIEW_DASHBOARD"
  | "VIEW_LEADS"
  | "REGISTER_LEAD"
  | "CREATE_APPLICATION"
  | "VIEW_MEMBERSHIP_COMMERCIAL_STATUS"
  | "VIEW_COMMISSION_WALLET"
  | "SHARE_REFERRAL_LINK"
  | "ACCESS_ACADEMY"
  | "ACCESS_PRESENTATION_CENTRE";

export type PartnerHubAccessState = {
  stage: PartnerStage;
  sellingEnabled: boolean;
  certificationCurrent: boolean;
  crmAccessEnabled: boolean;
};

export function partnerHubCapabilities(state: PartnerHubAccessState): PartnerHubCapability[] {
  if (state.stage === "Rejected" || state.stage === "Applicant" || state.stage === "Under Review") return [];

  const capabilities: PartnerHubCapability[] = ["ACCESS_ACADEMY"];

  if (["Approved", "Agreement Pending", "Training", "Active", "Suspended", "Inactive"].includes(state.stage)) {
    capabilities.push("ACCESS_PRESENTATION_CENTRE");
  }

  if (state.stage === "Active" || state.stage === "Suspended" || state.stage === "Inactive") {
    capabilities.push("VIEW_DASHBOARD", "VIEW_LEADS", "VIEW_MEMBERSHIP_COMMERCIAL_STATUS", "VIEW_COMMISSION_WALLET");
  }

  if (state.stage === "Active" && state.sellingEnabled && state.certificationCurrent && state.crmAccessEnabled) {
    capabilities.push("REGISTER_LEAD", "CREATE_APPLICATION", "SHARE_REFERRAL_LINK");
  }

  return capabilities;
}

export function canUsePartnerHubCapability(state: PartnerHubAccessState, capability: PartnerHubCapability): boolean {
  return partnerHubCapabilities(state).includes(capability);
}

// Suspended and Inactive Partners retain read-only commercial visibility where appropriate,
// but cannot register new leads, submit applications, or share an active referral link.
// Clinical/member medical data is never a Partner Hub capability.
