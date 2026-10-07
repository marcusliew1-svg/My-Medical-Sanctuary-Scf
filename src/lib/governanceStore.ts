import "server-only";

import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable, type MmsCommercialTransaction } from "@/lib/mmsCommercialDatabaseClient";
import { assertGovernanceDocumentTransition } from "@/lib/governanceDocumentWorkflow";

export type GovernanceSummary = {
  documents: number;
  risks: number;
  highOrCriticalResidualRisks: number;
  ineffectiveControls: number;
  untestedControls: number;
  openCapas: number;
  overdueCapas: number;
  activeClinicalServices: number;
  suspendedClinicalServices: number;
  redCapabilities: number;
  amberCapabilities: number;
  liveCapabilities: number;
};

type GovernanceRow = Record<string, unknown>;

function requireDb() {
  if (!mmsCommercialDatabaseClientAvailable()) throw new Error("MMS governance database is unavailable.");
  return mmsCommercialDatabaseClient();
}

function iso(value: unknown): string | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? String(value) : d.toISOString();
}

function mapRow(row: GovernanceRow): GovernanceRow {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value]));
}

export function governanceConsoleEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const explicit = env.MMS_GOVERNANCE_CONSOLE_ENABLED?.trim().toLowerCase();
  if (env.VERCEL_ENV === "production") {
    return explicit === "true" && env.MMS_GOVERNANCE_CONSOLE_PRODUCTION_APPROVED?.trim().toLowerCase() === "true";
  }
  if (explicit === "false") return false;
  return true;
}

export async function governanceSnapshot() {
  const db = requireDb();
  const [summaryResult, documents, risks, controls, capas, services, capabilities, aiUseCases] = await Promise.all([
    db.query<GovernanceRow>(`
      select
        (select count(*) from mms_governance.governance_documents) documents,
        (select count(*) from mms_governance.risks where status <> 'CLOSED') risks,
        (select count(*) from mms_governance.risks where status <> 'CLOSED' and residual_likelihood * residual_impact >= 10) high_or_critical_residual_risks,
        (select count(*) from mms_governance.controls where effectiveness = 'INEFFECTIVE' and status <> 'RETIRED') ineffective_controls,
        (select count(*) from mms_governance.controls where effectiveness = 'NOT_TESTED' and status <> 'RETIRED') untested_controls,
        (select count(*) from mms_governance.capa_actions where status <> 'CLOSED') open_capas,
        (select count(*) from mms_governance.capa_actions where status <> 'CLOSED' and due_at is not null and due_at < now()) overdue_capas,
        (select count(*) from mms_governance.clinical_services where clinical_status = 'ACTIVE') active_clinical_services,
        (select count(*) from mms_governance.clinical_services where clinical_status = 'SUSPENDED') suspended_clinical_services,
        (select count(*) from mms_governance.launch_capabilities where readiness = 'RED') red_capabilities,
        (select count(*) from mms_governance.launch_capabilities where readiness = 'AMBER') amber_capabilities,
        (select count(*) from mms_governance.launch_capabilities where readiness = 'LIVE') live_capabilities
    `),
    db.query<GovernanceRow>(`select document_id,title,domain,owner_role,owner_id,reviewer_id,approver_role,approver_id,approval_reference,version,status,confidentiality,review_requested_at,approved_at,effective_at,review_due_at,evidence_location from mms_governance.governance_documents order by document_id limit 100`),
    db.query<GovernanceRow>(`select risk_id,domain,title,owner_role,inherent_likelihood,inherent_impact,residual_likelihood,residual_impact,response,status,action_summary,action_due_at,review_due_at from mms_governance.risks order by residual_likelihood * residual_impact desc, risk_id limit 100`),
    db.query<GovernanceRow>(`select control_id,domain,name,control_type,owner_role,frequency,automation_level,system_name,effectiveness,status,last_tested_at,next_test_due_at from mms_governance.controls order by case effectiveness when 'INEFFECTIVE' then 1 when 'NEEDS_IMPROVEMENT' then 2 when 'NOT_TESTED' then 3 else 4 end, control_id limit 150`),
    db.query<GovernanceRow>(`select capa_id,source_type,source_reference,finding,severity,owner_role,action,status,due_at,implemented_at,verified_by_role,closed_at from mms_governance.capa_actions order by case status when 'OPEN' then 1 when 'IN_PROGRESS' then 2 when 'IMPLEMENTED' then 3 when 'EFFECTIVENESS_REVIEW' then 4 else 5 end, due_at nulls last limit 100`),
    db.query<GovernanceRow>(`select service_id,service_name,category,jurisdiction,risk_tier,responsible_medical_director_role,clinical_status,public_exposure_status,booking_enabled,crm_enabled,partner_enabled,ling_enabled,protocol_reference,consent_document_reference,approval_reference,review_due_at from mms_governance.clinical_services order by service_id limit 100`),
    db.query<GovernanceRow>(`select capability_key,capability_name,owner_role,readiness,production_gate_enabled,approval_reference,blocker_summary,rollback_reference,monitoring_reference,last_verified_at,review_due_at from mms_governance.launch_capabilities order by case readiness when 'RED' then 1 when 'AMBER' then 2 when 'GREEN' then 3 when 'LIVE' then 4 else 5 end, capability_key`),
    db.query<GovernanceRow>(`select use_case_id,name,domain,intended_use,data_classification,human_review_required,status,clinical_governance_required,privacy_review_required,approval_reference,review_due_at from mms_governance.ai_use_cases order by use_case_id`),
  ]);

  const s = summaryResult.rows[0] || {};
  const summary: GovernanceSummary = {
    documents: Number(s.documents || 0),
    risks: Number(s.risks || 0),
    highOrCriticalResidualRisks: Number(s.high_or_critical_residual_risks || 0),
    ineffectiveControls: Number(s.ineffective_controls || 0),
    untestedControls: Number(s.untested_controls || 0),
    openCapas: Number(s.open_capas || 0),
    overdueCapas: Number(s.overdue_capas || 0),
    activeClinicalServices: Number(s.active_clinical_services || 0),
    suspendedClinicalServices: Number(s.suspended_clinical_services || 0),
    redCapabilities: Number(s.red_capabilities || 0),
    amberCapabilities: Number(s.amber_capabilities || 0),
    liveCapabilities: Number(s.live_capabilities || 0),
  };

  return {
    summary,
    documents: documents.rows.map(mapRow),
    risks: risks.rows.map(mapRow),
    controls: controls.rows.map(mapRow),
    capas: capas.rows.map(mapRow),
    services: services.rows.map(mapRow),
    capabilities: capabilities.rows.map(mapRow),
    aiUseCases: aiUseCases.rows.map(mapRow),
  };
}

async function audit(tx: MmsCommercialTransaction, input: {
  entityType: string;
  entityId: string;
  action: string;
  actorId: string;
  actorRole: string;
  reason?: string;
  previousState?: GovernanceRow;
  newState?: GovernanceRow;
}) {
  await tx.query(
    `insert into mms_governance.governance_audit_events
      (entity_type,entity_id,action,actor_id,actor_role,reason,previous_state,new_state,occurred_at)
     values ($1,$2::uuid,$3,$4,$5,$6,$7::jsonb,$8::jsonb,now())`,
    [
      input.entityType,
      input.entityId,
      input.action,
      input.actorId,
      input.actorRole,
      input.reason || null,
      input.previousState ? JSON.stringify(input.previousState) : null,
      input.newState ? JSON.stringify(input.newState) : null,
    ],
  );
}

async function loadByPublicKey(tx: MmsCommercialTransaction, table: string, keyColumn: string, keyValue: string) {
  const allowed = new Set([
    "risks:risk_id",
    "controls:control_id",
    "capa_actions:capa_id",
    "clinical_services:service_id",
    "launch_capabilities:capability_key",
    "governance_documents:document_id",
  ]);
  if (!allowed.has(`${table}:${keyColumn}`)) throw new Error("Unsupported governance entity.");
  const result = await tx.query<GovernanceRow>(`select * from mms_governance.${table} where ${keyColumn} = $1 for update`, [keyValue]);
  return result.rows[0] || null;
}

function textOrNull(value: unknown, max = 4000): string | null {
  if (value == null || value === "") return null;
  const text = String(value).trim();
  if (!text || text.length > max) throw new Error("Governance text value is invalid.");
  return text;
}

function timestampOrNull(value: unknown): string | null {
  const text = textOrNull(value, 100);
  if (!text) return null;
  if (Number.isNaN(Date.parse(text))) throw new Error("Governance timestamp is invalid.");
  return new Date(text).toISOString();
}

export type GovernanceMutation =
  | { type: "risk"; key: string; status?: string; actionSummary?: string | null; actionDueAt?: string | null; reviewDueAt?: string | null; reason: string }
  | { type: "control"; key: string; effectiveness?: string; status?: string; nextTestDueAt?: string | null; reason: string }
  | { type: "capa_create"; key: string; sourceType: string; sourceReference: string; finding: string; severity: string; ownerRole: string; action: string; dueAt?: string | null; reason: string }
  | { type: "capa"; key: string; status: string; effectivenessEvidence?: string | null; verifiedByRole?: string | null; reason: string }
  | { type: "capability"; key: string; readiness?: string; blockerSummary?: string | null; approvalReference?: string | null; reviewDueAt?: string | null; reason: string }
  | { type: "document"; key: string; status?: string; ownerId?: string | null; reviewerId?: string | null; approverRole?: string | null; approverId?: string | null; approvalReference?: string | null; reviewDueAt?: string | null; reason: string }
  | { type: "service"; key: string; clinicalStatus?: string; publicExposureStatus?: string; reviewDueAt?: string | null; reason: string };

export async function mutateGovernance(input: GovernanceMutation, actor: { operatorId: string; roles: string[] }) {
  const db = requireDb();
  const actorRole = actor.roles.join(",") || "operator";
  return db.transaction(async (tx) => {
    if (input.type === "capa_create") {
      const allowedSource = new Set(["INCIDENT","AUDIT","COMPLAINT","CONTROL_TEST","RISK_REVIEW","SUPPLIER","OTHER"]);
      const allowedSeverity = new Set(["CRITICAL","MAJOR","MODERATE","MINOR","OBSERVATION"]);
      if (!/^CAPA-[A-Z0-9_-]{3,80}$/.test(input.key)) throw new Error("CAPA ID is invalid.");
      if (!allowedSource.has(input.sourceType) || !allowedSeverity.has(input.severity)) throw new Error("CAPA classification is invalid.");
      const created = await tx.query<GovernanceRow>(
        `insert into mms_governance.capa_actions
          (capa_id,source_type,source_reference,finding,severity,owner_role,action,status,due_at)
         values ($1,$2,$3,$4,$5,$6,$7,'OPEN',$8)
         returning *`,
        [input.key,input.sourceType,textOrNull(input.sourceReference,300),textOrNull(input.finding),input.severity,textOrNull(input.ownerRole,160),textOrNull(input.action),timestampOrNull(input.dueAt)],
      );
      const row = created.rows[0]!;
      await audit(tx,{entityType:"capa_actions",entityId:String(row.id),action:"CREATE",actorId:actor.operatorId,actorRole,reason:input.reason,newState:row});
      return mapRow(row);
    }

    const specs = {
      risk: ["risks","risk_id"],
      control: ["controls","control_id"],
      capa: ["capa_actions","capa_id"],
      capability: ["launch_capabilities","capability_key"],
      document: ["governance_documents","document_id"],
      service: ["clinical_services","service_id"],
    } as const;
    const [table,keyColumn] = specs[input.type];
    const previous = await loadByPublicKey(tx,table,keyColumn,input.key);
    if (!previous) throw new Error("Governance record was not found.");

    let result;
    if (input.type === "risk") {
      const statuses = new Set(["OPEN","MITIGATING","ACCEPTED","CLOSED"]);
      if (input.status && !statuses.has(input.status)) throw new Error("Risk status is invalid.");
      result = await tx.query<GovernanceRow>(
        `update mms_governance.risks set
          status=coalesce($2,status),
          action_summary=case when $3::boolean then $4 else action_summary end,
          action_due_at=case when $5::boolean then $6::timestamptz else action_due_at end,
          review_due_at=case when $7::boolean then $8::timestamptz else review_due_at end
         where risk_id=$1 returning *`,
        [input.key,input.status || null,Object.hasOwn(input,"actionSummary"),textOrNull(input.actionSummary),Object.hasOwn(input,"actionDueAt"),timestampOrNull(input.actionDueAt),Object.hasOwn(input,"reviewDueAt"),timestampOrNull(input.reviewDueAt)],
      );
    } else if (input.type === "control") {
      const effectiveness = new Set(["EFFECTIVE","NEEDS_IMPROVEMENT","INEFFECTIVE","NOT_TESTED"]);
      const statuses = new Set(["ACTIVE","WEAK","SUSPENDED","RETIRED"]);
      if (input.effectiveness && !effectiveness.has(input.effectiveness)) throw new Error("Control effectiveness is invalid.");
      if (input.status && !statuses.has(input.status)) throw new Error("Control status is invalid.");
      result = await tx.query<GovernanceRow>(
        `update mms_governance.controls set
          effectiveness=coalesce($2,effectiveness),
          status=coalesce($3,status),
          last_tested_at=case when $2::text is null then last_tested_at else now() end,
          next_test_due_at=case when $4::boolean then $5::timestamptz else next_test_due_at end
         where control_id=$1 returning *`,
        [input.key,input.effectiveness || null,input.status || null,Object.hasOwn(input,"nextTestDueAt"),timestampOrNull(input.nextTestDueAt)],
      );
    } else if (input.type === "capa") {
      const statuses = new Set(["OPEN","IN_PROGRESS","IMPLEMENTED","EFFECTIVENESS_REVIEW","CLOSED"]);
      if (!statuses.has(input.status)) throw new Error("CAPA status is invalid.");
      if (input.status === "CLOSED" && !textOrNull(input.effectivenessEvidence)) throw new Error("CAPA cannot close without effectiveness evidence.");
      result = await tx.query<GovernanceRow>(
        `update mms_governance.capa_actions set
          status=$2,
          implemented_at=case when $2 in ('IMPLEMENTED','EFFECTIVENESS_REVIEW','CLOSED') and implemented_at is null then now() else implemented_at end,
          effectiveness_evidence=case when $3::boolean then $4 else effectiveness_evidence end,
          verified_by_role=case when $5::boolean then $6 else verified_by_role end,
          closed_at=case when $2='CLOSED' then now() else null end
         where capa_id=$1 returning *`,
        [input.key,input.status,Object.hasOwn(input,"effectivenessEvidence"),textOrNull(input.effectivenessEvidence),Object.hasOwn(input,"verifiedByRole"),textOrNull(input.verifiedByRole,160)],
      );
    } else if (input.type === "capability") {
      const readiness = new Set(["RED","AMBER","GREEN","LIVE","SUSPENDED"]);
      if (input.readiness && !readiness.has(input.readiness)) throw new Error("Capability readiness is invalid.");
      const requestedApproval = Object.hasOwn(input,"approvalReference") ? textOrNull(input.approvalReference,300) : null;
      const effectiveApproval = Object.hasOwn(input,"approvalReference") ? requestedApproval : (previous.approval_reference ? String(previous.approval_reference) : null);
      if (input.readiness === "LIVE" && (!Boolean(previous.production_gate_enabled) || !effectiveApproval)) {
        throw new Error("LIVE requires an already-enabled Production gate and approval reference. This console cannot enable Production gates.");
      }
      result = await tx.query<GovernanceRow>(
        `update mms_governance.launch_capabilities set
          readiness=coalesce($2,readiness),
          blocker_summary=case when $3::boolean then $4 else blocker_summary end,
          approval_reference=case when $5::boolean then $6 else approval_reference end,
          review_due_at=case when $7::boolean then $8::timestamptz else review_due_at end,
          last_verified_at=now()
         where capability_key=$1 returning *`,
        [input.key,input.readiness || null,Object.hasOwn(input,"blockerSummary"),textOrNull(input.blockerSummary),Object.hasOwn(input,"approvalReference"),requestedApproval,Object.hasOwn(input,"reviewDueAt"),timestampOrNull(input.reviewDueAt)],
      );
    } else if (input.type === "document") {
      const ownerId = Object.hasOwn(input,"ownerId") ? textOrNull(input.ownerId,160) : (previous.owner_id ? String(previous.owner_id) : null);
      const reviewerId = Object.hasOwn(input,"reviewerId") ? textOrNull(input.reviewerId,160) : (previous.reviewer_id ? String(previous.reviewer_id) : null);
      const approverRole = Object.hasOwn(input,"approverRole") ? textOrNull(input.approverRole,160) : (previous.approver_role ? String(previous.approver_role) : null);
      const approverId = Object.hasOwn(input,"approverId") ? textOrNull(input.approverId,160) : (previous.approver_id ? String(previous.approver_id) : null);
      const approvalReference = Object.hasOwn(input,"approvalReference") ? textOrNull(input.approvalReference,300) : (previous.approval_reference ? String(previous.approval_reference) : null);

      assertGovernanceDocumentTransition({
        currentStatus: String(previous.status),
        requestedStatus: input.status,
        ownerId,
        reviewerId,
        approverId,
        approverRole,
        approvalReference,
      });

      result = await tx.query<GovernanceRow>(
        `update mms_governance.governance_documents set
          status=coalesce($2,status),
          owner_id=case when $3::boolean then $4 else owner_id end,
          reviewer_id=case when $5::boolean then $6 else reviewer_id end,
          approver_role=case when $7::boolean then $8 else approver_role end,
          approver_id=case when $9::boolean then $10 else approver_id end,
          approval_reference=case when $11::boolean then $12 else approval_reference end,
          review_due_at=case when $13::boolean then $14::timestamptz else review_due_at end,
          review_requested_at=case when $2='REVIEW' and status <> 'REVIEW' then now() else review_requested_at end,
          approved_at=case when $2='APPROVED' and status <> 'APPROVED' then now() else approved_at end,
          effective_at=case when $2='EFFECTIVE' and status <> 'EFFECTIVE' then now() else effective_at end,
          retired_at=case when $2='RETIRED' and status <> 'RETIRED' then now() else retired_at end
         where document_id=$1 returning *`,
        [
          input.key,input.status || null,
          Object.hasOwn(input,"ownerId"),textOrNull(input.ownerId,160),
          Object.hasOwn(input,"reviewerId"),textOrNull(input.reviewerId,160),
          Object.hasOwn(input,"approverRole"),textOrNull(input.approverRole,160),
          Object.hasOwn(input,"approverId"),textOrNull(input.approverId,160),
          Object.hasOwn(input,"approvalReference"),textOrNull(input.approvalReference,300),
          Object.hasOwn(input,"reviewDueAt"),timestampOrNull(input.reviewDueAt),
        ],
      );
    } else {
      const statuses = new Set(["PROPOSED","CLINICAL_REVIEW","REGULATORY_REVIEW","OPERATIONAL_REVIEW","APPROVED","SUSPENDED","RETIRED"]);
      const publicStatuses = new Set(["HIDDEN","INTERNAL_ONLY","PLANNED_PUBLIC","REFERRAL_ONLY"]);
      if (input.clinicalStatus === "ACTIVE" || input.publicExposureStatus === "PUBLIC_AVAILABLE") {
        throw new Error("Clinical activation/public availability requires the separate Medical Director and regulatory activation workflow.");
      }
      if (input.clinicalStatus && !statuses.has(input.clinicalStatus)) throw new Error("Clinical service status is invalid for this console.");
      if (input.publicExposureStatus && !publicStatuses.has(input.publicExposureStatus)) throw new Error("Public exposure status is invalid for this console.");
      result = await tx.query<GovernanceRow>(
        `update mms_governance.clinical_services set
          clinical_status=coalesce($2,clinical_status),
          public_exposure_status=coalesce($3,public_exposure_status),
          review_due_at=case when $4::boolean then $5::timestamptz else review_due_at end
         where service_id=$1 returning *`,
        [input.key,input.clinicalStatus || null,input.publicExposureStatus || null,Object.hasOwn(input,"reviewDueAt"),timestampOrNull(input.reviewDueAt)],
      );
    }

    const next = result.rows[0]!;
    await audit(tx,{entityType:table,entityId:String(next.id),action:"UPDATE",actorId:actor.operatorId,actorRole,reason:input.reason,previousState:previous,newState:next});
    return mapRow(next);
  });
}
