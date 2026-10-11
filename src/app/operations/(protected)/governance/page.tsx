import GovernanceConsoleClient from "@/components/operations/GovernanceConsoleClient";

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Internal governance</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">MMS Governance Console</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">Master risks, controls, CAPA, clinical-service governance, launch readiness, documents and AI use cases. This surface does not itself authorize Production activation or clinical care.</p>
      </div>
      <GovernanceConsoleClient />
    </div>
  );
}
