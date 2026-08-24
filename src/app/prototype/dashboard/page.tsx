import { CommercialOpportunityPanel, HierarchyRail, PersonTable, PrototypeShell } from "../components";
import { PrototypeHandoffBoard } from "../handoff-board";

export default function PrototypeDashboardPage() {
  return (
    <PrototypeShell title="Synthetic Dashboard" eyebrow="Prototype Dashboard">
      <HierarchyRail />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <PersonTable />
        <CommercialOpportunityPanel />
      </div>
      <div className="mt-6">
        <PrototypeHandoffBoard />
      </div>
    </PrototypeShell>
  );
}
