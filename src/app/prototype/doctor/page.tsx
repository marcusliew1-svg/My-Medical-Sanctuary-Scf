import { RoleQueue, PrototypeShell } from "../components";

export default function DoctorPage() {
  return (
    <PrototypeShell title="Doctor Review" eyebrow="Clinician View">
      <RoleQueue role="Doctor" />
    </PrototypeShell>
  );
}
