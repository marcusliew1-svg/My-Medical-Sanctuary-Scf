import { Card, HierarchyRail, PrototypeShell, WorkflowTemplates } from "./components";
import { commercialOpportunities, prototypePeople } from "./data";

export default function PrototypePage() {
  return (
    <PrototypeShell title="MMS Operations Prototype">
      <div className="grid gap-5 md:grid-cols-4">
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Synthetic People</p>
          <p className="mt-3 font-serif text-4xl text-navy">{prototypePeople.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Commercial Items</p>
          <p className="mt-3 font-serif text-4xl text-navy">{commercialOpportunities.length}</p>
        </Card>
        <Card className="md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Boundary</p>
          <p className="mt-3 leading-7 text-warm-gray">
            This is a frontend prototype using mock state and mock records only. It does not create
            production clinical records or commercial transactions.
          </p>
        </Card>
      </div>
      <div className="mt-6">
        <HierarchyRail />
      </div>
      <div className="mt-6">
        <WorkflowTemplates />
      </div>
    </PrototypeShell>
  );
}
