export const zohoCommercialCanonicalFields = [
  "firstName", "lastName", "email", "mobile", "country", "preferredLocation", "preferredLanguage",
  "source", "utmSource", "utmMedium", "utmCampaign", "referralCode", "partnerId", "landingPage",
  "broadInterestCategory", "programmeInterest", "preferredContactChannel", "assignedOwner", "nextAction",
  "nextActionDue", "leadStatus", "conversionStatus", "reasonLost", "contactConsentTimestamp",
  "contactConsentVersion", "doNotContact", "idempotencyKey",
] as const;

export type ZohoCommercialCanonicalField = (typeof zohoCommercialCanonicalFields)[number];
export type ZohoCommercialFieldMapping = Readonly<Partial<Record<ZohoCommercialCanonicalField, string>>>;

export const zohoRequiredDayOneFieldMappings: readonly ZohoCommercialCanonicalField[] = [
  "firstName", "lastName", "email", "mobile", "country", "source", "leadStatus",
];

export type ZohoDayOneReadiness = {
  ready: boolean;
  blockers: string[];
  fieldMapping?: ZohoCommercialFieldMapping;
};

function value(env: NodeJS.ProcessEnv, name: string): string {
  return env[name]?.trim() || "";
}

function parseStringArray(env: NodeJS.ProcessEnv, name: string, blockers: string[]): string[] | null {
  const raw = value(env, name);
  if (!raw) {
    blockers.push(`${name} is required.`);
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.length || parsed.some((item) => typeof item !== "string" || !item.trim())) {
      blockers.push(`${name} must be a non-empty JSON string array.`);
      return null;
    }
    return parsed.map((item) => item.trim());
  } catch {
    blockers.push(`${name} must contain valid JSON.`);
    return null;
  }
}

export function parseApprovedZohoCommercialFieldMapping(
  env: NodeJS.ProcessEnv = process.env,
  blockers: string[] = [],
): ZohoCommercialFieldMapping | undefined {
  if (value(env, "ZOHO_LEADS_FIELD_MAPPING_APPROVED") !== "true") {
    blockers.push("ZOHO_LEADS_FIELD_MAPPING_APPROVED must be true after tenant review.");
  }
  const raw = value(env, "ZOHO_LEADS_FIELD_MAPPING_JSON");
  if (!raw) {
    blockers.push("ZOHO_LEADS_FIELD_MAPPING_JSON is required.");
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    blockers.push("ZOHO_LEADS_FIELD_MAPPING_JSON must contain valid JSON.");
    return undefined;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    blockers.push("ZOHO_LEADS_FIELD_MAPPING_JSON must be a JSON object.");
    return undefined;
  }

  const record = parsed as Record<string, unknown>;
  const known = new Set<string>(zohoCommercialCanonicalFields);
  const mapping: Partial<Record<ZohoCommercialCanonicalField, string>> = {};
  const apiNames = new Set<string>();

  for (const [canonical, rawApiName] of Object.entries(record)) {
    if (!known.has(canonical)) {
      blockers.push(`Unknown Zoho canonical field ${canonical}.`);
      continue;
    }
    const apiName = typeof rawApiName === "string" ? rawApiName.trim() : "";
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(apiName)) {
      blockers.push(`Tenant-verified Zoho API name is invalid for ${canonical}.`);
      continue;
    }
    if (apiNames.has(apiName)) {
      blockers.push(`Zoho API name ${apiName} is mapped more than once.`);
      continue;
    }
    apiNames.add(apiName);
    mapping[canonical as ZohoCommercialCanonicalField] = apiName;
  }

  for (const canonical of zohoRequiredDayOneFieldMappings) {
    if (!mapping[canonical]) blockers.push(`Tenant-verified Zoho API name is required for ${canonical}.`);
  }

  return blockers.length ? undefined : mapping;
}

export function zohoDayOneCommercialReadiness(env: NodeJS.ProcessEnv = process.env): ZohoDayOneReadiness {
  const blockers: string[] = [];
  for (const name of [
    "ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN", "ZOHO_DC", "ZOHO_LEADS_MODULE_API_NAME",
    "ZOHO_ORGANIZATION_ID", "ZOHO_CRM_OWNER_ID",
  ]) if (!value(env, name)) blockers.push(`${name} is required.`);

  if (value(env, "ZOHO_DAY_ONE_COMMERCIAL_CRM_APPROVED") !== "true") {
    blockers.push("ZOHO_DAY_ONE_COMMERCIAL_CRM_APPROVED must be true.");
  }

  const fieldMapping = parseApprovedZohoCommercialFieldMapping(env, blockers);
  parseStringArray(env, "ZOHO_LEAD_SOURCE_TAXONOMY_JSON", blockers);
  parseStringArray(env, "ZOHO_LEAD_STATUS_PICKLIST_JSON", blockers);
  parseStringArray(env, "ZOHO_LOSS_REASON_PICKLIST_JSON", blockers);
  parseStringArray(env, "ZOHO_DEDUPE_FIELDS_JSON", blockers);

  return { ready: blockers.length === 0, blockers, ...(fieldMapping ? { fieldMapping } : {}) };
}
