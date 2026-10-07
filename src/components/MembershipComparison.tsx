import Link from "next/link";
import { memberships } from "@/data/memberships";

const tierMeta = {
  Ascend: {
    eyebrow: "Clarity",
    icon: "compass",
    accent: "border-[#d7b26a]/35 bg-[#d7b26a]/10 text-[#efd59d]",
    line: "bg-[#d7b26a]",
    glow: "from-[#d7b26a]/14",
  },
  Evolve: {
    eyebrow: "Optimisation",
    icon: "growth",
    accent: "border-[#88aa9b]/35 bg-[#88aa9b]/10 text-[#b8d1c5]",
    line: "bg-[#88aa9b]",
    glow: "from-[#88aa9b]/12",
  },
  Eterna: {
    eyebrow: "Continuity",
    icon: "shield",
    accent: "border-[#89a5b8]/35 bg-[#89a5b8]/10 text-[#bdd0dc]",
    line: "bg-[#89a5b8]",
    glow: "from-[#89a5b8]/12",
  },
  Pinnacle: {
    eyebrow: "Private",
    icon: "diamond",
    accent: "border-[#e0c184]/50 bg-[#e0c184]/12 text-[#f4dcaa]",
    line: "bg-[#e0c184]",
    glow: "from-[#e0c184]/20",
  },
} as const;

function TierIcon({ type, featured = false }: { type: "compass" | "growth" | "shield" | "diamond"; featured?: boolean }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: featured ? 1.45 : 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const cls = featured ? "h-10 w-10" : "h-8 w-8";

  if (type === "compass") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className={cls}>
        <circle cx="24" cy="24" r="17" {...common} />
        <path d="M29.8 18.2 26 26l-7.8 3.8L22 22l7.8-3.8Z" {...common} />
        <path d="M24 5v3M24 40v3M5 24h3M40 24h3" {...common} />
      </svg>
    );
  }

  if (type === "growth") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className={cls}>
        <path d="M10 35 19 26l6 6 13-16" {...common} />
        <path d="M31 16h7v7" {...common} />
        <path d="M10 40h28" {...common} />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className={cls}>
        <path d="M24 6 38 11v11c0 9-5.3 15.7-14 20-8.7-4.3-14-11-14-20V11L24 6Z" {...common} />
        <path d="m17.5 24 4.3 4.3 9-9" {...common} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cls}>
      <path d="m24 6 15 14-15 22L9 20 24 6Z" {...common} />
      <path d="m9 20 15 5 15-5M24 6v19" {...common} />
    </svg>
  );
}

function StandardTierCard({
  membership,
  index,
}: {
  membership: (typeof memberships)[number];
  index: number;
}) {
  const meta = tierMeta[membership.name as keyof typeof tierMeta];

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.052),rgba(255,255,255,0.022))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.2)] transition duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_34px_90px_rgba(0,0,0,0.28)] md:p-7">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${meta.glow} to-transparent opacity-75`} />
      <div className={`absolute inset-x-0 top-0 h-px ${meta.line}`} />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl border backdrop-blur-sm ${meta.accent}`}>
            <TierIcon type={meta.icon} />
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-ivory/42">
            Level 0{index + 1}
          </span>
        </div>

        <p className="mt-8 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-gold-light/72">
          {meta.eyebrow}
        </p>
        <h3 className="mt-2 font-serif text-4xl leading-none text-ivory transition group-hover:text-gold-light md:text-[2.9rem]">
          {membership.name}
        </h3>
        <p className="mt-4 min-h-[3.5rem] font-serif text-2xl leading-tight text-ivory/92">
          {membership.tagline}
        </p>

        <p className="mt-5 min-h-[4.5rem] text-sm leading-6 text-ivory/58">
          {membership.whoItSuits}
        </p>

        <div className="mt-7 border-t border-white/10 pt-6">
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-gold-light/72">
            Core pathway
          </p>
          <ul className="mt-4 grid gap-3">
            {membership.firstThirtyDays.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-5 text-ivory/68">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${meta.line}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="max-w-[13rem] text-[0.66rem] leading-5 text-ivory/40">
            {membership.accessNote}
          </p>
          <Link
            href="/health-discovery"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-gold-light transition group-hover:translate-x-1"
          >
            Explore
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function PinnacleCard({ membership }: { membership: (typeof memberships)[number] }) {
  const meta = tierMeta.Pinnacle;

  return (
    <article className="group relative mt-6 overflow-hidden rounded-[2.3rem] border border-[#e0c184]/35 bg-[radial-gradient(circle_at_82%_18%,rgba(224,193,132,0.16),transparent_28%),linear-gradient(135deg,rgba(18,36,45,0.98),rgba(7,21,29,0.98))] p-7 shadow-[0_42px_120px_rgba(0,0,0,0.34)] md:p-10 lg:p-12">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e0c184] to-transparent" />

      <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#e0c184]/35 bg-[#e0c184]/10 px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[#f4dcaa]">
              Private by invitation
            </span>
            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-ivory/38">
              Level 04
            </span>
          </div>

          <div className="mt-7 flex items-center gap-5">
            <div className={`grid h-16 w-16 place-items-center rounded-[1.35rem] border ${meta.accent}`}>
              <TierIcon type="diamond" featured />
            </div>
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-gold-light/72">
                Highest level of coordination
              </p>
              <h3 className="mt-2 font-serif text-5xl leading-none text-ivory md:text-6xl">
                Pinnacle
              </h3>
            </div>
          </div>

          <p className="mt-8 max-w-xl font-serif text-3xl leading-tight text-ivory md:text-4xl">
            Private, highly coordinated care.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ivory/62">
            For executives, founders and families seeking a discreet, highly coordinated preventive-care relationship with priority support and continuity.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Dedicated coordination", "Priority scheduling", "Bespoke planning", "Long-view continuity"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#e0c184]/20 bg-[#e0c184]/7 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#efd59d]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-black/15 p-6 backdrop-blur-sm md:p-7">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-gold-light">
            A private first month may include
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {membership.firstThirtyDays.map((item) => (
              <div
                key={item}
                className="flex min-h-[4.5rem] items-start gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] p-4"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#e0c184]" />
                <p className="text-sm leading-6 text-ivory/70">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-white/10 pt-6">
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-ivory/38">
              Access
            </p>
            <p className="mt-2 text-sm leading-6 text-ivory/56">{membership.accessNote}</p>
            <Link
              href="/health-discovery"
              className="mt-6 inline-flex rounded-full bg-[#e0c184] px-5 py-3 text-sm font-semibold text-[#07151d] transition hover:-translate-y-0.5 hover:bg-[#f0d69c]"
            >
              Discuss Pinnacle privately
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MembershipComparison() {
  const standardMemberships = memberships.filter((membership) => membership.name !== "Pinnacle");
  const pinnacle = memberships.find((membership) => membership.name === "Pinnacle");

  return (
    <section className="relative overflow-hidden bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(199,167,106,0.08),transparent_24%),radial-gradient(circle_at_85%_78%,rgba(93,132,123,0.08),transparent_26%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-4 text-gold-light">The membership continuum</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              Choose the depth of relationship, not a shelf of treatments.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-8 text-ivory/66">
              Ascend, Evolve and Eterna create progressively deeper continuity. Pinnacle is a more private,
              highly coordinated relationship for people who value discretion, priority and bespoke support.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-ivory/36">
              <span>01 Ascend</span>
              <span>→</span>
              <span>02 Evolve</span>
              <span>→</span>
              <span>03 Eterna</span>
              <span>→</span>
              <span className="text-gold-light/80">04 Pinnacle</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {standardMemberships.map((membership, index) => (
            <StandardTierCard key={membership.name} membership={membership} index={index} />
          ))}
        </div>

        {pinnacle ? <PinnacleCard membership={pinnacle} /> : null}

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-sm leading-6 text-ivory/46">
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
