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
      <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-5 text-lg leading-8 text-warm-gray">{description}</p> : null}
    </div>
  );
}
