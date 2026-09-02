import ApplicationDetailClient from "@/components/operations/ApplicationDetailClient";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  return (
    <div className="space-y-6">
      <div><a href="/operations/applications" className="text-sm font-medium text-slate-600 hover:text-slate-950">← Applications</a><h1 className="mt-3 text-2xl font-semibold tracking-tight">Application detail</h1></div>
      <ApplicationDetailClient applicationId={applicationId} />
    </div>
  );
}
