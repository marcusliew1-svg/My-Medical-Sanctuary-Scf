"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Row = Record<string, unknown>;
type Snapshot = {
  summary: {
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
  documents: Row[];
  risks: Row[];
  controls: Row[];
  capas: Row[];
  services: Row[];
  capabilities: Row[];
  aiUseCases: Row[];
};

type Tab = "overview" | "risks" | "controls" | "capa" | "services" | "capabilities" | "documents" | "ai";

const tabs: Array<{ key: Tab; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "risks", label: "Risks" },
  { key: "controls", label: "Controls" },
  { key: "capa", label: "CAPA" },
  { key: "services", label: "Clinical Services" },
  { key: "capabilities", label: "Launch Gates" },
  { key: "documents", label: "Documents" },
  { key: "ai", label: "AI Use Cases" },
];

function stringValue(value: unknown) {
  if (value == null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function dateValue(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function badgeClass(value: string) {
  if (["RED","CRITICAL","INEFFECTIVE","SUSPENDED","REJECTED"].includes(value)) return "bg-red-100 text-red-800";
  if (["AMBER","HIGH","NEEDS_IMPROVEMENT","MITIGATING","REVIEW","WORKING_DRAFT"].includes(value)) return "bg-amber-100 text-amber-800";
  if (["GREEN","ACTIVE","LIVE","EFFECTIVE","APPROVED","EFFECTIVE"].includes(value)) return "bg-emerald-100 text-emerald-800";
  return "bg-slate-100 text-slate-700";
}

function Badge({ value }: { value: unknown }) {
  const text = stringValue(value);
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(text)}`}>{text}</span>;
}

function Card({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      {note ? <div className="mt-2 text-xs text-slate-500">{note}</div> : null}
    </div>
  );
}

function Table({ columns, rows }: { columns: Array<{ key: string; label: string; date?: boolean; badge?: boolean }>; rows: Row[] }) {
  if (!rows.length) return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No records yet.</div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr key={String(row.id || row.risk_id || row.control_id || row.capa_id || row.service_id || row.capability_key || row.document_id || row.use_case_id || index)} className="align-top">
              {columns.map((column) => {
                const value = row[column.key];
                return <td key={column.key} className="whitespace-nowrap px-4 py-3 text-slate-700">{column.badge ? <Badge value={value} /> : column.date ? dateValue(value) : stringValue(value)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GovernanceConsoleClient() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [status, setStatus] = useState("Loading governance state…");
  const [tab, setTab] = useState<Tab>("overview");
  const [actionType, setActionType] = useState<"risk" | "control" | "capability" | "document" | "service">("risk");
  const [actionKey, setActionKey] = useState("");
  const [actionState, setActionState] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [documentOwnerId, setDocumentOwnerId] = useState("");
  const [documentReviewerId, setDocumentReviewerId] = useState("");
  const [documentApproverId, setDocumentApproverId] = useState("");
  const [documentApproverRole, setDocumentApproverRole] = useState("");
  const [documentApprovalReference, setDocumentApprovalReference] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const load = useCallback(async () => {
    setStatus("Loading governance state…");
    try {
      const response = await fetch("/api/operations/governance", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || payload.status !== "ok") throw new Error(payload.message || "Governance data unavailable.");
      setSnapshot(payload.snapshot);
      setStatus("");
    } catch (error) {
      setSnapshot(null);
      setStatus(error instanceof Error ? error.message : "Governance data unavailable.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const riskScoreRows = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.risks.map((risk) => ({
      ...risk,
      residual_score: Number(risk.residual_likelihood || 0) * Number(risk.residual_impact || 0),
    }));
  }, [snapshot]);

  const actionOptions = useMemo(() => {
    if (actionType === "risk") return ["OPEN","MITIGATING","ACCEPTED","CLOSED"];
    if (actionType === "control") return ["EFFECTIVE","NEEDS_IMPROVEMENT","INEFFECTIVE","NOT_TESTED"];
    if (actionType === "capability") return ["RED","AMBER","GREEN","SUSPENDED"];
    if (actionType === "document") return ["WORKING_DRAFT","REVIEW","APPROVED","EFFECTIVE","SUPERSEDED","RETIRED"];
    return ["PROPOSED","CLINICAL_REVIEW","REGULATORY_REVIEW","OPERATIONAL_REVIEW","APPROVED","SUSPENDED","RETIRED"];
  }, [actionType]);

  const recordKeys = useMemo(() => {
    if (!snapshot) return [];
    if (actionType === "risk") return snapshot.risks.map((row) => String(row.risk_id));
    if (actionType === "control") return snapshot.controls.map((row) => String(row.control_id));
    if (actionType === "capability") return snapshot.capabilities.map((row) => String(row.capability_key));
    if (actionType === "document") return snapshot.documents.map((row) => String(row.document_id));
    return snapshot.services.map((row) => String(row.service_id));
  }, [actionType, snapshot]);

  async function submitQuickAction() {
    if (!actionKey || !actionState || !actionReason.trim()) {
      setActionMessage("Select a record and state, and enter a reason.");
      return;
    }
    const body: Record<string, unknown> = { type: actionType, key: actionKey, reason: actionReason.trim() };
    if (actionType === "risk") body.status = actionState;
    if (actionType === "control") body.effectiveness = actionState;
    if (actionType === "capability") body.readiness = actionState;
    if (actionType === "document") {
      body.status = actionState;
      if (documentOwnerId.trim()) body.ownerId = documentOwnerId.trim();
      if (documentReviewerId.trim()) body.reviewerId = documentReviewerId.trim();
      if (documentApproverId.trim()) body.approverId = documentApproverId.trim();
      if (documentApproverRole.trim()) body.approverRole = documentApproverRole.trim();
      if (documentApprovalReference.trim()) body.approvalReference = documentApprovalReference.trim();
    }
    if (actionType === "service") body.clinicalStatus = actionState;

    setActionMessage("Submitting…");
    try {
      const response = await fetch("/api/operations/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok || payload.status !== "ok") throw new Error(payload.message || "Governance update failed.");
      setActionMessage("Recorded with governance audit evidence.");
      setActionReason("");
      if (actionType === "document") {
        setDocumentOwnerId(""); setDocumentReviewerId(""); setDocumentApproverId("");
        setDocumentApproverRole(""); setDocumentApprovalReference("");
      }
      await load();
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Governance update failed.");
    }
  }

  if (!snapshot) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">{status}</div>;
  }

  const s = snapshot.summary;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">MMS Operating System</div>
          <p className="mt-1 text-sm text-slate-600">Governance metadata only. This console does not activate Production gates or authorize clinical care.</p>
        </div>
        <button onClick={() => void load()} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">Refresh</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item.key} onClick={() => setTab(item.key)} className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === item.key ? "bg-slate-950 text-white" : "bg-white text-slate-700 border border-slate-200"}`}>{item.label}</button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Open risks" value={s.risks} />
            <Card label="High / critical residual" value={s.highOrCriticalResidualRisks} />
            <Card label="Ineffective controls" value={s.ineffectiveControls} />
            <Card label="Untested controls" value={s.untestedControls} />
            <Card label="Open CAPAs" value={s.openCapas} />
            <Card label="Overdue CAPAs" value={s.overdueCapas} />
            <Card label="RED capabilities" value={s.redCapabilities} />
            <Card label="AMBER capabilities" value={s.amberCapabilities} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Clinical activation boundary</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div><div className="text-xs uppercase tracking-wide text-slate-500">Active services</div><div className="mt-1 text-2xl font-semibold">{s.activeClinicalServices}</div></div>
              <div><div className="text-xs uppercase tracking-wide text-slate-500">Suspended services</div><div className="mt-1 text-2xl font-semibold">{s.suspendedClinicalServices}</div></div>
              <div><div className="text-xs uppercase tracking-wide text-slate-500">LIVE capabilities</div><div className="mt-1 text-2xl font-semibold">{s.liveCapabilities}</div></div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "risks" ? <Table rows={riskScoreRows} columns={[
        { key: "risk_id", label: "Risk" }, { key: "domain", label: "Domain" }, { key: "title", label: "Title" },
        { key: "owner_role", label: "Owner" }, { key: "residual_score", label: "Residual score" },
        { key: "status", label: "Status", badge: true }, { key: "action_summary", label: "Action" }, { key: "review_due_at", label: "Review due", date: true },
      ]} /> : null}

      {tab === "controls" ? <Table rows={snapshot.controls} columns={[
        { key: "control_id", label: "Control" }, { key: "domain", label: "Domain" }, { key: "name", label: "Name" },
        { key: "control_type", label: "Type" }, { key: "owner_role", label: "Owner" }, { key: "effectiveness", label: "Effectiveness", badge: true },
        { key: "status", label: "Status", badge: true }, { key: "next_test_due_at", label: "Next test", date: true },
      ]} /> : null}

      {tab === "capa" ? <Table rows={snapshot.capas} columns={[
        { key: "capa_id", label: "CAPA" }, { key: "severity", label: "Severity", badge: true }, { key: "finding", label: "Finding" },
        { key: "owner_role", label: "Owner" }, { key: "status", label: "Status", badge: true }, { key: "due_at", label: "Due", date: true },
      ]} /> : null}

      {tab === "services" ? <Table rows={snapshot.services} columns={[
        { key: "service_id", label: "Service" }, { key: "service_name", label: "Name" }, { key: "jurisdiction", label: "Jurisdiction" },
        { key: "risk_tier", label: "Risk tier" }, { key: "clinical_status", label: "Clinical status", badge: true },
        { key: "public_exposure_status", label: "Public exposure", badge: true }, { key: "review_due_at", label: "Review due", date: true },
      ]} /> : null}

      {tab === "capabilities" ? <Table rows={snapshot.capabilities} columns={[
        { key: "capability_name", label: "Capability" }, { key: "owner_role", label: "Owner" }, { key: "readiness", label: "Readiness", badge: true },
        { key: "production_gate_enabled", label: "Prod gate" }, { key: "approval_reference", label: "Approval" },
        { key: "blocker_summary", label: "Blocker" }, { key: "last_verified_at", label: "Verified", date: true },
      ]} /> : null}

      {tab === "documents" ? <Table rows={snapshot.documents} columns={[
        { key: "document_id", label: "Document" }, { key: "title", label: "Title" }, { key: "domain", label: "Domain" },
        { key: "owner_role", label: "Owner role" }, { key: "owner_id", label: "Named owner" }, { key: "reviewer_id", label: "Reviewer" }, { key: "approver_id", label: "Approver" }, { key: "approver_role", label: "Approver role" }, { key: "version", label: "Version" },
        { key: "status", label: "Status", badge: true }, { key: "review_due_at", label: "Review due", date: true },
      ]} /> : null}

      {tab === "ai" ? <Table rows={snapshot.aiUseCases} columns={[
        { key: "use_case_id", label: "Use case" }, { key: "name", label: "Name" }, { key: "domain", label: "Domain" },
        { key: "data_classification", label: "Data class" }, { key: "human_review_required", label: "Human review" },
        { key: "clinical_governance_required", label: "Clinical governance" }, { key: "privacy_review_required", label: "Privacy review" },
        { key: "status", label: "Status", badge: true },
      ]} /> : null}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Controlled quick action</h2>
          <p className="text-sm text-slate-600">Requires a recent operator step-up. Production gate activation and clinical-service activation are deliberately unavailable here.</p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select value={actionType} onChange={(event) => { setActionType(event.target.value as typeof actionType); setActionKey(""); setActionState(""); setActionMessage(""); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="risk">Risk</option>
            <option value="control">Control effectiveness</option>
            <option value="capability">Launch readiness</option>
            <option value="document">Document status</option>
            <option value="service">Clinical service review state</option>
          </select>
          <select value={actionKey} onChange={(event) => setActionKey(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select record</option>
            {recordKeys.map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
          <select value={actionState} onChange={(event) => setActionState(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select new state</option>
            {actionOptions.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <input value={actionReason} onChange={(event) => setActionReason(event.target.value)} placeholder="Reason / evidence reference" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        {actionType === "document" ? (
          <div className="mt-3 grid gap-3 md:grid-cols-5">
            <input value={documentOwnerId} onChange={(event) => setDocumentOwnerId(event.target.value)} placeholder="Named owner ID" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={documentReviewerId} onChange={(event) => setDocumentReviewerId(event.target.value)} placeholder="Named reviewer ID" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={documentApproverId} onChange={(event) => setDocumentApproverId(event.target.value)} placeholder="Named approver ID" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={documentApproverRole} onChange={(event) => setDocumentApproverRole(event.target.value)} placeholder="Approver role" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={documentApprovalReference} onChange={(event) => setDocumentApprovalReference(event.target.value)} placeholder="Approval evidence reference" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={() => void submitQuickAction()} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Record action</button>
          <a href="/operations/step-up" className="text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4">Step-up authentication</a>
          {actionMessage ? <span className="text-sm text-slate-600">{actionMessage}</span> : null}
        </div>
      </div>
    </div>
  );
}
