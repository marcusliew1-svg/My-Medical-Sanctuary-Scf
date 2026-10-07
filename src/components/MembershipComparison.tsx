import Link from "next/link";
import { memberships } from "@/data/memberships";

const tierMeta = {
  Ascend: {
    eyebrow: "Clarity",
    icon: "compass",
    accent: "border-[#d7b26a]/35 bg-[#d7b26a]/10 text-[#efd59d]",
    line: "bg-[#d7b26a]",
  },
  Evolve: {
    eyebrow: "Optimisation",
    icon: "growth",
    accent: "border-[#88aa9b]/35 bg-[#88aa9b]/10 text-[#b8d1c5]",
    line: "bg-[#88aa9b]",
  },
  Eterna: {
    eyebrow: "Continuity",
    icon: "shield",
    accent: "border-[#89a5b8]/35 bg-[#89a5b8]/10 text-[#bdd0dc]",
    line: "bg-[#89a5b8]",
  },
  Pinnacle: {
    eyebrow: "Private",
    icon: "diamond",
    accent: "border-[#e0c184]/40 bg-[#e0c184]/12 text-[#f2d9a6]",
    line: "bg-[#e0c184]",
  },
} as const;

function TierIcon({ type }: { type: "compass" | "growth" | "shield" | "diamond" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "compass") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
        <circle cx="24" cy="24" r="17" {...common} />
        <path d="M29.8 18.2 26 26l-7.8 3.8L22 22l7.8-3.8Z" {...common} />
        <path d="M24 5v3M24 40v3M5 24h3M40 24h3" {...common} />
      </svg>
    );
  }

  if (type === "growth") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
        <path d="M10 35 19 26l6 6 13-16" {...common} />
        <path d="M31 16h7v7" {...common} />
        <path d="M10 40h28" {...common} />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
        <path d="M24 6 38 11v11c0 9-5.3 15.7-14 20-8.7-4.3-14-11-14-20V11L24 6Z" {...common} />
        <path d="m17.5 24 4.3 4.3 9-9" {...common} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
      <path d="m24 6 15 14-15 22L9 20 24 6Z" {...common} />
      <path d="m9 20 15 5 15-5M24 6v19" {...common} />
    </svg>
  );
}

export function MembershipComparison() {
  return (
    <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-4 text-gold-light">The membership continuum</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              Four pathways. One continuous health relationship.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ivory/66">
            Every level begins with understanding. What changes is the depth of coordination,
            continuity and follow-through—not an automatic increase in tests or interventions.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {memberships.map((membership, index) => {
            const meta = tierMeta[membership.name as keyof typeof tierMeta];
            return (
              <article
                key={membership.name}
                className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.18)] transition duration-500 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.05] md:p-8"
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${meta.line}`} />

                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border ${meta.accent}`}>
                      <TierIcon type={meta.icon} />
                    </div>
                    <div>
                      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-ivory/42">
                        Level 0{index + 1} · {meta.eyebrow}
                      </p>
                      <h3 className="mt-1 font-serif text-4xl leading-none text-ivory transition group-hover:text-gold-light md:text-5xl">
                        {membership.name}
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-ivory/45">
                    MMS
                  </span>
                </div>

                <p className="mt-7 font-serif text-2xl leading-tight text-ivory md:text-3xl">
                  {membership.tagline}
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light/80">
                      Best suited for
                    </p>
                    <p className="mt-3 text-sm leading-6 text-ivory/66">{membership.whoItSuits}</p>
                  </div>
                  <div>
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light/80">
                      Coordination
                    </p>
                    <p className="mt-3 text-sm leading-6 text-ivory/58">{membership.coordination}</p>
                  </div>
                </div>

                <div className="mt-7 rounded-[1.35rem] border border-white/8 bg-black/10 p-5">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
                    First 30 days may include
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {membership.firstThirtyDays.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-5 text-ivory/66">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.line}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-ivory/38">
                      Access
                    </p>
                    <p className="mt-2 max-w-sm text-xs leading-5 text-ivory/56">{membership.accessNote}</p>
                  </div>
                  <Link
                    href="/health-discovery"
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold-light transition hover:bg-gold hover:text-navy"
                  >
                    Explore {membership.name}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-9 flex flex-col gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-sm leading-6 text-ivory/50">
            Membership suitability and inclusions are confirmed through MMS. Greater membership depth does not imply more testing; clinical services remain subject to indication, doctor assessment and individual appropriateness.
          </p>
          <Link
            href="/health-discovery"
            className="inline-flex shrink-0 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-gold-light"
          >
            Start Health Discovery
          </Link>
        </div>
      </div>
    </section>
  );
}
