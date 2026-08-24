import Image from "next/image";
import Link from "next/link";

export type RevealCardItem = {
  title: string;
  eyebrow?: string;
  text: string;
  detail: string;
  image?: string;
  href?: string;
};

export function RevealCardGrid({ items }: { items: RevealCardItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const content = (
          <article className="group relative min-h-[340px] overflow-hidden rounded-[2rem] border border-gold-light/25 bg-navy text-ivory shadow-[0_28px_76px_rgba(11,26,46,0.18)] outline-none transition duration-500 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(11,26,46,0.26)] focus-visible:ring-2 focus-visible:ring-gold">
            {item.image ? (
              <Image
                src={item.image}
                alt=""
                fill
                priority
                className="object-cover opacity-72 transition duration-700 group-hover:scale-105 group-hover:opacity-52"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,29,0.08),rgba(7,21,29,0.76)_62%,rgba(7,21,29,0.96))]" />
            <div className="relative flex h-full min-h-[340px] flex-col justify-end p-6 md:p-7">
              {item.eyebrow ? (
                <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-light">
                  {item.eyebrow}
                </p>
              ) : null}
              <h3 className="font-serif text-3xl leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ivory/76">{item.text}</p>
              <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                <p className="overflow-hidden pt-0 text-sm leading-6 text-ivory/82 opacity-0 transition duration-500 group-hover:pt-4 group-hover:opacity-100 group-focus-visible:pt-4 group-focus-visible:opacity-100">
                  {item.detail}
                </p>
              </div>
            </div>
          </article>
        );

        return item.href ? (
          <Link key={item.title} href={item.href} className="block outline-none">
            {content}
          </Link>
        ) : (
          <div key={item.title} tabIndex={0} className="outline-none">
            {content}
          </div>
        );
      })}
    </div>
  );
}

export function CareTeamStrip({
  title,
  text,
  image = "/mms-doctor-results-review.png",
  eyebrow = "Care team beside you",
  points = ["Physician review", "HRM coordination", "Clear next steps"],
}: {
  title: string;
  text: string;
  image?: string;
  eyebrow?: string;
  points?: string[];
}) {
  return (
    <section className="relative overflow-hidden bg-warm-white px-4 py-16 text-charcoal md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] shadow-[0_36px_90px_rgba(11,26,46,0.16)]">
          <Image src={image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 52vw, 100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(11,26,46,0.28))]" />
        </div>
        <div className="lg:pl-6">
          <p className="editorial-kicker mb-4 text-deep-green">{eyebrow}</p>
          <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">{title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-warm-gray">{text}</p>
          <div className="mt-8 grid gap-4 border-y border-gold/35 py-6 sm:grid-cols-3">
            {points.map((point) => (
              <p key={point} className="text-sm font-semibold uppercase tracking-[0.12em] text-deep-green">
                {point}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketSignalPanel({
  title = "Same active ingredient. Different country economics.",
  lead = "MMS can help patients understand the access question before any licensed professional or supplier is involved.",
}: {
  title?: string;
  lead?: string;
}) {
  const markets = [
    ["United States", "Very high", "Insurance design, brand strategy and distribution layers can create extreme patient cost variation."],
    ["Gulf / Arab markets", "Premium private-pay", "Import timing, private access and country-specific registration can influence what patients see."],
    ["Australia", "Subsidy dependent", "A medicine may be affordable when subsidised and costly when outside public pathways."],
    ["Singapore", "High private cost", "Specialist prescribing, private pharmacy pricing and supply availability can add a premium."],
    ["Indonesia", "Variable", "Registration, city-level supply and local distribution can differ widely."],
    ["Malaysia / Thailand", "Potential value corridor", "A possible access-intelligence pathway, subject to registration, prescription, licensed review and continuity."],
  ];

  return (
    <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="editorial-kicker mb-4 text-gold-light">Medicine access intelligence</p>
          <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">{title}</h2>
          <p className="mt-6 text-lg leading-8 text-ivory/72">{lead}</p>
          <p className="mt-6 border-l border-gold/50 pl-5 text-sm leading-7 text-ivory/64">
            Public content should explain the opportunity. Patient-specific names, dosage, dispensing,
            quotations and availability belong inside verified professional review.
          </p>
        </div>
        <div className="grid gap-3">
          {markets.map(([market, signal, reason]) => (
            <article
              key={market}
              className="group grid gap-3 rounded-[1.5rem] border border-gold-light/20 bg-ivory/95 px-5 py-5 text-charcoal shadow-[0_22px_60px_rgba(0,0,0,0.2)] transition duration-500 hover:-translate-y-0.5 hover:bg-white md:grid-cols-[0.72fr_0.62fr_1.46fr]"
            >
              <h3 className="font-serif text-2xl leading-tight text-navy">{market}</h3>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-deep-green">{signal}</p>
              <p className="text-sm leading-6 text-warm-gray">{reason}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LingGuideStrip({
  title,
  text,
  image = "/ling-knowledge.png",
}: {
  title: string;
  text: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#06171d] px-4 py-16 text-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(212,175,55,0.16),transparent_35%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.56fr_1fr] md:items-center">
        <div className="relative min-h-[330px] overflow-hidden rounded-[1.25rem] border border-gold-light/25">
          <Image src={image} alt="Ling, MMS AI Health Education Companion." fill priority className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <div>
          <p className="editorial-kicker mb-4 text-gold-light">Ling beside you</p>
          <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">{title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/72">{text}</p>
          <div className="mt-8 grid gap-5 border-t border-gold-light/30 pt-6 sm:grid-cols-3">
            {["Explain plainly", "Prepare questions", "Know the boundary"].map((item) => (
              <p key={item} className="text-sm font-semibold text-ivory/86">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
