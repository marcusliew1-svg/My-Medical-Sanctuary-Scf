import type { CrmAdministrativeLead } from "@/lib/crmDomain";
import { validateCrmAdministrativeLead } from "@/lib/crmDomain";
import { crmIdempotencyKey, SyntheticCrmIdempotencyStore } from "@/lib/crmIdempotency";
import {
  parseApprovedZohoCommercialFieldMapping,
  type ZohoCommercialFieldMapping,
} from "@/lib/zohoCommercialConfiguration";
import {
  createZohoRecord,
  findZohoLeadDuplicateMatches,
  updateZohoRecord,
  withZohoRetry,
  ZohoCrmError,
  type ZohoDuplicateMatch,
  type ZohoRecord,
} from "@/lib/zohoCrm";

export type CrmAdapterLog = {
  event: "dedupe_started" | "duplicate_found" | "lead_created" | "lead_updated" | "idempotent_replay" | "operation_failed";
  idempotencyKey: string;
  crmLeadId?: string;
  outcome: "started" | "success" | "transient_failure" | "permanent_failure";
};

export type ZohoCrmTransport = {
  findDuplicates(moduleName: string, email: string, mobile: string): Promise<ZohoDuplicateMatch>;
  create(moduleName: string, record: ZohoRecord, duplicateCheckFields: readonly string[]): Promise<string>;
  update(moduleName: string, recordId: string, changes: ZohoRecord): Promise<void>;
};

export type CrmUpsertInput = {
  lead: CrmAdministrativeLead;
  sourceRequestId: string;
  assignedOwnerId?: string;
  nextAction?: string;
  nextActionDue?: string;
};

const liveZohoTransport: ZohoCrmTransport = {
  findDuplicates: findZohoLeadDuplicateMatches,
  create: (moduleName, record, duplicateCheckFields) => createZohoRecord(moduleName, record, { duplicateCheckFields }),
  update: updateZohoRecord,
};

function splitName(fullName: string): { firstName?: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { lastName: parts[0].slice(0, 80) };
  const lastName = parts.pop() || fullName;
  return { firstName: parts.join(" ").slice(0, 40), lastName: lastName.slice(0, 80) };
}

export function mapAdministrativeLeadToZoho(
  input: CrmUpsertInput,
  idempotencyKey: string,
  fields: ZohoCommercialFieldMapping,
): ZohoRecord {
  const { firstName, lastName } = splitName(input.lead.name);
  const values: Record<keyof ZohoCommercialFieldMapping, unknown> = {
    firstName, lastName, email: input.lead.email?.trim().toLowerCase() || undefined,
    mobile: input.lead.mobile?.slice(0, 30) || undefined, country: input.lead.country || undefined,
    preferredLocation: input.lead.preferredLocation || undefined, preferredLanguage: input.lead.preferredLanguage || undefined,
    source: input.lead.source, utmSource: input.lead.utmSource || undefined, utmMedium: input.lead.utmMedium || undefined,
    utmCampaign: input.lead.utmCampaign || undefined, referralCode: input.lead.referralCode || undefined,
    partnerId: input.lead.partnerId || undefined, landingPage: input.lead.landingPage || undefined,
    broadInterestCategory: input.lead.broadInterestCategory || undefined, programmeInterest: input.lead.programmeInterest || undefined,
    preferredContactChannel: input.lead.preferredContactChannel || undefined,
    assignedOwner: input.assignedOwnerId ? { id: input.assignedOwnerId } : undefined,
    nextAction: input.nextAction || input.lead.nextAction || undefined,
    nextActionDue: input.nextActionDue || input.lead.nextActionDue || undefined,
    leadStatus: input.lead.leadStatus, conversionStatus: input.lead.conversionStatus || undefined,
    reasonLost: input.lead.reasonLost || undefined, contactConsentTimestamp: input.lead.contactConsentTimestamp,
    contactConsentVersion: input.lead.contactConsentVersion, doNotContact: input.lead.doNotContact,
    idempotencyKey,
  };
  return Object.fromEntries(
    Object.entries(values)
      .map(([canonical, fieldValue]) => [fields[canonical as keyof ZohoCommercialFieldMapping], fieldValue] as const)
      .filter(([fieldApiName, fieldValue]) => Boolean(fieldApiName) && fieldValue !== undefined),
  );
}

export class CrmZohoAdapter {
  private readonly idempotencyStore: SyntheticCrmIdempotencyStore;

  constructor(
    private readonly options: {
      moduleName?: string;
      transport?: ZohoCrmTransport;
      idempotencyStore?: SyntheticCrmIdempotencyStore;
      logger?: (entry: CrmAdapterLog) => void;
      retryAttempts?: number;
      retryBaseDelayMs?: number;
      sleep?: (milliseconds: number) => Promise<void>;
      fieldMapping?: ZohoCommercialFieldMapping;
    } = {},
  ) {
    this.idempotencyStore = options.idempotencyStore || new SyntheticCrmIdempotencyStore();
  }

  async upsert(input: CrmUpsertInput): Promise<{ crmLeadId: string; action: "created" | "updated" | "replayed"; idempotencyKey: string }> {
    const errors = validateCrmAdministrativeLead(input.lead as unknown as Record<string, unknown>);
    if (errors.length) throw new Error(`CRM validation failed: ${errors.join(" ")}`);
    const moduleName = this.options.moduleName || "Leads";
    const transport = this.options.transport || liveZohoTransport;
    const store = this.idempotencyStore;
    const idempotencyKey = crmIdempotencyKey({
      source: input.lead.source,
      sourceRequestId: input.sourceRequestId,
      email: input.lead.email,
      mobile: input.lead.mobile,
    });
    const previous = store.resultFor(idempotencyKey);
    if (previous) {
      this.log({ event: "idempotent_replay", idempotencyKey, crmLeadId: previous, outcome: "success" });
      return { crmLeadId: previous, action: "replayed", idempotencyKey };
    }

    try {
      this.log({ event: "dedupe_started", idempotencyKey, outcome: "started" });
      const duplicates = await this.retry(() => transport.findDuplicates(moduleName, input.lead.email || "", input.lead.mobile || ""));
      const mappingBlockers: string[] = [];
      const fieldMapping = this.options.fieldMapping || parseApprovedZohoCommercialFieldMapping(process.env, mappingBlockers);
      if (!fieldMapping) throw new Error(`Approved tenant Zoho field mapping is required. ${mappingBlockers.join(" ")}`);
      const record = mapAdministrativeLeadToZoho(input, idempotencyKey, fieldMapping);
      const duplicateId = [...duplicates.recordIds].sort()[0];
      if (duplicateId) {
        this.log({ event: "duplicate_found", idempotencyKey, crmLeadId: duplicateId, outcome: "success" });
        await this.retry(() => transport.update(moduleName, duplicateId, record));
        store.record(idempotencyKey, duplicateId);
        this.log({ event: "lead_updated", idempotencyKey, crmLeadId: duplicateId, outcome: "success" });
        return { crmLeadId: duplicateId, action: "updated", idempotencyKey };
      }

      const duplicateCheckFields = [fieldMapping.email, fieldMapping.mobile].filter((field): field is string => Boolean(field));
      const createdId = await this.retry(() => transport.create(moduleName, record, duplicateCheckFields));
      store.record(idempotencyKey, createdId);
      this.log({ event: "lead_created", idempotencyKey, crmLeadId: createdId, outcome: "success" });
      return { crmLeadId: createdId, action: "created", idempotencyKey };
    } catch (error) {
      this.log({
        event: "operation_failed",
        idempotencyKey,
        outcome: error instanceof ZohoCrmError && error.kind === "transient" ? "transient_failure" : "permanent_failure",
      });
      throw error;
    }
  }

  private retry<T>(operation: () => Promise<T>): Promise<T> {
    return withZohoRetry(operation, {
      attempts: this.options.retryAttempts,
      baseDelayMs: this.options.retryBaseDelayMs,
      sleep: this.options.sleep,
    });
  }

  private log(entry: CrmAdapterLog): void {
    this.options.logger?.(entry);
  }
}
