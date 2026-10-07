import Image from "next/image";
import Link from "next/link";

export function EarlyVsLateStory() {
  return (
    <section className="overflow-hidden bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="editorial-kicker mb-5 text-gold-light">Two health journeys</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
              Monitor early. React less urgently.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-8 text-ivory/62">
              Earlier monitoring cannot prevent every illness. It can create time to review meaningful changes,
              establish whether they deserve attention and discuss proportionate next steps before some situations become urgent.
            </p>
            <Link
              href="/preventive-health"
              className="mt-5 inline-flex text-sm font-semibold text-gold-light underline decoration-gold/40 underline-offset-8"
            >
              Understand the prevention approach
            </Link>
          </div>
        </div>

        <div className="mms-cinematic-frame relative mt-12 aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_42px_120px_rgba(0,0,0,0.30)] md:aspect-[16/9]">
          <Image
            src="/mms-early-vs-late-v2.webp"
            alt="Asian woman shown in a calm preventive monitoring setting contrasted with a more urgent hospital setting."
            fill
            className="mms-cinematic-image object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/28 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-full border border-gold/30 bg-[#07151d]/72 px-4 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-gold-light backdrop-blur-md">
            Planned • measured • calm
          </div>
          <div className="absolute bottom-5 right-5 hidden rounded-full border border-white/15 bg-[#241819]/72 px-4 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#e0b3a5] backdrop-blur-md sm:block">
            Urgent • disruptive • harder
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="font-serif text-2xl text-gold-light">Earlier monitoring</p>
            <p className="mt-3 text-sm leading-6 text-ivory/58">
              Builds a baseline, compares change over time and creates opportunities for doctor-guided review when something shifts.
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="font-serif text-2xl text-[#e0b3a5]">Later reaction</p>
            <p className="mt-3 text-sm leading-6 text-ivory/58">
              Symptoms may already be disrupting daily life, and investigation or treatment can sometimes need to move more urgently.
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-6 text-ivory/42">
          Preventive monitoring is not a guarantee against disease. It is a way to reduce avoidable delay and create earlier opportunities for professional review.
        </p>
      </div>
    </section>
  );
}
