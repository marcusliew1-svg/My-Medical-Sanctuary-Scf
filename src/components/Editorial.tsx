import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ButtonLink";

type ImagePanelProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  objectPosition?: string;
};

export function ImagePanel({
  src,
  alt,
  className = "",
  priority = false,
  objectPosition = "center",
}: ImagePanelProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover duration-[1400ms] ease-out motion-safe:hover:scale-[1.025]"
        style={{ objectPosition }}
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(11,26,46,0.2))]" />
    </div>
  );
}

type EditorialHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  imagePosition?: string;
  trustItems?: Array<{ title: string; text: string }>;
};

export function EditorialHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
  primaryLabel = "Begin your health journey",
  primaryHref = "/contact",
  secondaryLabel = "How MMS works",
  secondaryHref = "/how-it-works",
  imagePosition = "60% center",
  trustItems = [
    { title: "Physician-led care", text: "Professional review before recommendations." },
    { title: "Personalised to you", text: "No one-size-fits-all health pathway." },
    { title: "Trusted & private", text: "Discretion, clarity and continuity." },
    { title: "Science + humanity", text: "Evidence-aware, compassion-led." },
  ],
}: EditorialHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#07151d] px-4 pt-36 text-ivory md:pt-44">
      <div className="absolute inset-0 -z-20">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover motion-safe:animate-[slowZoom_18s_ease-out_forwards]"
          style={{ objectPosition: imagePosition }}
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,21,29,0.98),rgba(7,21,29,0.84)_46%,rgba(7,21,29,0.42)_78%),linear-gradient(0deg,rgba(7,21,29,0.9),rgba(7,21,29,0.22)_62%)]" />
      <div className="mx-auto grid min-h-[78vh] max-w-6xl items-end pb-16">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-gold-light">
            {eyebrow}
          </p>
          <h1 className="text-balance font-serif text-5xl leading-[0.98] md:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ivory/78 md:text-xl">{lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
            <ButtonLink href={secondaryHref} variant="light">
              {secondaryLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-6xl border-t border-gold-light/25 bg-navy/80 shadow-[0_-18px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
        <div className="grid gap-px md:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="border-b border-ivory/10 px-5 py-5 md:border-b-0 md:border-r md:border-ivory/10">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
                {item.title}
              </p>
              <p className="mt-2 text-xs leading-5 text-ivory/66">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" />
      <span className="sr-only">{imageAlt}</span>
    </section>
  );
}

type SplitStoryProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  dark?: boolean;
  children?: ReactNode;
  imagePosition?: string;
  imagePriority?: boolean;
};

export function SplitStory({
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
  reverse = false,
  dark = false,
  children,
  imagePosition,
  imagePriority = false,
}: SplitStoryProps) {
  return (
    <section className={`px-4 py-20 md:py-28 ${dark ? "bg-navy text-ivory" : "bg-ivory text-charcoal"}`}>
      <div className={`mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center ${reverse ? "lg:grid-flow-dense" : ""}`}>
        <div className={reverse ? "lg:col-start-2" : ""}>
          {eyebrow ? (
            <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.22em] ${dark ? "text-gold-light" : "text-deep-green"}`}>
              {eyebrow}
            </p>
          ) : null}
          <h2 className={`text-balance font-serif text-4xl leading-tight md:text-6xl ${dark ? "text-ivory" : "text-navy"}`}>
            {title}
          </h2>
          {lead ? (
            <p className={`mt-6 max-w-2xl text-lg leading-8 ${dark ? "text-ivory/72" : "text-warm-gray"}`}>
              {lead}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
        <ImagePanel
          src={image}
          alt={imageAlt}
          priority={imagePriority}
          objectPosition={imagePosition}
          className={`${reverse ? "lg:col-start-1 lg:row-start-1" : ""} min-h-[360px] rounded-[2rem] shadow-premium md:min-h-[520px]`}
        />
      </div>
    </section>
  );
}

export function EditorialStatement({
  eyebrow,
  title,
  lead,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  dark?: boolean;
}) {
  return (
    <section className={`px-4 py-20 md:py-28 ${dark ? "bg-[#07151d] text-ivory" : "bg-warm-white text-charcoal"}`}>
      <div className="mx-auto max-w-5xl">
        <p className={`mb-5 text-xs font-semibold uppercase tracking-[0.24em] ${dark ? "text-gold-light" : "text-deep-green"}`}>
          {eyebrow}
        </p>
        <h2 className={`text-balance font-serif text-4xl leading-tight md:text-6xl ${dark ? "text-ivory" : "text-navy"}`}>
          {title}
        </h2>
        {lead ? <p className={`mt-6 max-w-3xl text-lg leading-8 ${dark ? "text-ivory/70" : "text-warm-gray"}`}>{lead}</p> : null}
      </div>
    </section>
  );
}

export function JourneyLine({
  steps,
  dark = false,
  compact = false,
}: {
  steps: Array<{ title: string; text: string }>;
  dark?: boolean;
  compact?: boolean;
}) {
  const lineClass = dark ? "border-gold-light/45" : "border-gold/45";

  return (
    <ol
      className={`relative grid gap-8 border-l pl-7 ${lineClass} ${
        compact ? "" : "md:grid-cols-5 md:border-l-0 md:border-t md:pl-0 md:pt-8"
      }`}
    >
      {steps.map((step, index) => (
        <li key={step.title} className="relative md:pr-5">
          <span
            className={`absolute -left-[2.15rem] top-1 grid size-4 place-items-center rounded-full bg-gold ${
              compact ? "" : "md:-top-10 md:left-0"
            }`}
          >
            <span className="size-1.5 rounded-full bg-navy" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            0{index + 1}
          </p>
          <h3 className={`mt-3 font-serif text-2xl ${dark ? "text-ivory" : "text-navy"}`}>
            {step.title}
          </h3>
          <p className={`mt-3 text-sm leading-6 ${dark ? "text-ivory/68" : "text-warm-gray"}`}>
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function FinalInvitation({
  title = "Your health journey can begin with a conversation.",
  lead = "Start with clarity, then decide with professional guidance.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy px-4 py-20 text-ivory md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(212,175,55,0.18),transparent_32%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Begin</p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ivory/72">{lead}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">Speak with MMS</ButtonLink>
          <ButtonLink href="/ling" variant="light">Start with Ling</ButtonLink>
        </div>
      </div>
    </section>
  );
}
