import { createHash } from "node:crypto";
import type { MmsCommercialDatabaseClient } from "@/lib/mmsCommercialDatabaseClient";
import type { PartnerCommerceRecord, PartnerCommerceStore, PartnerCommerceStoreResult } from "@/lib/partnerCommerceStore";
import type { CommercialApplication, CommercialMembership, CommercialPayment } from "@/lib/partnerCommercialModel";
import type { CommercialWorkflowEvent, MembershipActivationEvidence, PaymentVerificationEvidence } from "@/lib/partnerCommerceWorkflow";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) throw new Error("Database returned an invalid timestamp.");
  return d.toISOString();
}
function optionalIso(value: unknown): string | undefined {
  return value === null || value === undefined ? undefined : iso(value);
}
function failure<T>(error: unknown): PartnerCommerceStoreResult<T> {
  const message = error instanceof Error ? error.message : "commerce_database_error";
  if (/(conflict|not_|mismatch|precedes|already|eligible|owned|ready|idempotency)/.test(message)) {
    return { status: "conflict", reason: "Commercial workflow state changed or does not satisfy the requested transition." };
  }
  return { status: "unavailable", reason: "MMS commercial workflow database operation is unavailable." };
}

async function loadRecord(client: MmsCommercialDatabaseClient, applicationId: string): Promise<PartnerCommerceRecord | null> {
  const app = await client.query<{
    public_application_id: string; public_lead_id: string; partner_code: string; membership_code: CommercialApplication["membershipCode"];
    stage: CommercialApplication["stage"]; submitted_at: unknown | null; approved_at: unknown | null; activated_at: unknown | null;
  }>(`select a.public_application_id,l.public_lead_id,p.partner_code,a.membership_code,a.stage,a.submitted_at,a.approved_at,a.activated_at
        from mms_commercial.applications a join mms_commercial.leads l on l.id=a.lead_id
        join mms_commercial.partners p on p.id=a.partner_id where a.public_application_id=$1`, [applicationId]);
  const a = app.rows[0];
  if (!a) return null;
  const application: CommercialApplication = { applicationId:a.public_application_id, leadId:a.public_lead_id, partnerId:a.partner_code, membershipCode:a.membership_code, stage:a.stage, submittedAt:optionalIso(a.submitted_at), approvedAt:optionalIso(a.approved_at), activatedAt:optionalIso(a.activated_at) };

  const pay = await client.query<{
    public_payment_id:string; transaction_reference:string; amount_minor_units:number; currency:string; stage:CommercialPayment["stage"];
    submitted_at:unknown|null; cleared_at:unknown|null; refund_amount_minor_units:number|null;
  }>(`select public_payment_id,transaction_reference,amount_minor_units,currency,stage,submitted_at,cleared_at,refund_amount_minor_units
        from mms_commercial.payments where application_id=(select id from mms_commercial.applications where public_application_id=$1)
        order by created_at desc limit 1`, [applicationId]);
  const p = pay.rows[0];
  const payment: CommercialPayment | undefined = p ? { paymentId:p.public_payment_id, applicationId, transactionReference:p.transaction_reference, amountMinorUnits:Number(p.amount_minor_units), currency:p.currency, stage:p.stage, submittedAt:optionalIso(p.submitted_at), clearedAt:optionalIso(p.cleared_at), refundAmountMinorUnits:p.refund_amount_minor_units===null?undefined:Number(p.refund_amount_minor_units) } : undefined;

  const mem = await client.query<{
    public_membership_id:string; member_reference:string; membership_code:CommercialMembership["membershipCode"]; status:CommercialMembership["status"]; activated_at:unknown|null; cancelled_at:unknown|null;
  }>(`select public_membership_id,member_reference,membership_code,status,activated_at,cancelled_at
        from mms_commercial.memberships where application_id=(select id from mms_commercial.applications where public_application_id=$1) limit 1`, [applicationId]);
  const m = mem.rows[0];
  const membership: CommercialMembership | undefined = m ? { membershipId:m.public_membership_id, applicationId, memberReference:m.member_reference, membershipCode:m.membership_code, status:m.status, activatedAt:optionalIso(m.activated_at), cancelledAt:optionalIso(m.cancelled_at) } : undefined;

  const ver = payment ? await client.query<{verified_by:string;verified_at:unknown;cleared_amount_minor_units:number;currency:string;source:PaymentVerificationEvidence["source"];source_reference:string}>(
    `select v.verified_by,v.verified_at,v.cleared_amount_minor_units,v.currency,v.source,v.source_reference from mms_commercial.payment_verifications v
      join mms_commercial.payments p on p.id=v.payment_id where p.public_payment_id=$1 order by v.verified_at desc limit 1`, [payment.paymentId]) : {rows:[],rowCount:0};
  const v = ver.rows[0];
  const paymentVerification: PaymentVerificationEvidence | undefined = v && payment ? { paymentId:payment.paymentId, transactionReference:payment.transactionReference, verifiedBy:v.verified_by, verifiedAt:iso(v.verified_at), clearedAmountMinorUnits:Number(v.cleared_amount_minor_units), currency:v.currency, source:v.source, sourceReference:v.source_reference } : undefined;

  const eventsResult = await client.query<{id:string;entity_type:CommercialWorkflowEvent["entityType"];entity_public_id:string;previous_state:string;next_state:string;actor:string;occurred_at:unknown;reason:string|null}>(
    `select id::text,entity_type,entity_public_id,previous_state,next_state,actor,occurred_at,reason from mms_commercial.commercial_workflow_events
      where entity_public_id in ($1,coalesce($2,''),coalesce($3,'')) order by occurred_at,created_at`, [applicationId,payment?.paymentId||null,membership?.membershipId||null]);
  const events: CommercialWorkflowEvent[] = eventsResult.rows.map(e => ({ eventId:e.id, entityType:e.entity_type, entityId:e.entity_public_id, previousState:e.previous_state, nextState:e.next_state, actor:e.actor, occurredAt:iso(e.occurred_at), reason:e.reason||undefined }));
  const activationEvent = membership ? [...events].reverse().find(e => e.entityType==="Membership" && e.entityId===membership.membershipId && e.nextState==="Active") : undefined;
  const membershipActivation: MembershipActivationEvidence | undefined = membership && payment && activationEvent && payment.clearedAt ? { membershipId:membership.membershipId, applicationId, paymentId:payment.paymentId, activatedBy:activationEvent.actor, activatedAt:activationEvent.occurredAt, financeVerifiedAt:payment.clearedAt } : undefined;
  return { application, payment, membership, paymentVerification, membershipActivation, events };
}

export function postgresPartnerCommerceStore(client: MmsCommercialDatabaseClient): PartnerCommerceStore {
  return {
    async createApplication(application) {
      try {
        await client.query(`insert into mms_commercial.applications(public_application_id,lead_id,partner_id,membership_code,stage,submitted_at,approved_at,activated_at)
          select $1,l.id,p.id,$4,$5,$6,$7,$8 from mms_commercial.leads l join mms_commercial.partners p on upper(p.partner_code)=upper($3) where l.public_lead_id=$2`,
          [application.applicationId,application.leadId,application.partnerId,application.membershipCode,application.stage,application.submittedAt||null,application.approvedAt||null,application.activatedAt||null]);
        const record=await loadRecord(client,application.applicationId); return record?{status:"ok",value:record}:{status:"conflict",reason:"Application could not be reloaded."};
      } catch(error){ return failure(error); }
    },
    async submitPartnerApplication(params) {
      try {
        const partnerId = normalisePartnerId(params.partnerId);
        if (!partnerId) return { status: "conflict", reason: "A valid permanent MMS Partner ID is required." };
        const keyHash = createHash("sha256").update(params.idempotencyKey, "utf8").digest("hex");
        const result = await client.query<{ public_application_id: string; replayed: boolean }>(
          "select public_application_id,replayed from mms_commercial.submit_partner_application($1,$2,$3,$4,$5)",
          [keyHash, partnerId, params.leadId, params.membershipCode, params.submittedAt],
        );
        const row = result.rows[0];
        if (!row) return { status: "conflict", reason: "Application submission did not return a durable application ID." };
        const record = await loadRecord(client, row.public_application_id);
        if (!record || normalisePartnerId(record.application.partnerId) !== partnerId) {
          return { status: "conflict", reason: "Submitted application could not be reloaded within Partner scope." };
        }
        return { status: "ok", value: { record, replayed: Boolean(row.replayed) } };
      } catch (error) {
        return failure(error);
      }
    },
    async getApplication(applicationId){ try{return {status:"ok",value:await loadRecord(client,applicationId)}}catch(error){return failure(error)} },
    async listApplicationsByPartner(partnerIdValue) {
      try {
        const partnerId = normalisePartnerId(partnerIdValue);
        if (!partnerId) return { status: "conflict", reason: "A valid permanent MMS Partner ID is required." };
        const ids = await client.query<{ public_application_id: string }>(
          `select a.public_application_id
             from mms_commercial.applications a
             join mms_commercial.partners p on p.id = a.partner_id
            where upper(p.partner_code) = upper($1)
            order by coalesce(a.activated_at,a.approved_at,a.submitted_at,a.created_at) desc, a.created_at desc`,
          [partnerId],
        );
        const records: PartnerCommerceRecord[] = [];
        for (const row of ids.rows) {
          const record = await loadRecord(client, row.public_application_id);
          if (record && normalisePartnerId(record.application.partnerId) === partnerId) records.push(record);
        }
        return { status: "ok", value: records };
      } catch (error) {
        return failure(error);
      }
    },
    async savePaymentVerification({application,payment,evidence}) {
      try {
        await client.query("select mms_commercial.finance_verify_payment($1,$2,$3,$4,$5,$6,$7,$8)",[application.applicationId,payment.paymentId,evidence.verifiedBy,evidence.verifiedAt,evidence.clearedAmountMinorUnits,evidence.currency,evidence.source,evidence.sourceReference]);
        const record=await loadRecord(client,application.applicationId); return record?{status:"ok",value:record}:{status:"conflict",reason:"Verified commerce record could not be reloaded."};
      } catch(error){return failure(error)}
    },
    async saveMembershipActivation({application,membership,evidence}) {
      try {
        await client.query("select mms_commercial.activate_membership($1,$2,$3,$4,$5,$6)",[application.applicationId,evidence.paymentId,membership.membershipId,evidence.activatedBy,evidence.activatedAt,evidence.financeVerifiedAt]);
        const record=await loadRecord(client,application.applicationId); return record?{status:"ok",value:record}:{status:"conflict",reason:"Activated commerce record could not be reloaded."};
      } catch(error){return failure(error)}
    },
  };
}
