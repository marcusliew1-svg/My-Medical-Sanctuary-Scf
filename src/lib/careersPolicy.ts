export const CAREER_ROLE_FAMILIES = [
  { name: "Medical & Clinical", description: "Doctors, medical advisory and clinical-support roles" },
  { name: "Clinic Operations", description: "Clinic coordination, operations and service delivery" },
  { name: "Member Concierge", description: "Care coordination, member support and follow-up" },
  { name: "Sales Management", description: "Employed sales leadership and commercial operations" },
  { name: "Marketing & Content", description: "Brand, education, campaigns and communications" },
  { name: "Finance & Administration", description: "Finance, HR, administration and corporate support" },
  { name: "Technology & CRM", description: "Platform, CRM, data workflow and digital operations" },
] as const;

export type CareerRoleFamily = (typeof CAREER_ROLE_FAMILIES)[number]["name"];

export const CAREER_APPLICATION_STAGES = [
  "Applied",
  "HR Screening",
  "Shortlisted",
  "Interview",
  "Credential Verification",
  "Offer",
  "Onboarding",
  "Hired",
  "Rejected",
  "Withdrawn",
] as const;

export type CareerApplicationStage = (typeof CAREER_APPLICATION_STAGES)[number];

export const VACANCY_STATUSES = ["Draft", "Open", "Paused", "Closed", "Filled"] as const;
export type VacancyStatus = (typeof VACANCY_STATUSES)[number];

export const RECRUITMENT_DATA_RULES = {
  cvRequiredBeforeScreening: true,
  clinicalCredentialVerificationRequired: true,
  salesPartnerApplicantsMustUseSeparateWorkflow: true,
  applicantHealthDataProhibited: true,
  retentionPolicyRequiredBeforeProduction: true,
} as const;

export function isCareerRoleFamily(value: string): value is CareerRoleFamily {
  return CAREER_ROLE_FAMILIES.some((role) => role.name === value);
}

export function requiresCredentialVerification(role: CareerRoleFamily): boolean {
  return role === "Medical & Clinical";
}
