import OperationsQueueClient from "@/components/operations/OperationsQueueClient";

export default function ApplicationsPage({ searchParams }: { searchParams?: { stage?: string } }) {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Applications</h1><p className="mt-2 text-sm text-slate-600">Review queue and commercial state visibility. Mutations remain behind the PR #22 operator controls.</p></div>
      <OperationsQueueClient kind="applications" initialFilter={searchParams?.stage || ""} />
    </div>
  );
}
