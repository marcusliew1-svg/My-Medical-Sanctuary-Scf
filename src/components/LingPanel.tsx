"use client";

import { useState } from "react";
import { lingDisclaimer, lingOptions } from "@/lib/content";

export function LingPanel() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-[0_22px_58px_rgba(16,36,42,0.10)] md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Ling</p>
          <h3 className="mt-2 text-2xl font-semibold">What brings you here today?</h3>
        </div>
        <span className="grid size-12 place-items-center rounded-full bg-teal-50 text-teal-800">
          <span className="size-3 rounded-full bg-teal-700" />
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {lingOptions.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
              selected === option
                ? "border-teal-700 bg-teal-50 text-teal-900"
                : "border-stone-200 bg-white text-stone-700 hover:border-teal-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selected ? (
        <p className="mt-5 rounded-lg bg-stone-50 p-4 text-sm leading-6 text-stone-600">
          Ling can help you understand general concepts related to "{selected}" and prepare
          better questions for your MMS doctor.
        </p>
      ) : null}
      <p className="mt-5 text-xs leading-6 text-stone-500">
        {lingDisclaimer}
      </p>
    </div>
  );
}
