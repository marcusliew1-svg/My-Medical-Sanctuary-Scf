import OperationsDashboardClient from "@/components/operations/OperationsDashboardClient";

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Operational queues</h1><p className="mt-2 text-sm text-slate-600">Commercial workflow only. Clinical and patient data are not part of this console.</p></div>
      <OperationsDashboardClient />
    </div>
  );
}
