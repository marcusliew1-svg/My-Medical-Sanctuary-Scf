import { RoleQueue, PrototypeShell } from "../components";

export default function DischargePage() {
  return (
    <PrototypeShell title="Discharge & Follow-Up" eyebrow="Role View">
      <RoleQueue role="Discharge" />
    </PrototypeShell>
  );
}
