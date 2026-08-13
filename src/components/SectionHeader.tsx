type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
};

export function SectionHeader({ eyebrow, title, description, center = false }: SectionHeaderProps) {
  return (
    <div className={`mb-12 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance font-serif text-4xl leading-[1.08] text-navy md:text-[3.4rem]">
        {title}
      </h2>
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-warm-gray md:text-lg">{description}</p> : null}
    </div>
  );
}
