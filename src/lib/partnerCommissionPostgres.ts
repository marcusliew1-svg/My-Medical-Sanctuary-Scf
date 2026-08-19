import type { MmsCommercialDatabaseClient } from "@/lib/mmsCommercialDatabaseClient";
import type { CommissionLedgerEvent, CommissionTransaction } from "@/lib/partnerCommissionLedger";
import type { PartnerCommissionRecord, PartnerCommissionStore, PartnerCommissionStoreResult } from "@/lib/partnerCommissionStore";

function iso(value: unknown): string { const d=value instanceof Date?value:new Date(String(value)); if(Number.isNaN(d.getTime())) throw new Error("Invalid database timestamp."); return d.toISOString(); }
function fail<T>(error: unknown): PartnerCommissionStoreResult<T> { const m=error instanceof Error?error.message:"commission_database_error"; if(m.includes("commission_status_conflict")||m.includes("duplicate key")) return {status:"conflict",reason:"Commission transaction state changed or already exists."}; return {status:"unavailable",reason:"MMS commission database operation is unavailable."}; }

async function load(client:MmsCommercialDatabaseClient, transactionId:string):Promise<PartnerCommissionRecord|null>{
  const r=await client.query<any>(`select c.*,p.partner_code,a.public_application_id,pay.public_payment_id,m.public_membership_id
    from mms_commercial.commission_transactions c join mms_commercial.partners p on p.id=c.partner_id
    join mms_commercial.applications a on a.id=c.application_id join mms_commercial.payments pay on pay.id=c.payment_id
    join mms_commercial.memberships m on m.id=c.membership_id where c.public_transaction_id=$1`,[transactionId]);
  const x=r.rows[0]; if(!x) return null;
  const transaction:CommissionTransaction={
    transactionId:x.public_transaction_id,partnerId:x.partner_code,applicationId:x.public_application_id,paymentId:x.public_payment_id,membershipId:x.public_membership_id,
    memberReference:x.member_reference,membershipCode:x.membership_code,paymentTransactionReference:x.payment_transaction_reference,currency:x.currency,
    eligibleRevenueMinorUnits:Number(x.eligible_revenue_minor_units),commissionRuleVersion:x.commission_rule_version,partnerLevelAtEligibility:x.partner_level_at_eligibility,
    commissionRate:Number(x.commission_rate),grossCommissionMinorUnits:Number(x.gross_commission_minor_units),adjustmentMinorUnits:Number(x.adjustment_minor_units),approvedCommissionMinorUnits:Number(x.approved_commission_minor_units),status:x.status,
    eligibility:x.eligibility_checked_at?{checkedBy:x.eligibility_checked_by,checkedAt:iso(x.eligibility_checked_at),partnerId:x.partner_code,partnerLevel:x.partner_level_at_eligibility,attributionVerified:true,paymentCleared:true,membershipActive:true,cancellationClear:true,complianceClear:true,ruleVersion:x.commission_rule_version}:undefined,
    holdReason:x.hold_reason||undefined,approvedBy:x.approved_by||undefined,approvedAt:x.approved_at?iso(x.approved_at):undefined,payoutBatchId:x.payout_batch_id||undefined,paidBy:x.paid_by||undefined,paidAt:x.paid_at?iso(x.paid_at):undefined,payoutReference:x.payout_reference||undefined,reversedAt:x.reversed_at?iso(x.reversed_at):undefined,reversalReason:x.reversal_reason||undefined,clawbackMinorUnits:Number(x.clawback_minor_units||0)
  };
  const e=await client.query<any>(`select id::text,previous_status,next_status,actor,reason,occurred_at from mms_commercial.commission_events where commission_transaction_id=$1 order by occurred_at,created_at`,[x.id]);
  const events:CommissionLedgerEvent[]=e.rows.map((v:any)=>({eventId:v.id,transactionId,previousStatus:v.previous_status,nextStatus:v.next_status,actor:v.actor,occurredAt:iso(v.occurred_at),reason:v.reason}));
  return {transaction,events};
}

export function postgresPartnerCommissionStore(client:MmsCommercialDatabaseClient):PartnerCommissionStore{
  return {
    async create(record){try{
      const t=record.transaction;
      await client.transaction(async tx=>{
        await tx.query(`insert into mms_commercial.commission_transactions(public_transaction_id,partner_id,application_id,payment_id,membership_id,member_reference,membership_code,payment_transaction_reference,currency,eligible_revenue_minor_units,commission_rule_id,commission_rule_version,partner_level_at_eligibility,commission_rate,gross_commission_minor_units,adjustment_minor_units,approved_commission_minor_units,status,eligibility_checked_by,eligibility_checked_at)
          select $1,p.id,a.id,pay.id,m.id,$6,$7,$8,$9,$10,r.id,$11,$12,$13,$14,$15,$16,$17,$18,$19
          from mms_commercial.partners p,mms_commercial.applications a,mms_commercial.payments pay,mms_commercial.memberships m,mms_commercial.commission_rules r
          where upper(p.partner_code)=upper($2) and a.public_application_id=$3 and pay.public_payment_id=$4 and m.public_membership_id=$5 and r.version=$11`,
          [t.transactionId,t.partnerId,t.applicationId,t.paymentId,t.membershipId,t.memberReference,t.membershipCode,t.paymentTransactionReference,t.currency,t.eligibleRevenueMinorUnits,t.commissionRuleVersion,t.partnerLevelAtEligibility,t.commissionRate,t.grossCommissionMinorUnits,t.adjustmentMinorUnits,t.approvedCommissionMinorUnits,t.status,t.eligibility?.checkedBy||null,t.eligibility?.checkedAt||null]);
        for(const ev of record.events) await tx.query(`insert into mms_commercial.commission_events(commission_transaction_id,previous_status,next_status,actor,reason,occurred_at) select id,$2,$3,$4,$5,$6 from mms_commercial.commission_transactions where public_transaction_id=$1`,[t.transactionId,ev.previousStatus,ev.nextStatus,ev.actor,ev.reason,ev.occurredAt]);
      });
      const out=await load(client,t.transactionId); return out?{status:"ok",value:out}:{status:"conflict",reason:"Commission transaction could not be reloaded."};
    }catch(error){return fail(error)}},
    async get(transactionId){try{return {status:"ok",value:await load(client,transactionId)}}catch(error){return fail(error)}},
    async saveTransition({transaction,event}){try{
      await client.query("select mms_commercial.transition_commission($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[
        transaction.transactionId,event.previousStatus,event.nextStatus,event.actor,event.occurredAt,event.reason,
        event.nextStatus==="Approved"?transaction.approvedCommissionMinorUnits:null,event.nextStatus==="Paid"?transaction.payoutBatchId||null:null,event.nextStatus==="Paid"?transaction.payoutReference||null:null,event.nextStatus==="Reversed"?transaction.clawbackMinorUnits||0:null]);
      const out=await load(client,transaction.transactionId); return out?{status:"ok",value:out}:{status:"conflict",reason:"Commission transaction could not be reloaded."};
    }catch(error){return fail(error)}}
  };
}
