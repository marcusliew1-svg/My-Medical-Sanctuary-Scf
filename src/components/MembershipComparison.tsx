import Link from "next/link";
import { memberships } from "@/data/memberships";

export function MembershipComparison() {
  return (
    <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-4 text-gold-light">The membership continuum</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              More depth. More continuity. More coordination.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ivory/66">
            Every level begins with understanding. What changes is the intensity of follow-through, longitudinal planning and
            coordination—not an automatic increase in tests or interventions.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
          {memberships.map((membership, index) => (
            <article
              key={membership.name}
              className="group grid gap-6 border-b border-white/10 p-5 last:border-b-0 md:grid-cols-[0.34fr_0.78fr_1.3fr_1.18fr] md:p-7"
            >
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-light/65">
                  Level 0{index + 1}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-3xl leading-none transition group-hover:text-gold-light md:text-4xl">
                  {membership.name}
                </h3>
                <p className="mt-3 text-[0.64rem] font-semibold uppercase tracking-[0.15em] text-ivory/42">
                  {membership.accessNote}
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl leading-tight">{membership.tagline}</p>
                <p className="mt-3 text-sm leading-6 text-ivory/62">{membership.whoItSuits}</p>
                <p className="mt-4 border-l border-gold/30 pl-4 text-xs leading-5 text-ivory/46">{membership.coordination}</p>
              </div>

              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-light">First 30 days may include</p>
                <ul className="mt-4 grid gap-2">
                  {membership.firstThirtyDays.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-ivory/65">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-ivory/48">
            Membership suitability and inclusions are confirmed through MMS. Greater membership depth does not imply more testing; clinical services remain subject to indication, doctor assessment and individual appropriateness.
          </p>
          <Link href="/health-discovery" className="inline-flex rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-gold-light">
            Start with discovery
          </Link>
        </div>
      </div>
    </section>
  );
}
