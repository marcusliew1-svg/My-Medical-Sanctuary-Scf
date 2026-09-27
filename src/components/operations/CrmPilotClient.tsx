"use client";

import { useCallback, useEffect, useState } from "react";

type QueueItem = {
  crmLeadId: string;
  displayName: string;
  contactChannel: string;
  source: string;
  partnerId?: string;
  assignedOwner: string;
  queueState: string;
  nextAction: string;
  nextActionDue: string;
  enquiryAgeMinutes: number;
  slaStatus: string;
  escalated: boolean;
};

type Snapshot = {
  enquiriesToday: number;
  enquiriesWeek: number;
  enquiriesMonth: number;
  partnerReferrals: number;
  medianResponseMinutes: number | null;
  overdueEnquiries: number;
  consultationRequests: number;
  scheduledConsultations: number;
  conversions: number;
  conversionRate: number;
  crmFailures: number;
  bookingFailures: number;
  emailFailures: number;
  bySource: Record<string, number>;
  byChannel: Record<string, number>;
  byProgrammeInterest: Record<string, number>;
  byLostReason: Record<string, number>;
};

type Brief = { whatChanged: string; requiresAttention: string[]; sourcePerformance: string[]; channelPerformance: string[]; suggestedAdministrativePriorities: string[] };
type ActionKind = "assign" | "contact" | "next_action" | "escalate" | "close";

type NumericMetricKey = "enquiriesToday" | "enquiriesWeek" | "enquiriesMonth" | "partnerReferrals" |
  "medianResponseMinutes" | "overdueEnquiries" | "consultationRequests" | "scheduledConsultations" |
  "conversions" | "conversionRate";

const metricLabels: Array<[NumericMetricKey, string]> = [
  ["enquiriesToday", "Today"], ["enquiriesWeek", "7 days"], ["enquiriesMonth", "30 days"],
  ["partnerReferrals", "Partner referrals"], ["medianResponseMinutes", "Median response (min)"],
  ["overdueEnquiries", "Overdue"], ["consultationRequests", "Consultation requests"],
  ["scheduledConsultations", "Scheduled"], ["conversions", "Conversions"], ["conversionRate", "Conversion %"],
];

function badgeClass(value: string) {
  if (value === "Overdue" || value === "Escalated") return "bg-red-100 text-red-800";
  if (value === "Due Soon") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-700";
}

function Distribution({ title, values }: { title: string; values: Record<string, number> }) {
  const entries = Object.entries(values).sort((left, right) => right[1] - left[1]);
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="text-sm font-semibold">{title}</h3><ul className="mt-3 space-y-2 text-sm">{entries.length ? entries.map(([label, count]) => <li key={label} className="flex justify-between gap-3"><span className="text-slate-600">{label}</span><strong>{count}</strong></li>) : <li className="text-slate-500">No synthetic data</li>}</ul></div>;
}

export default function CrmPilotClient() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [message, setMessage] = useState("Loading Preview CRM pilot…");
  const [selectedId, setSelectedId] = useState("");
  const [actionKind, setActionKind] = useState<ActionKind>("assign");
  const [actionText, setActionText] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [closeStatus, setCloseStatus] = useState("Not Proceeding");
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [assistantMode, setAssistantMode] = useState("summary");
  const [assistantOutput, setAssistantOutput] = useState("");
  const [applyAiAdvisory, setApplyAiAdvisory] = useState(false);

  const load = useCallback(async () => {
    setMessage("Loading Preview CRM pilot…");
    try {
      const [queueResponse, managementResponse] = await Promise.all([
        fetch("/api/operations/crm/queue", { cache: "no-store", credentials: "same-origin" }),
        fetch("/api/operations/crm/management", { cache: "no-store", credentials: "same-origin" }),
      ]);
      const queue = await queueResponse.json() as { status: string; message?: string; items?: QueueItem[] };
      const management = await managementResponse.json() as { status: string; message?: string; snapshot?: Snapshot; brief?: Brief };
      if (!queueResponse.ok || queue.status !== "ok") throw new Error(queue.message || "Queue unavailable.");
      setItems(queue.items || []);
      setSnapshot(management.status === "ok" ? management.snapshot || null : null);
      setBrief(management.status === "ok" ? management.brief || null : null);
      setMessage((queue.items || []).length ? "" : "No synthetic enquiries are in the Preview queue.");
    } catch (error) {
      setItems([]);
      setSnapshot(null);
      setBrief(null);
      setMessage(error instanceof Error ? error.message : "Preview CRM pilot is unavailable.");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  async function submitAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;
    const body: Record<string, string | boolean> = { kind: actionKind, applyAiAdvisory };
    if (actionKind === "assign") body.ownerId = "self";
    if (actionKind === "next_action") {
      const due = new Date(dueAt);
      if (Number.isNaN(due.getTime())) { setMessage("Choose a valid next-action due time."); return; }
      body.nextAction = actionText; body.nextActionDue = due.toISOString();
    }
    if (actionKind === "escalate") body.reason = actionText;
    if (actionKind === "close") { body.reason = actionText; body.status = closeStatus; }
    setMessage("Applying administrative action…");
    const response = await fetch(`/api/operations/crm/queue/${encodeURIComponent(selectedId)}`, {
      method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const result = await response.json() as { message?: string };
    if (!response.ok) { setMessage(result.message || "Action could not be applied."); return; }
    setActionText(""); setDueAt(""); setApplyAiAdvisory(false);
    await load();
  }

  async function requestAdvisory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssistantOutput("Reviewing administrative request…");
    if (!selectedId) { setAssistantOutput("Choose Manage on a synthetic enquiry first."); return; }
    const response = await fetch("/api/operations/crm/assistant", {
      method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: assistantPrompt, enquiryId: selectedId, mode: assistantMode }),
    });
    const result = await response.json() as { message?: string; output?: { text?: string } };
    setAssistantOutput(response.ok ? result.output?.text || "No advisory output." : result.message || "AI advisory unavailable.");
    setApplyAiAdvisory(response.ok);
  }

  return (
    <div className="space-y-6">
      {snapshot ? <section aria-labelledby="management-heading" className="space-y-4">
        <div className="flex items-center justify-between"><h2 id="management-heading" className="text-lg font-semibold">Synthetic management dashboard</h2><button type="button" onClick={() => void load()} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Refresh</button></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{metricLabels.map(([key, label]) => <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div><div className="mt-2 text-2xl font-semibold">{snapshot[key] ?? "—"}</div></div>)}</div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"><Distribution title="Source mix" values={snapshot.bySource} /><Distribution title="Channel mix" values={snapshot.byChannel} /><Distribution title="Programme mix" values={snapshot.byProgrammeInterest} /><Distribution title="Lost reasons" values={snapshot.byLostReason} /></div>
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-red-50 p-3 text-sm"><strong>{snapshot.crmFailures}</strong> CRM failures</div><div className="rounded-xl bg-red-50 p-3 text-sm"><strong>{snapshot.bookingFailures}</strong> booking failures</div><div className="rounded-xl bg-red-50 p-3 text-sm"><strong>{snapshot.emailFailures}</strong> email failures</div></div>
        {brief ? <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><div className="font-semibold">Daily AI brief — advisory, human review required</div><p className="mt-2">{brief.whatChanged}</p><ul className="mt-2 list-disc space-y-1 pl-5">{brief.requiresAttention.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-2"><strong>Source:</strong> {brief.sourcePerformance.join("; ") || "No movement"}</p><p className="mt-1"><strong>Channel:</strong> {brief.channelPerformance.join("; ") || "No movement"}</p></div> : null}
      </section> : null}

      <section aria-labelledby="queue-heading" className="space-y-4">
        <h2 id="queue-heading" className="text-lg font-semibold">Administrative enquiry queue</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr>{["Enquiry", "Source", "Owner", "State", "Next action", "SLA", ""].map((label) => <th key={label || "action"} className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.crmLeadId} className="hover:bg-slate-50">
              <td className="px-4 py-3"><div className="font-semibold">{item.displayName}</div><div className="font-mono text-xs text-slate-500">{item.crmLeadId}</div></td>
              <td className="px-4 py-3">{item.source}{item.partnerId ? <div className="text-xs text-slate-500">{item.partnerId}</div> : null}</td>
              <td className="px-4 py-3">{item.assignedOwner}</td><td className="px-4 py-3">{item.queueState}</td>
              <td className="px-4 py-3"><div>{item.nextAction}</div><div className="text-xs text-slate-500">{new Date(item.nextActionDue).toLocaleString("en-MY")}</div></td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(item.slaStatus)}`}>{item.slaStatus}</span></td>
              <td className="px-4 py-3"><button type="button" onClick={() => setSelectedId(item.crmLeadId)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">Manage</button></td>
            </tr>)}</tbody></table>
          {message ? <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-600" role="status">{message}</div> : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={submitAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Human-approved queue action</h2><p className="text-xs text-slate-500">Selected: {selectedId || "choose Manage from the queue"}</p>
          <label className="block text-sm font-medium">Action<select value={actionKind} onChange={(event) => setActionKind(event.target.value as ActionKind)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="assign">Assign to me</option><option value="contact">Record contact attempt</option><option value="next_action">Set next action</option><option value="escalate">Escalate</option><option value="close">Close</option></select></label>
          {actionKind === "close" ? <label className="block text-sm font-medium">Closure status<select value={closeStatus} onChange={(event) => setCloseStatus(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option>Not Proceeding</option><option>Do Not Contact</option><option>Spam</option><option>Duplicate</option></select></label> : null}
          {["next_action", "escalate", "close"].includes(actionKind) ? <label className="block text-sm font-medium">{actionKind === "next_action" ? "Next administrative action" : "Administrative reason"}<input required value={actionText} onChange={(event) => setActionText(event.target.value)} maxLength={240} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label> : null}
          {actionKind === "next_action" ? <label className="block text-sm font-medium">Due at<input required type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label> : null}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={applyAiAdvisory} onChange={(event) => setApplyAiAdvisory(event.target.checked)} />Record this as based on the current AI advisory (still human-approved)</label>
          <button disabled={!selectedId} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Apply with human approval</button>
        </form>

        <form onSubmit={requestAdvisory} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold">AI operations advisory</h2><p className="text-xs text-slate-500">Advisory only. It cannot change CRM state and refuses clinical work.</p>
          <label className="block text-sm font-medium">Advisory type<select value={assistantMode} onChange={(event) => setAssistantMode(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="summary">Enquiry summary</option><option value="follow_up_draft">Follow-up draft</option><option value="next_action">Next-action suggestion</option><option value="overdue_warning">Overdue warning</option></select></label>
          <label className="block text-sm font-medium">Administrative request<textarea required value={assistantPrompt} onChange={(event) => setAssistantPrompt(event.target.value)} maxLength={500} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <button className="rounded-lg border border-slate-950 px-4 py-2 text-sm font-semibold">Generate advisory</button>
          {assistantOutput ? <div className="rounded-lg bg-slate-100 p-3 text-sm" role="status"><strong>Human review required:</strong> {assistantOutput}</div> : null}
        </form>
      </section>
    </div>
  );
}
