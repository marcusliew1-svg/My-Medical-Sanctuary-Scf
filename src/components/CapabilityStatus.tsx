type Status = "available" | "partner" | "pilot" | "development" | "roadmap";

const styles: Record<Status, string> = {
  available: "bg-deep-green text-white",
  partner: "bg-[#dce8e1] text-deep-green",
  pilot: "bg-[#ead8d1] text-[#784b3e]",
  development: "bg-ivory text-warm-gray border border-stone-200",
  roadmap: "bg-navy text-ivory",
};

const labels: Record<Status, string> = {
  available: "Available now",
  partner: "Partner-supported",
  pilot: "Pilot stage",
  development: "In development",
  roadmap: "Future roadmap",
};

export function CapabilityStatus({ status }: { status: Status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[.12em] ${styles[status]}`}>{labels[status]}</span>;
}
