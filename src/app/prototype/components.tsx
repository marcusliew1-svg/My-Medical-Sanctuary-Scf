import Link from "next/link";
import type { ReactNode } from "react";
import {
  commercialOpportunities,
  hierarchy,
  prototypePeople,
  workflowTemplates,
  type PrototypePerson,
  type Role,
} from "./data";

export const prototypeNav = [
  ["Overview", "/prototype"],
  ["Dashboard", "/prototype/dashboard"],
  ["Patients", "/prototype/patients"],
  ["Reception", "/prototype/reception"],
  ["Intake", "/prototype/intake"],
  ["Nurse", "/prototype/nurse"],
  ["Doctor", "/prototype/doctor"],
  ["Coordinator", "/prototype/coordinator"],
  ["Treatment", "/prototype/treatment"],
  ["Discharge", "/prototype/discharge"],
] as const;

export function PrototypeShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f6f4ef] px-4 pb-16 pt-28 text-charcoal">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-lg border border-gold-light/60 bg-navy p-6 text-ivory shadow-premium">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">
            {eyebrow ?? "MMS Synthetic Prototype"}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-ivory/72">
            Frontend-only mock workflow. Synthetic data, local state, no backend, no EMR, no Zoho,
            no uploads, no payments and no production AI.
          </p>
        </div>
        <nav className="mb-8 flex gap-2 overflow-x-auto rounded-lg border border-gold-light/50 bg-white/[0.92] p-2 shadow-soft">
          {prototypeNav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-navy transition hover:bg-ivory"
            >
              {label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </main>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-gold-light/45 bg-white/[0.94] p-6 shadow-soft ${className}`}>
      {children}
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className="rounded-full border border-gold-light bg-ivory px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-navy">
      {status}
    </span>
  );
}

export function HierarchyRail({ person }: { person?: PrototypePerson }) {
  const values = person
    ? [
        person.enquiry.id,
        person.id,
        person.journey.id,
        person.episode?.id ?? "No episode",
        person.appointment.id,
        person.encounter.id,
      ]
    : hierarchy.map(() => "Synthetic object");

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Approved Hierarchy</p>
      <div className="mt-5 grid gap-3 md:grid-cols-6">
        {hierarchy.map((item, index) => (
          <div key={item} className="rounded-lg border border-gold-light/40 bg-ivory p-4">
            <p className="text-xs font-bold text-gold">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 font-serif text-xl text-navy">{item}</h2>
            <p className="mt-2 break-words text-xs text-warm-gray">{values[index]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PersonTable({ people = prototypePeople }: { people?: PrototypePerson[] }) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.14em] text-warm-gray">
              <th className="px-3 py-2">Person</th>
              <th className="px-3 py-2">Enquiry</th>
              <th className="px-3 py-2">Journey</th>
              <th className="px-3 py-2">Appointment</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="bg-ivory align-top">
                <td className="rounded-l-lg px-3 py-4">
                  <Link href={`/prototype/patients/${person.id}`} className="font-semibold text-navy hover:text-gold">
                    {person.name}
                  </Link>
                  <p className="text-xs text-warm-gray">{person.countryCity}</p>
                </td>
                <td className="px-3 py-4">{person.enquiry.interest}</td>
                <td className="px-3 py-4">{person.journey.label}</td>
                <td className="px-3 py-4">
                  {person.appointment.date} {person.appointment.time}
                </td>
                <td className="rounded-r-lg px-3 py-4">
                  <StatusPill status={person.journey.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function WorkflowTemplates() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {Object.entries(workflowTemplates).map(([id, template]) => (
        <Card key={id}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Template</p>
          <h2 className="mt-3 font-serif text-2xl text-navy">{template.name}</h2>
          <p className="mt-3 text-sm leading-6 text-warm-gray">{template.summary}</p>
          <p className="mt-4 text-xs font-semibold text-warm-gray">{template.handoffs.length} local handoffs</p>
        </Card>
      ))}
    </div>
  );
}

export function HandoffList({ templateId }: { templateId: PrototypePerson["journey"]["templateId"] }) {
  const template = workflowTemplates[templateId];

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Local Handoffs</p>
      <h2 className="mt-3 font-serif text-3xl text-navy">{template.name}</h2>
      <div className="mt-5 grid gap-3">
        {template.handoffs.map((handoff) => (
          <div key={`${handoff.from}-${handoff.to}`} className="rounded-lg border border-gold-light/40 bg-ivory p-4">
            <p className="text-sm font-semibold text-navy">
              {handoff.from} → {handoff.to}
            </p>
            <p className="mt-2 text-sm leading-6 text-warm-gray">{handoff.payload}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RoleQueue({ role }: { role: Role }) {
  const rows = prototypePeople.map((person) => {
    const detail =
      role === "Care Coordinator"
        ? person.encounter.clinicianApprovedPriorities.join(" ")
        : role === "Nurse"
          ? person.encounter.nurseTasks.join(" ")
          : role === "Treatment"
            ? person.encounter.treatmentTasks.join(" ")
            : role === "Discharge"
              ? person.encounter.dischargeTasks.join(" ")
              : role === "Doctor"
                ? `${person.encounter.privateClinicalNote} Clinician priorities: ${person.encounter.clinicianApprovedPriorities.join(" ")}`
                : `${person.enquiry.interest} - ${person.appointment.type}`;

    return { person, detail };
  });

  return (
    <div className="grid gap-4">
      {rows.map(({ person, detail }) => (
        <Card key={person.id}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{role} View</p>
              <h2 className="mt-2 font-serif text-3xl text-navy">{person.name}</h2>
              <p className="mt-2 text-sm text-warm-gray">{person.journey.label}</p>
            </div>
            <StatusPill status={person.encounter.status} />
          </div>
          <p className="mt-5 rounded-lg border border-gold-light/40 bg-ivory p-4 text-sm leading-6 text-warm-gray">
            {detail}
          </p>
          <Link href={`/prototype/patients/${person.id}`} className="mt-5 inline-flex text-sm font-semibold text-navy hover:text-gold">
            Open synthetic record
          </Link>
        </Card>
      ))}
    </div>
  );
}

export function CommercialOpportunityPanel({ personId }: { personId?: string }) {
  const opportunities = commercialOpportunities.filter((item) => !personId || item.personId === personId);

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">CommercialOpportunity</p>
      <h2 className="mt-3 font-serif text-3xl text-navy">Separate from care journey</h2>
      <div className="mt-5 grid gap-3">
        {opportunities.length > 0 ? (
          opportunities.map((item) => (
            <div key={item.id} className="rounded-lg border border-gold-light/40 bg-ivory p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-navy">{item.label}</p>
                <StatusPill status={item.stage} />
              </div>
              <p className="mt-2 text-sm leading-6 text-warm-gray">{item.note}</p>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-warm-gray">No commercial opportunity for this synthetic person.</p>
        )}
      </div>
    </Card>
  );
}
