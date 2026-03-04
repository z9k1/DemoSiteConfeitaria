type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-2">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-400">{eyebrow}</p> : null}
      <h2 className="font-serifDisplay text-4xl text-cocoa-900">{title}</h2>
      {subtitle ? <p className="text-sm text-cocoa-700 sm:text-base">{subtitle}</p> : null}
    </div>
  );
}
