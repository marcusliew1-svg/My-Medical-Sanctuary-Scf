import { RoleQueue, PrototypeShell } from "../components";
import { PrototypeHandoffBoard } from "../handoff-board";

export default function NursePage() {
  return (
    <PrototypeShell title="Nurse Worklist" eyebrow="Role-Limited View">
      <RoleQueue role="Nurse" />
      <div className="mt-6">
        <PrototypeHandoffBoard filterTo="Nurse" />
      </div>
    </PrototypeShell>
  );
}
