import OperationsQueueClient from "@/components/operations/OperationsQueueClient";

export default async function FinancePage({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Finance</h1><p className="mt-2 text-sm text-slate-600">Payment verification queue. Finance evidence is restricted to Finance, Admin and Auditor sessions.</p></div>
      <OperationsQueueClient kind="finance" initialFilter={params?.stage || ""} />
    </div>
  );
}
