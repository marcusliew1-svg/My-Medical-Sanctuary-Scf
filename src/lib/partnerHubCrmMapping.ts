import type { LeadRecord, MembershipApplicationRecord, PartnerRecord } from "@/lib/partnerHubPersistence";

export const partnerHubCrmConfig = {
  debug: process.env.MMS_CRM_DEBUG !== "false",
  leadsModule: process.env.ZOHO_LEADS_MODULE_API_NAME ?? "Leads",
  organisationId: process.env.ZOHO_ORGANIZATION_ID,
};

export function mapPartnerToCrm(partner: PartnerRecord) {
  return {
    MMS_Partner_ID: partner.id,
    Partner_Code: partner.partnerCode,
    Partner_Name: partner.name,
    Partner_Status: partner.status,
    Certification_Status: partner.certificationStatus,
    Partner_Tier: partner.tier,
  };
}

export function mapLeadToCrm(lead: LeadRecord) {
  return {
    Last_Name: lead.fullName,
    Mobile: lead.mobile,
    Email: lead.email,
    Lead_Source: lead.source ?? "MMS Partner Hub",
    MMS_Lead_ID: lead.id,
    MMS_Partner_ID: lead.ownerPartnerId,
    Package_Interest: lead.packageInterest,
    MMS_Lead_Stage: lead.stage,
  };
}

export function mapApplicationToCrm(application: MembershipApplicationRecord) {
  return {
    MMS_Application_ID: application.id,
    MMS_Lead_ID: application.leadId,
    MMS_Partner_ID: application.partnerId,
    Package_Name: application.packageName,
    Application_Status: application.status,
    Payment_Reference: application.paymentReference,
    Payment_Verified_At: application.paymentVerifiedAt,
  };
}

export function assertMmsCrmBoundary() {
  if (!partnerHubCrmConfig.debug && !partnerHubCrmConfig.organisationId) {
    throw new Error("Live MMS CRM mode requires ZOHO_ORGANIZATION_ID to prevent wrong-organisation writes.");
  }
}
