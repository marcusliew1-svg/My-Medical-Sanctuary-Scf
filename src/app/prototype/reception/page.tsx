import { RoleQueue, PrototypeShell } from "../components";

export default function ReceptionPage() {
  return (
    <PrototypeShell title="Reception Queue" eyebrow="Role View">
      <RoleQueue role="Reception" />
    </PrototypeShell>
  );
}
