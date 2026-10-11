import CrmPilotClient from "@/components/operations/CrmPilotClient";

export default function CrmPilotPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Synthetic Preview pilot</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Clinic Manager CRM + AI</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">Administrative enquiries only. No clinical notes, medical decisions, treatment suitability or real patient data are permitted.</p>
      </div>
      <CrmPilotClient />
    </div>
  );
}
