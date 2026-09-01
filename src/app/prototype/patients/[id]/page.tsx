import { notFound } from "next/navigation";
import {
  Card,
  CommercialOpportunityPanel,
  HandoffList,
  HierarchyRail,
  PrototypeShell,
  StatusPill,
} from "../../components";
import { getPerson } from "../../data";

type PatientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params;
  const person = getPerson(id);

  if (!person) {
    notFound();
  }

  return (
    <PrototypeShell title={person.name} eyebrow="Synthetic Person Record">
      <HierarchyRail person={person} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Person</p>
              <h2 className="mt-3 font-serif text-3xl text-navy">{person.preferredName}</h2>
              <p className="mt-3 leading-7 text-warm-gray">
                {person.age} · {person.countryCity} · {person.preferredLanguage}
              </p>
            </div>
            <StatusPill status={person.journey.status} />
          </div>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="rounded-lg bg-ivory p-4">
              <dt className="font-semibold text-navy">Enquiry</dt>
              <dd className="mt-1 text-warm-gray">{person.enquiry.interest}</dd>
            </div>
            <div className="rounded-lg bg-ivory p-4">
              <dt className="font-semibold text-navy">Appointment</dt>
              <dd className="mt-1 text-warm-gray">
                {person.appointment.date} at {person.appointment.time} · {person.appointment.location}
              </dd>
            </div>
            <div className="rounded-lg bg-ivory p-4">
              <dt className="font-semibold text-navy">Optional Episode</dt>
              <dd className="mt-1 text-warm-gray">
                {person.episode ? `${person.episode.label}: ${person.episode.reason}` : "No episode opened"}
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Doctor View</p>
          <h2 className="mt-3 font-serif text-3xl text-navy">Encounter</h2>
          <p className="mt-4 rounded-lg border border-gold-light/40 bg-ivory p-4 text-sm leading-6 text-warm-gray">
            {person.encounter.privateClinicalNote}
          </p>
          <div className="mt-4 grid gap-2">
            {person.encounter.clinicianApprovedPriorities.map((priority) => (
              <p key={priority} className="rounded-lg bg-ivory p-3 text-sm text-warm-gray">
                {priority}
              </p>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <HandoffList templateId={person.journey.templateId} />
        <CommercialOpportunityPanel personId={person.id} />
      </div>
    </PrototypeShell>
  );
}
