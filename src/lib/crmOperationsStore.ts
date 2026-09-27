import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { calculateSlaStatus, clinicManagerSlaConfiguration, type ClinicManagerQueueItem } from "@/lib/clinicManagerQueue";
import { validateCrmAdministrativeLead, type CrmAdministrativeLead, type CrmLeadStatus } from "@/lib/crmDomain";
import { mmsCommercialDatabaseClient, type MmsCommercialTransaction } from "@/lib/mmsCommercialDatabaseClient";
import { assertCrmPreviewRuntime } from "@/lib/crmPreviewRuntime";
import type { ManagementLeadObservation } from "@/lib/managementIntelligence";

export type CrmQueueAction =
  | { kind: "assign"; ownerId: string }
  | { kind: "contact" }
  | { kind: "next_action"; nextAction: string; nextActionDue: string }
  | { kind: "escalate"; reason: string }
  | { kind: "close"; reason: string; status: Extract<CrmLeadStatus, "Not Proceeding" | "Do Not Contact" | "Spam" | "Duplicate"> };

type QueueRow = Record<string, unknown> & {
  public_enquiry_id: string;
  full_name: string;
  source: string;
  partner_id: string | null;
  preferred_contact_channel: string | null;
  lead_status: CrmLeadStatus;
  created_at: string;
  assigned_owner_id: string | null;
  queue_state: ClinicManagerQueueItem["queueState"];
  next_action: string | null;
  next_action_due_at: string;
  escalated: boolean;
};

const QUEUE_SELECT = `select e.public_enquiry_id,e.full_name,e.source,e.partner_id,e.preferred_contact_channel,
  e.lead_status,e.created_at,q.assigned_owner_id,q.queue_state,q.next_action,q.next_action_due_at,q.escalated
  from mms_commercial.crm_enquiries e
  join mms_commercial.crm_queue_state q on q.enquiry_id=e.id`;

function hash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function clean(value: string | undefined, max = 240): string | null {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, max) : null;
}

function mapQueueRow(row: QueueRow, now: string): ClinicManagerQueueItem {
  const configuration = clinicManagerSlaConfiguration();
  return {
    crmLeadId: row.public_enquiry_id,
    displayName: row.full_name,
    contactChannel: row.preferred_contact_channel || "Not specified",
    source: row.source,
    ...(row.partner_id ? { partnerId: row.partner_id } : {}),
    assignedOwner: row.assigned_owner_id || "Clinic Manager queue",
    queueState: row.queue_state,
    nextAction: row.next_action || "Acknowledge enquiry",
    nextActionDue: new Date(row.next_action_due_at).toISOString(),
    enquiryAgeMinutes: Math.max(0, Math.floor((Date.parse(now) - Date.parse(row.created_at)) / 60_000)),
    slaStatus: calculateSlaStatus(String(row.next_action_due_at), now, configuration.dueSoonMinutes),
    escalated: row.escalated,
  };
}

export async function listCrmQueue(now = new Date().toISOString()): Promise<ClinicManagerQueueItem[]> {
  assertCrmPreviewRuntime();
  const result = await mmsCommercialDatabaseClient().query<QueueRow>(`${QUEUE_SELECT} order by q.next_action_due_at asc limit 200`);
  return result.rows.map((row) => mapQueueRow(row, now));
}

export async function listCrmManagementObservations(): Promise<ManagementLeadObservation[]> {
  assertCrmPreviewRuntime();
  const result = await mmsCommercialDatabaseClient().query<Record<string, unknown>>(`select
    e.public_enquiry_id,e.full_name,e.country,e.preferred_location,e.preferred_language,e.source,e.campaign,
    e.utm_source,e.utm_medium,e.utm_campaign,e.referral_code,e.partner_id,e.landing_page,e.broad_interest_category,
    e.programme_interest,e.treatment_information_interest,e.preferred_contact_channel,e.preferred_contact_time,
    e.lead_status,e.contact_consent_at,e.contact_consent_version,e.marketing_consent,e.source_consent_evidence,
    e.do_not_contact,e.created_at,q.assigned_owner_id,q.next_action,q.next_action_due_at,q.first_response_at,q.closed_reason
    from mms_commercial.crm_enquiries e join mms_commercial.crm_queue_state q on q.enquiry_id=e.id
    order by e.created_at desc limit 500`);
  return result.rows.map((row) => ({
    lead: {
      crmLeadId: String(row.public_enquiry_id), name: String(row.full_name), country: clean(String(row.country || "")) || undefined,
      preferredLocation: clean(String(row.preferred_location || "")) || undefined,
      preferredLanguage: clean(String(row.preferred_language || "")) || undefined, source: String(row.source),
      campaign: clean(String(row.campaign || "")) || undefined, utmSource: clean(String(row.utm_source || "")) || undefined,
      utmMedium: clean(String(row.utm_medium || "")) || undefined, utmCampaign: clean(String(row.utm_campaign || "")) || undefined,
      referralCode: clean(String(row.referral_code || "")) || undefined, partnerId: clean(String(row.partner_id || "")) || undefined,
      landingPage: clean(String(row.landing_page || "")) || undefined,
      broadInterestCategory: clean(String(row.broad_interest_category || "")) || undefined,
      programmeInterest: clean(String(row.programme_interest || "")) || undefined,
      treatmentInformationInterest: clean(String(row.treatment_information_interest || "")) || undefined,
      preferredContactChannel: clean(String(row.preferred_contact_channel || "")) || undefined,
      preferredContactTime: clean(String(row.preferred_contact_time || "")) || undefined,
      leadStatus: row.lead_status as CrmLeadStatus, assignedClinicManager: clean(String(row.assigned_owner_id || "")) || undefined,
      nextAction: clean(String(row.next_action || "")) || undefined,
      nextActionDue: row.next_action_due_at ? new Date(String(row.next_action_due_at)).toISOString() : undefined,
      reasonLost: clean(String(row.closed_reason || "")) || undefined,
      contactConsentTimestamp: new Date(String(row.contact_consent_at)).toISOString(), contactConsentVersion: String(row.contact_consent_version),
      marketingConsent: Boolean(row.marketing_consent), sourceConsentEvidence: String(row.source_consent_evidence), doNotContact: Boolean(row.do_not_contact),
    },
    createdAt: new Date(String(row.created_at)).toISOString(),
    ...(row.first_response_at ? { firstResponseAt: new Date(String(row.first_response_at)).toISOString() } : {}),
  }));
}

export async function getCrmLeadForAssistant(publicEnquiryId: string): Promise<CrmAdministrativeLead | null> {
  assertCrmPreviewRuntime();
  const result = await mmsCommercialDatabaseClient().query<Record<string, unknown>>(`select
    e.public_enquiry_id,e.full_name,(e.email_normalized is not null) as has_email,(e.phone_normalized is not null) as has_mobile,
    e.source,e.partner_id,e.broad_interest_category,e.programme_interest,e.treatment_information_interest,
    e.preferred_contact_channel,e.preferred_contact_time,e.lead_status,e.contact_consent_at,e.contact_consent_version,
    e.marketing_consent,e.source_consent_evidence,e.do_not_contact,q.next_action,q.next_action_due_at
    from mms_commercial.crm_enquiries e join mms_commercial.crm_queue_state q on q.enquiry_id=e.id
    where e.public_enquiry_id=$1`, [publicEnquiryId]);
  const row = result.rows[0];
  if (!row) return null;
  return {
    crmLeadId: String(row.public_enquiry_id), name: String(row.full_name),
    ...(row.has_email ? { email: "present" } : {}), ...(row.has_mobile ? { mobile: "present" } : {}),
    source: String(row.source), partnerId: clean(String(row.partner_id || "")) || undefined,
    broadInterestCategory: clean(String(row.broad_interest_category || "")) || undefined,
    programmeInterest: clean(String(row.programme_interest || "")) || undefined,
    treatmentInformationInterest: clean(String(row.treatment_information_interest || "")) || undefined,
    preferredContactChannel: clean(String(row.preferred_contact_channel || "")) || undefined,
    preferredContactTime: clean(String(row.preferred_contact_time || "")) || undefined,
    leadStatus: row.lead_status as CrmLeadStatus, nextAction: clean(String(row.next_action || "")) || undefined,
    nextActionDue: row.next_action_due_at ? new Date(String(row.next_action_due_at)).toISOString() : undefined,
    contactConsentTimestamp: new Date(String(row.contact_consent_at)).toISOString(), contactConsentVersion: String(row.contact_consent_version),
    marketingConsent: Boolean(row.marketing_consent), sourceConsentEvidence: String(row.source_consent_evidence), doNotContact: Boolean(row.do_not_contact),
  };
}

export async function listPartnerCrmAttribution(requestingPartnerId: string): Promise<Array<{
  crmLeadId: string; leadStatus: CrmLeadStatus; source: string; partnerId: string; referralCode?: string;
}>> {
  assertCrmPreviewRuntime();
  if (!/^SYNTH-[A-Z0-9_-]{3,80}$/.test(requestingPartnerId)) throw new Error("Preview Partner ID is invalid.");
  const result = await mmsCommercialDatabaseClient().query<Record<string, unknown>>(`select
    public_enquiry_id,lead_status,source,partner_id,referral_code from mms_commercial.crm_enquiries
    where partner_id=$1 order by created_at desc limit 200`, [requestingPartnerId]);
  return result.rows.map((row) => ({
    crmLeadId: String(row.public_enquiry_id), leadStatus: row.lead_status as CrmLeadStatus,
    source: String(row.source), partnerId: String(row.partner_id),
    ...(row.referral_code ? { referralCode: String(row.referral_code) } : {}),
  }));
}

export async function createSyntheticCrmEnquiry(input: {
  lead: CrmAdministrativeLead;
  sourceRequestId: string;
  actorId?: string;
}): Promise<{ crmLeadId: string; replayed: boolean }> {
  assertCrmPreviewRuntime();
  const errors = validateCrmAdministrativeLead(input.lead as unknown as Record<string, unknown>);
  if (errors.length) throw new Error(errors.join(" "));
  if (!input.lead.source.toLowerCase().includes("synthetic")) throw new Error("Preview CRM accepts synthetic enquiries only.");
  if (input.lead.partnerId && !/^SYNTH-[A-Z0-9_-]{3,80}$/.test(input.lead.partnerId)) throw new Error("Preview Partner IDs must use the SYNTH- prefix.");
  const requestId = input.sourceRequestId.trim();
  if (!requestId) throw new Error("A source request ID is required.");
  const keyHash = hash(`synthetic_crm_enquiry:${requestId}`);
  const fingerprint = hash(JSON.stringify(input.lead));
  const dueAt = input.lead.nextActionDue || new Date(Date.now() + clinicManagerSlaConfiguration().acknowledgementMinutes * 60_000).toISOString();

  return mmsCommercialDatabaseClient().transaction(async (tx) => {
    await tx.query(`insert into mms_commercial.crm_idempotency_reservations(scope,key_hash,request_fingerprint,state)
      values ('synthetic_crm_enquiry',$1,$2,'Reserved') on conflict (scope,key_hash) do nothing`, [keyHash, fingerprint]);
    const reservation = await tx.query<Record<string, unknown> & { id: string; request_fingerprint: string; state: string; enquiry_id: string | null }>(
      `select id,request_fingerprint,state,enquiry_id from mms_commercial.crm_idempotency_reservations
       where scope='synthetic_crm_enquiry' and key_hash=$1 for update`, [keyHash],
    );
    const held = reservation.rows[0];
    if (!held || held.request_fingerprint !== fingerprint) throw new Error("Idempotency key was reused with a different request.");
    if (held.state === "Completed" && held.enquiry_id) {
      const existing = await tx.query<Record<string, unknown> & { public_enquiry_id: string }>(
        `select public_enquiry_id from mms_commercial.crm_enquiries where id=$1`, [held.enquiry_id],
      );
      if (!existing.rows[0]) throw new Error("Completed idempotency reservation is inconsistent.");
      return { crmLeadId: existing.rows[0].public_enquiry_id, replayed: true };
    }

    const enquiry = await tx.query<Record<string, unknown> & { id: string; public_enquiry_id: string }>(
      `insert into mms_commercial.crm_enquiries(
        idempotency_reservation_id,full_name,email_normalized,phone_normalized,country,preferred_location,preferred_language,
        source,campaign,utm_source,utm_medium,utm_campaign,referral_code,partner_id,landing_page,broad_interest_category,
        programme_interest,treatment_information_interest,preferred_contact_channel,preferred_contact_time,lead_status,
        contact_consent_at,contact_consent_version,marketing_consent,source_consent_evidence,do_not_contact)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
       returning id,public_enquiry_id`, [
        held.id, input.lead.name.trim(), clean(input.lead.email?.toLowerCase(), 320), clean(input.lead.mobile, 40), clean(input.lead.country, 80),
        clean(input.lead.preferredLocation, 120), clean(input.lead.preferredLanguage, 40), input.lead.source.trim(), clean(input.lead.campaign),
        clean(input.lead.utmSource), clean(input.lead.utmMedium), clean(input.lead.utmCampaign), clean(input.lead.referralCode, 100),
        clean(input.lead.partnerId, 100), clean(input.lead.landingPage, 500), clean(input.lead.broadInterestCategory), clean(input.lead.programmeInterest),
        clean(input.lead.treatmentInformationInterest), clean(input.lead.preferredContactChannel, 80), clean(input.lead.preferredContactTime, 120),
        input.lead.leadStatus, input.lead.contactConsentTimestamp, input.lead.contactConsentVersion.trim(), input.lead.marketingConsent,
        input.lead.sourceConsentEvidence.trim(), input.lead.doNotContact,
      ],
    );
    const created = enquiry.rows[0];
    await tx.query(`insert into mms_commercial.crm_queue_state(enquiry_id,queue_state,assigned_owner_id,next_action,next_action_due_at)
      values ($1,'New',$2,$3,$4)`, [created.id, clean(input.lead.assignedClinicManager, 160), clean(input.lead.nextAction), dueAt]);
    await tx.query(`insert into mms_commercial.crm_sync_state(enquiry_id,provider,sync_status)
      values ($1,'Synthetic Adapter','Pending')`, [created.id]);
    await insertAudit(tx, created.id, input.actorId || "synthetic-preview-ingest", "System", "enquiry_created", null,
      { leadStatus: input.lead.leadStatus, queueState: "New" }, "System", true, "Synthetic Preview enquiry created.");
    await tx.query(`update mms_commercial.crm_idempotency_reservations set state='Completed',enquiry_id=$2,completed_at=now() where id=$1`, [held.id, created.id]);
    return { crmLeadId: created.public_enquiry_id, replayed: false };
  });
}

async function insertAudit(
  tx: MmsCommercialTransaction,
  enquiryId: string,
  actorId: string,
  actorType: "Operator" | "System",
  eventType: string,
  previousState: unknown,
  newState: unknown,
  suggestionSource: "Human" | "AI Advisory" | "System",
  humanApproved: boolean,
  reason: string | null,
): Promise<void> {
  await tx.query(`insert into mms_commercial.crm_audit_events(
    enquiry_id,event_type,actor_id,actor_type,previous_state,new_state,reason,suggestion_source,human_approved,occurred_at)
    values ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9,now())`, [
    enquiryId, eventType, actorId, actorType, JSON.stringify(previousState), JSON.stringify(newState), reason, suggestionSource, humanApproved,
  ]);
}

export async function applyCrmQueueAction(input: {
  publicEnquiryId: string;
  action: CrmQueueAction;
  actorId: string;
  suggestionSource?: "Human" | "AI Advisory";
}): Promise<void> {
  assertCrmPreviewRuntime();
  const suggestionSource = input.suggestionSource || "Human";
  await mmsCommercialDatabaseClient().transaction(async (tx) => {
    const current = await tx.query<Record<string, unknown> & { id: string; lead_status: CrmLeadStatus; queue_state: string; version: number }>(
      `select e.id,e.lead_status,q.queue_state,q.version from mms_commercial.crm_enquiries e
       join mms_commercial.crm_queue_state q on q.enquiry_id=e.id where e.public_enquiry_id=$1 for update`, [input.publicEnquiryId],
    );
    const row = current.rows[0];
    if (!row) throw new Error("CRM enquiry was not found.");
    const previousState = { leadStatus: row.lead_status, queueState: row.queue_state, version: row.version };
    let reason: string | null = null;
    let eventType = input.action.kind;

    if (input.action.kind === "assign") {
      const owner = clean(input.action.ownerId, 160);
      if (!owner) throw new Error("An owner is required.");
      await tx.query(`update mms_commercial.crm_queue_state set assigned_owner_id=$2,version=version+1 where enquiry_id=$1`, [row.id, owner]);
    } else if (input.action.kind === "contact") {
      await tx.query(`update mms_commercial.crm_enquiries set lead_status='Contact Attempted' where id=$1`, [row.id]);
      await tx.query(`update mms_commercial.crm_queue_state set queue_state='Awaiting Contact',first_response_at=coalesce(first_response_at,now()),version=version+1 where enquiry_id=$1`, [row.id]);
    } else if (input.action.kind === "next_action") {
      if (!clean(input.action.nextAction) || Number.isNaN(Date.parse(input.action.nextActionDue))) throw new Error("A valid next action and due time are required.");
      await tx.query(`update mms_commercial.crm_queue_state set next_action=$2,next_action_due_at=$3,queue_state='Follow-Up Due',version=version+1 where enquiry_id=$1`, [row.id, input.action.nextAction.trim(), input.action.nextActionDue]);
    } else if (input.action.kind === "escalate") {
      reason = clean(input.action.reason);
      if (!reason) throw new Error("Escalation requires a reason.");
      await tx.query(`update mms_commercial.crm_queue_state set queue_state='Escalated',escalated=true,version=version+1 where enquiry_id=$1`, [row.id]);
    } else {
      reason = clean(input.action.reason);
      if (!reason) throw new Error("Closing an enquiry requires a reason.");
      await tx.query(`update mms_commercial.crm_enquiries set lead_status=$2,do_not_contact=($2='Do Not Contact') where id=$1`, [row.id, input.action.status]);
      await tx.query(`update mms_commercial.crm_queue_state set queue_state='Completed',closed_reason=$2,version=version+1 where enquiry_id=$1`, [row.id, reason]);
    }
    await insertAudit(tx, row.id, input.actorId, "Operator", eventType, previousState,
      { action: input.action.kind }, suggestionSource, true, reason);
  });
}

export function syntheticSourceRequestId(prefix = "T6.13"): string {
  return `${prefix}-${randomUUID()}`;
}
