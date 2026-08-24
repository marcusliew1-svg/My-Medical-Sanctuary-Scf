import { RoleQueue, PrototypeShell } from "../components";

export default function IntakePage() {
  return (
    <PrototypeShell title="Intake Queue" eyebrow="Role View">
      <RoleQueue role="Intake" />
    </PrototypeShell>
  );
}
