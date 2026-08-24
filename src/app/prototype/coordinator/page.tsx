import { Card, RoleQueue, PrototypeShell } from "../components";
import { PrototypeHandoffBoard } from "../handoff-board";

export default function CoordinatorPage() {
  return (
    <PrototypeShell title="Care Coordinator Priorities" eyebrow="Role-Limited View">
      <Card className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Access Rule</p>
        <p className="mt-3 leading-7 text-warm-gray">
          Care Coordinator sees clinician-approved care priorities and coordination tasks only,
          not full clinical notes.
        </p>
      </Card>
      <RoleQueue role="Care Coordinator" />
      <div className="mt-6">
        <PrototypeHandoffBoard filterTo="Care Coordinator" />
      </div>
    </PrototypeShell>
  );
}
