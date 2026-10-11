import CommissionQueueClient from "@/components/operations/CommissionQueueClient";

export default function CommissionsPage() {
  return <div className="space-y-6"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Finance</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Commission Control Centre</h1><p className="mt-2 max-w-3xl text-sm text-slate-600">Review eligible, held, approved, paid and reversed commission transactions. Commercial rates and approved amounts remain server-derived.</p></div><CommissionQueueClient /></div>;
}
