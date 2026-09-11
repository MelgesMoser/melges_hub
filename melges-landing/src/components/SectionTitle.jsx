export default function SectionTitle({ eyebrow, title, subtitle, align = "center" }) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignment} gap-4`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-sm leading-relaxed text-white/50 md:text-base">{subtitle}</p>
      )}
    </div>
  );
}
