import { Card, RoleQueue, PrototypeShell } from "../components";
import { PrototypeHandoffBoard } from "../handoff-board";

export default function TreatmentPage() {
  return (
    <PrototypeShell title="Treatment Room" eyebrow="Role-Limited View">
      <Card className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Access Rule</p>
        <p className="mt-3 leading-7 text-warm-gray">
          Treatment view exposes treatment-room tasks only. It does not show full clinical notes,
          commercial opportunities or unrelated journey details.
        </p>
      </Card>
      <RoleQueue role="Treatment" />
      <div className="mt-6">
        <PrototypeHandoffBoard filterTo="Treatment" />
      </div>
    </PrototypeShell>
  );
}
