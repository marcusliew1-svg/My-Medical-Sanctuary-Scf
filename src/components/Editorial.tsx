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
  showHealthSignals?: boolean;
  spokespersonName?: string;
  spokespersonMessage?: string;
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
  showHealthSignals = false,
  spokespersonName,
  spokespersonMessage,
  trustItems = [
    { title: "Physician-led care", text: "Professional review before recommendations." },
    { title: "Personalised to you", text: "No one-size-fits-all health pathway." },
    { title: "Trusted & private", text: "Discretion, clarity and continuity." },
    { title: "Science + humanity", text: "Evidence-aware, compassion-led." },
  ],
}: EditorialHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#07151d] px-4 pt-32 text-ivory md:pt-40">
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
      <div className="relative mx-auto grid min-h-[76vh] max-w-7xl items-end pb-14 md:pb-16">
        <div className={`max-w-3xl ${spokespersonName || showHealthSignals ? "lg:pr-10 xl:max-w-[760px]" : ""}`}>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-gold-light">
            {eyebrow}
          </p>
          <h1 className="text-balance font-serif text-[3.2rem] leading-[0.96] sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[5.8rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-ivory/78 sm:text-lg sm:leading-8 md:text-xl">{lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
            <ButtonLink href={secondaryHref} variant="light">
              {secondaryLabel}
            </ButtonLink>
          </div>

          {spokespersonName && spokespersonMessage ? (
            <div className="mt-7 rounded-[1.35rem] border border-white/14 bg-[#07151d]/72 p-4 backdrop-blur-xl lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-light">Your MMS guide</p>
                  <p className="mt-1 font-serif text-xl">{spokespersonName}</p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/35 bg-gold/10 text-xs font-semibold text-gold-light">
                  {spokespersonName.slice(0, 1)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-ivory/72">{spokespersonMessage}</p>
            </div>
          ) : null}
        </div>

        {spokespersonName && spokespersonMessage ? (
          <div className="absolute bottom-24 right-0 hidden w-[330px] lg:block xl:bottom-28">
            <div className="rounded-[1.7rem] border border-white/15 bg-[#07151d]/78 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold-light">Your MMS guide</p>
                  <p className="mt-1 font-serif text-2xl">{spokespersonName}</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/35 bg-gold/10 text-sm font-semibold text-gold-light">
                  {spokespersonName.slice(0, 1)}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-ivory/76">{spokespersonMessage}</p>
              <div className="mt-4 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-light/80">
                <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_14px_rgba(199,167,106,0.68)]" />
                Virtual health spokesperson
              </div>
            </div>
          </div>
        ) : null}

        {showHealthSignals ? (
          <div className={`pointer-events-none absolute right-0 hidden w-[310px] xl:block ${spokespersonName ? "bottom-[24rem]" : "bottom-28"}`}>
            <div className="rounded-[1.6rem] border border-white/15 bg-[#07151d]/72 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-light">Health intelligence</p>
                <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_18px_rgba(199,167,106,0.68)]" />
              </div>
              <div className="mt-3 grid gap-2">
                {[
                  ["Cardiovascular", "Review trend"],
                  ["Metabolic", "In range"],
                  ["Recovery", "Watch"],
                ].map(([label, state]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-white/[0.055] px-3 py-3">
                    <span className="text-xs text-ivory/72">{label}</span>
                    <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-gold-light">{state}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[0.62rem] leading-4 text-ivory/42">Illustrative member view • doctor review remains central</p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="relative z-10 mx-auto max-w-7xl border-t border-gold-light/25 bg-navy/80 shadow-[0_-18px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
        <div className="grid gap-px md:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="border-b border-ivory/10 px-4 py-4 sm:px-5 sm:py-5 md:border-b-0 md:border-r md:border-ivory/10">
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(199,167,106,0.16),transparent_32%)]" />
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
