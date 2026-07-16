type DisclaimerBoxProps = {
  title?: string;
  children?: React.ReactNode;
};

export function DisclaimerBox({
  title = "Important medical disclaimer",
  children,
}: DisclaimerBoxProps) {
  return (
    <aside className="rounded-lg border border-gold-light bg-warm-white p-6 text-sm leading-7 text-charcoal">
      <h3 className="mb-2 font-serif text-xl text-navy">{title}</h3>
      {children ?? (
        <p>
          Information on this website is general education only. Services are subject to discovery discussion,
          professional review and suitability assessment. Individual outcomes vary.
        </p>
      )}
    </aside>
  );
}
