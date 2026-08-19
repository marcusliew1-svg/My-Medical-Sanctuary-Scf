import { createHash } from "node:crypto";
import type {
  MmsCommercialDatabaseClient,
  MmsCommercialTransaction,
} from "@/lib/mmsCommercialDatabaseClient";
import type { CommercialLead, LeadOwnershipEvent } from "@/lib/partnerCommercialModel";
import type { PartnerLeadLifecycleEvent } from "@/lib/partnerLeadLifecycle";
import type { PartnerLeadDuplicateDecision, PartnerLeadRegistration } from "@/lib/partnerLeadRegistry";
import type {
  PartnerLeadRegistryRecord,
  PartnerLeadRegistryStore,
  PartnerLeadRegistryStoreResult,
} from "@/lib/partnerLeadRegistryStore";

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) throw new Error("Database returned an invalid timestamp.");
  return parsed.toISOString();
}

function optionalIso(value: unknown): string | undefined {
  return value === null || value === undefined ? undefined : iso(value);
}

function hashIdempotencyKey(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function asResultError<T>(error: unknown): PartnerLeadRegistryStoreResult<T> {
  const message = error instanceof Error ? error.message : "Partner Lead Registry database operation failed.";
  if (message.includes("possible_duplicate")) return { status: "conflict", reason: "Potential matching lead records require duplicate review." };
  if (message.includes("partner_not_active")) return { status: "conflict", reason: "Only an Active selling-enabled MMS Sales Partner may register a lead." };
  if (message.includes("ownership_conflict") || message.includes("lifecycle_conflict")) {
    return { status: "conflict", reason: "Lead state changed before this operation completed. Reload and retry." };
  }
  if (message.includes("idempotency")) return { status: "conflict", reason: "Lead registration idempotency conflict." };
  return { status: "unavailable", reason: "Partner Lead Registry database operation is unavailable." };
}

type LeadRow = {
  public_lead_id: string;
  registered_by_partner_code: string;
  current_partner_code: string;
  full_name: string;
  email_normalized: string | null;
  phone_normalized: string | null;
  source: string | null;
  campaign: string | null;
  stage: CommercialLead["stage"];
  duplicate_status: NonNullable<CommercialLead["duplicateStatus"]>;
  consent_version: string;
  consent_captured_at: unknown;
  registered_at: unknown;
  last_activity_at: unknown | null;
  next_action_at: unknown | null;
};

function registrationFromRow(row: LeadRow): PartnerLeadRegistration {
  return {
    lead: {
      leadId: row.public_lead_id,
      registeredByPartnerId: row.registered_by_partner_code,
      currentPartnerId: row.current_partner_code,
      registeredAt: iso(row.registered_at),
      stage: row.stage,
      source: row.source || undefined,
      campaign: row.campaign || undefined,
      duplicateStatus: row.duplicate_status,
      consentCapturedAt: iso(row.consent_captured_at),
      lastActivityAt: optionalIso(row.last_activity_at),
      nextActionAt: optionalIso(row.next_action_at),
    },
    contact: {
      fullName: row.full_name,
      email: row.email_normalized || undefined,
      phone: row.phone_normalized || undefined,
    },
    consentVersion: row.consent_version,
  };
}

async function loadRecord(db: MmsCommercialTransaction, publicLeadId: string): Promise<PartnerLeadRegistryRecord | null> {
  const leadResult = await db.query<LeadRow>(
    `select l.public_lead_id,
            rp.partner_code as registered_by_partner_code,
            cp.partner_code as current_partner_code,
            l.full_name, l.email_normalized, l.phone_normalized, l.source, l.campaign,
            l.stage, l.duplicate_status, l.consent_version, l.consent_captured_at,
            l.registered_at, l.last_activity_at, l.next_action_at
       from mms_commercial.leads l
       join mms_commercial.partners rp on rp.id = l.registered_by_partner_id
       join mms_commercial.partners cp on cp.id = l.current_partner_id
      where l.public_lead_id = $1`,
    [publicLeadId],
  );
  const row = leadResult.rows[0];
  if (!row) return null;

  const duplicateResult = await db.query<{
    status: PartnerLeadDuplicateDecision["status"];
    matched_public_lead_ids: string[];
    checked_at: unknown;
    checked_by: string;
  }>(
    `select d.status, d.matched_public_lead_ids, d.checked_at, d.checked_by
       from mms_commercial.lead_duplicate_decisions d
       join mms_commercial.leads l on l.id = d.lead_id
      where l.public_lead_id = $1
      order by d.checked_at desc, d.created_at desc
      limit 1`,
    [publicLeadId],
  );

  const ownershipResult = await db.query<{
    event_id: string;
    previous_partner_code: string | null;
    new_partner_code: string;
    reason: string;
    approved_by: string;
    occurred_at: unknown;
  }>(
    `select e.id::text as event_id, pp.partner_code as previous_partner_code,
            np.partner_code as new_partner_code, e.reason, e.approved_by, e.occurred_at
       from mms_commercial.lead_ownership_events e
       join mms_commercial.leads l on l.id = e.lead_id
       left join mms_commercial.partners pp on pp.id = e.previous_partner_id
       join mms_commercial.partners np on np.id = e.new_partner_id
      where l.public_lead_id = $1
      order by e.occurred_at, e.created_at`,
    [publicLeadId],
  );

  const lifecycleResult = await db.query<{
    event_id: string;
    previous_stage: CommercialLead["stage"];
    next_stage: CommercialLead["stage"];
    actor: string;
    reason: string | null;
    occurred_at: unknown;
  }>(
    `select e.id::text as event_id, e.previous_stage, e.next_stage, e.actor, e.reason, e.occurred_at
       from mms_commercial.lead_lifecycle_events e
       join mms_commercial.leads l on l.id = e.lead_id
      where l.public_lead_id = $1
      order by e.occurred_at, e.created_at`,
    [publicLeadId],
  );

  const latestDuplicate = duplicateResult.rows[0];
  return {
    ...registrationFromRow(row),
    duplicateDecision: latestDuplicate
      ? {
          status: latestDuplicate.status,
          matchedLeadIds: latestDuplicate.matched_public_lead_ids || [],
          checkedAt: iso(latestDuplicate.checked_at),
          checkedBy: latestDuplicate.checked_by,
        }
      : undefined,
    ownershipEvents: ownershipResult.rows.map<LeadOwnershipEvent>((event) => ({
      eventId: event.event_id,
      leadId: publicLeadId,
      previousPartnerId: event.previous_partner_code || undefined,
      newPartnerId: event.new_partner_code,
      reason: event.reason,
      approvedBy: event.approved_by,
      occurredAt: iso(event.occurred_at),
    })),
    lifecycleEvents: lifecycleResult.rows.map<PartnerLeadLifecycleEvent>((event) => ({
      eventId: event.event_id,
      leadId: publicLeadId,
      previousStage: event.previous_stage,
      newStage: event.next_stage,
      actor: event.actor,
      reason: event.reason || undefined,
      occurredAt: iso(event.occurred_at),
    })),
  };
}

export function postgresPartnerLeadRegistryStore(client: MmsCommercialDatabaseClient): PartnerLeadRegistryStore {
  return {
    async allocateLeadId() {
      return { status: "unavailable", reason: "PostgreSQL Lead IDs are allocated atomically during create; standalone pre-allocation is disabled." };
    },

    async create(registration) {
      try {
        const record = await client.transaction(async (tx) => {
          const partner = await tx.query<{ id: string }>(
            "select id::text from mms_commercial.partners where upper(partner_code)=upper($1) and stage='Active' and selling_enabled=true for share",
            [registration.lead.currentPartnerId],
          );
          const partnerId = partner.rows[0]?.id;
          if (!partnerId) throw new Error("partner_not_active");
          await tx.query(
            `insert into mms_commercial.leads(
               public_lead_id, registered_by_partner_id, current_partner_id, full_name,
               email_normalized, phone_normalized, source, campaign, stage, duplicate_status,
               consent_version, consent_captured_at, registered_at, last_activity_at, next_action_at
             ) values ($1,$2,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
            [
              registration.lead.leadId,
              partnerId,
              registration.contact.fullName,
              registration.contact.email || null,
              registration.contact.phone || null,
              registration.lead.source || null,
              registration.lead.campaign || null,
              registration.lead.stage,
              registration.lead.duplicateStatus || "Unchecked",
              registration.consentVersion,
              registration.lead.consentCapturedAt,
              registration.lead.registeredAt,
              registration.lead.lastActivityAt || registration.lead.registeredAt,
              registration.lead.nextActionAt || null,
            ],
          );
          return loadRecord(tx, registration.lead.leadId);
        });
        return record ? { status: "ok", value: record } : { status: "conflict", reason: "Created lead could not be reloaded." };
      } catch (error) {
        return asResultError(error);
      }
    },

    async createIdempotent(params) {
      try {
        const result = await client.query<{ public_lead_id: string; replayed: boolean }>(
          "select public_lead_id, replayed from mms_commercial.register_partner_lead($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
          [
            hashIdempotencyKey(params.idempotencyKey),
            params.partnerId,
            params.contact.fullName,
            params.contact.email || null,
            params.contact.phone || null,
            params.source || null,
            params.campaign || null,
            params.consentVersion,
            params.consentCapturedAt,
            params.registeredAt,
          ],
        );
        const leadId = result.rows[0]?.public_lead_id;
        if (!leadId) return { status: "conflict", reason: "Lead registration did not return an allocated Lead ID." };
        const record = await loadRecord(client, leadId);
        return record ? { status: "ok", value: record } : { status: "conflict", reason: "Registered lead could not be reloaded." };
      } catch (error) {
        return asResultError(error);
      }
    },

    async get(leadId) {
      try {
        return { status: "ok", value: await loadRecord(client, leadId) };
      } catch (error) {
        return asResultError(error);
      }
    },

    async listOwnedByPartner(partnerId) {
      try {
        const result = await client.query<{ public_lead_id: string }>(
          `select l.public_lead_id from mms_commercial.leads l
            join mms_commercial.partners p on p.id=l.current_partner_id
           where upper(p.partner_code)=upper($1) order by l.registered_at desc`,
          [partnerId],
        );
        const records = await Promise.all(result.rows.map((row) => loadRecord(client, row.public_lead_id)));
        return { status: "ok", value: records.filter((record): record is PartnerLeadRegistryRecord => Boolean(record)) };
      } catch (error) {
        return asResultError(error);
      }
    },

    async findPotentialDuplicates(contact) {
      try {
        const result = await client.query<{ public_lead_id: string }>(
          `select public_lead_id from mms_commercial.leads
            where ($1::text is not null and email_normalized=lower($1))
               or ($2::text is not null and phone_normalized=$2)
            order by registered_at desc limit 25`,
          [contact.email || null, contact.phone || null],
        );
        return { status: "ok", value: result.rows.map((row) => row.public_lead_id) };
      } catch (error) {
        return asResultError(error);
      }
    },

    async recordDuplicateDecision(leadId, decision) {
      try {
        await client.transaction(async (tx) => {
          const lead = await tx.query<{ id: string }>("select id::text from mms_commercial.leads where public_lead_id=$1 for update", [leadId]);
          const id = lead.rows[0]?.id;
          if (!id) throw new Error("lead_not_found");
          await tx.query(
            "insert into mms_commercial.lead_duplicate_decisions(lead_id,status,matched_public_lead_ids,checked_by,checked_at) values ($1,$2,$3,$4,$5)",
            [id, decision.status, decision.matchedLeadIds, decision.checkedBy, decision.checkedAt],
          );
          await tx.query(
            "update mms_commercial.leads set duplicate_status=$2, stage=case when $2='Confirmed Duplicate' then 'Duplicate' else stage end where id=$1",
            [id, decision.status],
          );
        });
        const record = await loadRecord(client, leadId);
        return record ? { status: "ok", value: record } : { status: "conflict", reason: "Lead could not be reloaded." };
      } catch (error) {
        return asResultError(error);
      }
    },

    async appendOwnershipTransfer(lead, event) {
      try {
        await client.transaction(async (tx) => {
          const current = await tx.query<{ lead_uuid: string; current_partner_code: string }>(
            `select l.id::text as lead_uuid,p.partner_code as current_partner_code
               from mms_commercial.leads l join mms_commercial.partners p on p.id=l.current_partner_id
              where l.public_lead_id=$1 for update of l`,
            [lead.leadId],
          );
          const row = current.rows[0];
          if (!row || row.current_partner_code !== event.previousPartnerId) throw new Error("ownership_conflict");
          const next = await tx.query<{ id: string }>(
            "select id::text from mms_commercial.partners where upper(partner_code)=upper($1) and stage='Active' and selling_enabled=true",
            [event.newPartnerId],
          );
          const nextId = next.rows[0]?.id;
          if (!nextId) throw new Error("partner_not_active");
          await tx.query(
            `insert into mms_commercial.lead_ownership_events(lead_id,previous_partner_id,new_partner_id,reason,approved_by,occurred_at)
             select $1,current_partner_id,$2,$3,$4,$5 from mms_commercial.leads where id=$1`,
            [row.lead_uuid, nextId, event.reason, event.approvedBy, event.occurredAt],
          );
          await tx.query("update mms_commercial.leads set current_partner_id=$2 where id=$1", [row.lead_uuid, nextId]);
        });
        const record = await loadRecord(client, lead.leadId);
        return record ? { status: "ok", value: record } : { status: "conflict", reason: "Lead could not be reloaded." };
      } catch (error) {
        return asResultError(error);
      }
    },

    async appendLifecycleTransition(lead, event) {
      try {
        await client.transaction(async (tx) => {
          const current = await tx.query<{ id: string; stage: CommercialLead["stage"] }>(
            "select id::text,stage from mms_commercial.leads where public_lead_id=$1 for update",
            [lead.leadId],
          );
          const row = current.rows[0];
          if (!row || row.stage !== event.previousStage) throw new Error("lifecycle_conflict");
          await tx.query(
            "insert into mms_commercial.lead_lifecycle_events(lead_id,previous_stage,next_stage,actor,reason,occurred_at) values ($1,$2,$3,$4,$5,$6)",
            [row.id, event.previousStage, event.newStage, event.actor, event.reason || null, event.occurredAt],
          );
          await tx.query("update mms_commercial.leads set stage=$2,last_activity_at=$3 where id=$1", [row.id, event.newStage, event.occurredAt]);
        });
        const record = await loadRecord(client, lead.leadId);
        return record ? { status: "ok", value: record } : { status: "conflict", reason: "Lead could not be reloaded." };
      } catch (error) {
        return asResultError(error);
      }
    },
  };
}
