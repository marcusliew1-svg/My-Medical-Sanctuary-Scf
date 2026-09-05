import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { PublicContainer, PublicSectionShell, ResponsiveEditorialImage } from "@/components/PublicVisualPrimitives";
import { locationStatusLabels, type MmsLocation } from "@/data/locations";

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`editorial-kicker ${dark ? "text-champagne" : "text-deep-green"}`}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <Eyebrow dark={dark}>{eyebrow}</Eyebrow> : null}
      <h2 className={`mt-4 text-balance font-serif text-4xl leading-[1.04] md:text-6xl ${dark ? "text-ivory" : "text-navy"}`}>
        {title}
      </h2>
      {lead ? (
        <p className={`mt-6 max-w-2xl text-lg leading-8 ${dark ? "text-ivory/72" : "text-warm-gray"}`}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}

export function PublicHero({
  eyebrow,
  title,
  brandLine,
  lead,
  image,
  imageAlt,
  primaryLabel = "Start Health Review",
  primaryHref = "/contact",
  secondaryLabel = "Explore MMS",
  secondaryHref = "/about-mms",
  imagePosition = "60% center",
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  brandLine: string;
  lead: string;
  image: string;
  imageAlt: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  imagePosition?: string;
  tone?: "dark" | "soft" | "intelligence" | "location";
}) {
  const toneClasses = {
    dark: {
      section: "bg-[#06171d] text-ivory",
      overlay:
        "bg-[linear-gradient(90deg,rgba(5,16,21,.98),rgba(5,16,21,.84)_42%,rgba(5,16,21,.36)_76%),linear-gradient(0deg,rgba(5,16,21,.88),rgba(5,16,21,.12)_58%)]",
      eyebrow: true,
      title: "text-ivory",
      brand: "text-champagne",
      lead: "text-ivory/76",
      secondary: "light" as const,
    },
    intelligence: {
      section: "bg-[#06171d] text-ivory",
      overlay:
        "bg-[linear-gradient(90deg,rgba(3,19,24,.98),rgba(3,28,36,.9)_45%,rgba(3,19,24,.46)_78%),linear-gradient(0deg,rgba(3,19,24,.86),rgba(3,19,24,.06)_58%)]",
      eyebrow: true,
      title: "text-ivory",
      brand: "text-champagne",
      lead: "text-ivory/76",
      secondary: "light" as const,
    },
    location: {
      section: "bg-[#06171d] text-ivory",
      overlay:
        "bg-[linear-gradient(90deg,rgba(5,16,21,.96),rgba(5,16,21,.78)_40%,rgba(49,91,76,.26)_78%),linear-gradient(0deg,rgba(5,16,21,.82),rgba(5,16,21,.10)_58%)]",
      eyebrow: true,
      title: "text-ivory",
      brand: "text-champagne",
      lead: "text-ivory/76",
      secondary: "light" as const,
    },
    soft: {
      section: "bg-ivory text-navy",
      overlay:
        "bg-[linear-gradient(90deg,rgba(253,251,247,.97),rgba(253,251,247,.86)_42%,rgba(253,251,247,.22)_76%),linear-gradient(0deg,rgba(253,251,247,.92),rgba(253,251,247,.18)_60%)]",
      eyebrow: false,
      title: "text-navy",
      brand: "text-deep-green",
      lead: "text-charcoal/76",
      secondary: "outline" as const,
    },
  }[tone];

  return (
    <section className={`relative isolate overflow-hidden px-4 pt-28 md:pt-36 ${toneClasses.section}`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="-z-20 object-cover"
        style={{ objectPosition: imagePosition }}
        sizes="100vw"
      />
      <div className={`absolute inset-0 -z-10 ${toneClasses.overlay}`} />
      <div className="mx-auto grid min-h-[min(760px,78vh)] max-w-6xl content-end py-16 md:content-center md:py-20">
        <div className="max-w-3xl">
          <Eyebrow dark={toneClasses.eyebrow}>{eyebrow}</Eyebrow>
          <h1 className={`mt-5 text-balance font-serif text-5xl leading-[0.98] md:text-7xl lg:text-8xl ${toneClasses.title}`}>
            {title}
          </h1>
          <p className={`mt-6 text-xl leading-8 md:text-2xl ${toneClasses.brand}`}>{brandLine}</p>
          <p className={`mt-4 max-w-2xl text-base leading-8 md:text-lg ${toneClasses.lead}`}>{lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
            <ButtonLink href={secondaryHref} variant={toneClasses.secondary}>
              {secondaryLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustBar({ items }: { items: Array<{ title: string; text: string }> }) {
  return (
    <section className="bg-[#07151d] px-4 text-ivory">
      <div className="mx-auto grid max-w-6xl border-x border-white/10 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((item) => (
          <div key={item.title} className="border-b border-r border-white/10 px-5 py-5 last:border-r-0 md:border-b-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-champagne">{item.title}</p>
            <p className="mt-2 text-xs leading-5 text-ivory/65">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EditorialSplit({
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
  children,
  dark = false,
  reverse = false,
  imagePosition = "center",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
  dark?: boolean;
  reverse?: boolean;
  imagePosition?: string;
}) {
  return (
    <PublicSectionShell tone={dark ? "midnight" : "ivory"}>
      <div className={`grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center ${reverse ? "lg:grid-flow-dense" : ""}`}>
        <div className={reverse ? "lg:col-start-2" : ""}>
          <SectionHeading eyebrow={eyebrow} title={title} lead={lead} dark={dark} />
          {children ? <div className="mt-9">{children}</div> : null}
        </div>
        <ResponsiveEditorialImage
          src={image}
          alt={imageAlt}
          objectPosition={imagePosition}
          className={`${reverse ? "lg:col-start-1 lg:row-start-1" : ""} min-h-[360px] md:min-h-[540px]`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(11,26,46,.22))]" />
        </ResponsiveEditorialImage>
      </div>
    </PublicSectionShell>
  );
}

export function ImageFeature({
  items,
}: {
  items: Array<{ title: string; eyebrow?: string; text: string; detail?: string; image: string; href?: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const content = (
          <article className={`group relative min-h-[320px] overflow-hidden rounded-md bg-[#07151d] text-ivory outline-none ${index % 3 === 0 ? "lg:translate-y-8" : ""}`}>
            <Image src={item.image} alt="" fill className="object-cover opacity-75 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-52" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,29,0.08),rgba(7,21,29,0.78)_66%,rgba(7,21,29,0.96))]" />
            <div className="relative flex min-h-[320px] flex-col justify-end p-6">
              {item.eyebrow ? <p className="text-[0.68rem] font-semibold uppercase tracking-[0.17em] text-champagne">{item.eyebrow}</p> : null}
              <h3 className="mt-3 font-serif text-3xl leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ivory/76">{item.text}</p>
              {item.detail ? (
                <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                  <p className="overflow-hidden pt-0 text-sm leading-6 text-ivory/82 opacity-0 transition duration-500 group-hover:pt-4 group-hover:opacity-100">
                    {item.detail}
                  </p>
                </div>
              ) : null}
            </div>
          </article>
        );

        return item.href ? (
          <Link key={item.title} href={item.href} className="block focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold">
            {content}
          </Link>
        ) : (
          <div key={item.title} tabIndex={0} className="focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold">
            {content}
          </div>
        );
      })}
    </div>
  );
}

export function JourneyStepRail({ steps, dark = false }: { steps: Array<{ title: string; text: string }>; dark?: boolean }) {
  return (
    <ol className={`grid gap-8 border-l pl-7 ${steps.length >= 5 ? "md:grid-cols-5" : "md:grid-cols-4"} md:border-l-0 md:border-t md:pl-0 md:pt-8 ${dark ? "border-champagne/40" : "border-gold/45"}`}>
      {steps.map((step, index) => (
        <li key={step.title} className="relative md:pr-6">
          <span className={`absolute -left-[2.1rem] top-1 size-4 rounded-full md:-top-10 md:left-0 ${dark ? "bg-champagne" : "bg-gold"}`} />
          <p className={`text-xs font-semibold uppercase tracking-[0.15em] ${dark ? "text-champagne" : "text-deep-green"}`}>
            0{index + 1}
          </p>
          <h3 className={`mt-3 font-serif text-3xl leading-tight ${dark ? "text-ivory" : "text-navy"}`}>{step.title}</h3>
          <p className={`mt-3 text-sm leading-6 ${dark ? "text-ivory/68" : "text-warm-gray"}`}>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function LocationFeature({ locations }: { locations: MmsLocation[] }) {
  return (
    <div className="border-t border-bronze/30">
      {locations.map((location, index) => (
        <article key={location.slug} className={`grid gap-8 border-b border-bronze/25 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center ${index % 2 ? "lg:grid-flow-dense" : ""}`}>
          <div className={`relative min-h-[300px] overflow-hidden rounded-md md:min-h-[390px] ${index % 2 ? "lg:col-start-2" : ""}`}>
            <Image src={location.image} alt={`${location.name} visual placeholder`} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(7,21,29,.62))]" />
            <span className="absolute left-5 top-5 bg-ivory/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-deep-green">
              {locationStatusLabels[location.status]}
            </span>
          </div>
          <div className={index % 2 ? "lg:col-start-1 lg:row-start-1" : ""}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze">{String(index + 1).padStart(2, "0")} · {location.city}</p>
            <h3 className="mt-4 font-serif text-4xl leading-tight text-navy md:text-5xl">{location.name}</h3>
            <p className="mt-3 text-lg font-semibold text-deep-green">{location.positioning}</p>
            <p className="mt-5 max-w-xl leading-8 text-warm-gray">{location.overview}</p>
            {location.address ? <p className="mt-4 text-sm text-charcoal">{location.address}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function HealthIntelligenceFeature() {
  const items = [
    ["Preventive Health", "Earlier understanding before problems become urgent."],
    ["Longevity Science", "Evidence-aware views on ageing, vitality and resilience."],
    ["Treatments Explained", "Clear context before advanced care discussions."],
    ["Medicine Price Intelligence", "Compare verified price observations with dates, sources and uncertainty visible."],
    ["Generic Medicine Finder", "Understand names and equivalents without encouraging unsupervised substitution."],
    ["Medication Cost Review", "Prepare a medicine list for professional review before any change is considered."],
    ["Regional Care Intelligence", "Navigate Malaysia and Thailand pathways without promises about access or availability."],
  ];

  return (
    <PublicSectionShell tone="midnight">
      <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <SectionHeading
          eyebrow="Health Intelligence"
          title="Healthcare is global. Prices aren't."
          lead="MMS will help patients understand healthcare systems, access questions and uncertainty before any personalised review or licensed next step."
          dark
        />
        <div className="border-t border-champagne/30">
          {items.map(([title, text], index) => (
            <article key={title} className="grid gap-3 border-b border-champagne/18 py-5 sm:grid-cols-[2.5rem_0.8fr_1.2fr]">
              <span className="text-xs text-champagne">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-serif text-2xl leading-tight text-ivory">{title}</h3>
              <p className="text-sm leading-6 text-ivory/68">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </PublicSectionShell>
  );
}

export function CTASection({
  title = "Your health journey can begin with a conversation.",
  lead = "Begin with clarity, then decide with professional guidance.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section data-public-section className="relative overflow-hidden bg-ivory py-16 md:py-24 lg:py-28">
      <PublicContainer className="grid gap-10 border-y border-gold/30 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Eyebrow>Your health, our commitment</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-warm-gray">{lead}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">Book Consultation</ButtonLink>
          <ButtonLink href="/how-it-works" variant="outline">How MMS Works</ButtonLink>
        </div>
      </PublicContainer>
    </section>
  );
}
