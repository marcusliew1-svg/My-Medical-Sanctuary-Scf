"use client";

import { useMemo, useState } from "react";
import { prototypePeople, workflowTemplates, type PrototypePerson, type Role } from "./data";

type HandoffStatus = "Queued" | "Accepted" | "Completed";

type LocalHandoff = {
  id: string;
  personId: string;
  personName: string;
  from: Role;
  to: Role;
  payload: string;
  status: HandoffStatus;
};

const statusOrder: HandoffStatus[] = ["Queued", "Accepted", "Completed"];

function buildHandoffs(people: PrototypePerson[]): LocalHandoff[] {
  return people.flatMap((person) =>
    workflowTemplates[person.journey.templateId].handoffs.map((handoff, index) => ({
      id: `${person.id}-${index}`,
      personId: person.id,
      personName: person.name,
      from: handoff.from,
      to: handoff.to,
      payload: handoff.payload,
      status: index === 0 ? "Queued" : "Accepted",
    })),
  );
}

export function PrototypeHandoffBoard({ filterTo }: { filterTo?: Role }) {
  const initialHandoffs = useMemo(() => buildHandoffs(prototypePeople), []);
  const [handoffs, setHandoffs] = useState<LocalHandoff[]>(initialHandoffs);

  const visibleHandoffs = filterTo
    ? handoffs.filter((handoff) => handoff.to === filterTo)
    : handoffs;

  function advance(id: string) {
    setHandoffs((current) =>
      current.map((handoff) => {
        if (handoff.id !== id) {
          return handoff;
        }

        const nextIndex = Math.min(statusOrder.indexOf(handoff.status) + 1, statusOrder.length - 1);
        return { ...handoff, status: statusOrder[nextIndex] };
      }),
    );
  }

  function reset() {
    setHandoffs(initialHandoffs);
  }

  return (
    <section className="rounded-lg border border-gold-light/45 bg-white/[0.94] p-6 shadow-soft">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Local Frontend State</p>
          <h2 className="mt-3 font-serif text-3xl text-navy">
            {filterTo ? `${filterTo} handoffs` : "Synthetic handoff board"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-warm-gray">
            These handoffs change only in the browser session. Refreshing the page resets the prototype.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-gold/70 px-4 text-sm font-semibold text-navy transition hover:bg-gold"
        >
          Reset Board
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {visibleHandoffs.map((handoff) => (
          <article key={handoff.id} className="rounded-lg border border-gold-light/40 bg-ivory p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-semibold text-navy">{handoff.personName}</p>
                <p className="mt-1 text-sm text-warm-gray">
                  {handoff.from} → {handoff.to}
                </p>
              </div>
              <span className="rounded-full border border-gold-light bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-navy">
                {handoff.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-warm-gray">{handoff.payload}</p>
            <button
              type="button"
              onClick={() => advance(handoff.id)}
              disabled={handoff.status === "Completed"}
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-navy px-4 text-sm font-semibold text-ivory transition hover:bg-deep-green disabled:cursor-not-allowed disabled:opacity-45"
            >
              Advance locally
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
