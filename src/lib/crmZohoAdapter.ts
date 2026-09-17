import type { CrmAdministrativeLead } from "@/lib/crmDomain";
import { validateCrmAdministrativeLead } from "@/lib/crmDomain";
import { crmIdempotencyKey, SyntheticCrmIdempotencyStore } from "@/lib/crmIdempotency";
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

export function mapAdministrativeLeadToZoho(input: CrmUpsertInput, idempotencyKey: string): ZohoRecord {
  const { firstName, lastName } = splitName(input.lead.name);
  return {
    First_Name: firstName,
    Last_Name: lastName,
    Email: input.lead.email?.trim().toLowerCase() || undefined,
    Mobile: input.lead.mobile?.slice(0, 30) || undefined,
    Country: input.lead.country || undefined,
    Lead_Source: input.lead.source,
    Lead_Status: input.lead.leadStatus,
    MMS_Idempotency_Key: idempotencyKey,
    MMS_Partner_ID: input.lead.partnerId || undefined,
    MMS_Referral_Code: input.lead.referralCode || undefined,
    MMS_Landing_Page: input.lead.landingPage || undefined,
    MMS_Preferred_Language: input.lead.preferredLanguage || undefined,
    MMS_Interest_Category: input.lead.broadInterestCategory || undefined,
    MMS_Contact_Consent_At: input.lead.contactConsentTimestamp,
    MMS_Contact_Consent_Version: input.lead.contactConsentVersion,
    MMS_Marketing_Consent: input.lead.marketingConsent,
    MMS_Do_Not_Contact: input.lead.doNotContact,
    Owner: input.assignedOwnerId ? { id: input.assignedOwnerId } : undefined,
    MMS_Next_Action: input.nextAction || input.lead.nextAction || undefined,
    MMS_Next_Action_Due: input.nextActionDue || input.lead.nextActionDue || undefined,
  };
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
      const record = mapAdministrativeLeadToZoho(input, idempotencyKey);
      const duplicateId = [...duplicates.recordIds].sort()[0];
      if (duplicateId) {
        this.log({ event: "duplicate_found", idempotencyKey, crmLeadId: duplicateId, outcome: "success" });
        await this.retry(() => transport.update(moduleName, duplicateId, record));
        store.record(idempotencyKey, duplicateId);
        this.log({ event: "lead_updated", idempotencyKey, crmLeadId: duplicateId, outcome: "success" });
        return { crmLeadId: duplicateId, action: "updated", idempotencyKey };
      }

      const createdId = await this.retry(() => transport.create(moduleName, record, ["MMS_Idempotency_Key", "Email", "Mobile"]));
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
