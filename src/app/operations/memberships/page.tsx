import OperationsQueueClient from "@/components/operations/OperationsQueueClient";

export default function MembershipsPage({ searchParams }: { searchParams?: { status?: string } }) {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Memberships</h1><p className="mt-2 text-sm text-slate-600">Preparation and activation queue derived from persisted commercial and Finance state.</p></div>
      <OperationsQueueClient kind="memberships" initialFilter={searchParams?.status || ""} />
    </div>
  );
}
