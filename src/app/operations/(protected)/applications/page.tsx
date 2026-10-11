import OperationsQueueClient from "@/components/operations/OperationsQueueClient";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Applications</h1><p className="mt-2 text-sm text-slate-600">Review queue and commercial state visibility. Mutations remain behind the operator security controls.</p></div>
      <OperationsQueueClient kind="applications" initialFilter={params?.stage || ""} />
    </div>
  );
}
