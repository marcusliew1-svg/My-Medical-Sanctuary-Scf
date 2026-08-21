import Link from "next/link";
import CommissionDetailClient from "@/components/operations/CommissionDetailClient";

export default function CommissionDetailPage({ params }: { params: { transactionId: string } }) {
  return <div className="space-y-6"><div><Link href="/operations/commissions" className="text-sm font-semibold text-slate-600 hover:text-slate-950">← Commission Control Centre</Link><h1 className="mt-3 text-3xl font-semibold tracking-tight">Commission transaction</h1><p className="mt-2 font-mono text-sm text-slate-600">{params.transactionId}</p></div><CommissionDetailClient transactionId={params.transactionId} /></div>;
}
