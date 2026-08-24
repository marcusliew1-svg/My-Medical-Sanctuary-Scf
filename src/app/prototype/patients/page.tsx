import { PersonTable, PrototypeShell } from "../components";

export default function PrototypePatientsPage() {
  return (
    <PrototypeShell title="Synthetic Patients" eyebrow="Person Index">
      <PersonTable />
    </PrototypeShell>
  );
}
