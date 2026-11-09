/** Visible marker for sample content that must be replaced before launch. */
export default function PlaceholderTag({ className = "", label = "Sample entry" }: { className?: string; label?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-dashed border-champagne/50 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-champagne/90 ${className}`}
      title="Placeholder content — replace in src/data"
    >
      <span className="h-1 w-1 rounded-full bg-champagne" />
      {label}
    </span>
  );
}
