import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";

/** "02 —— Showreel" label used at the top of every section. */
export function SectionLabel({ index, label, className = "" }: { index: string; label: string; className?: string }) {
  return (
    <Reveal className={`mb-10 flex items-center gap-4 md:mb-14 ${className}`}>
      <span className="eyebrow !text-champagne">{index}</span>
      <span className="h-px w-12 bg-line" />
      <span className="eyebrow">{label}</span>
    </Reveal>
  );
}

type Props = {
  index: string;
  label: string;
  title: string;
  intro?: string;
  id?: string;
};

/**
 * Editorial section opener: label, oversized title, serif intro.
 * Owns the gap to the section content so every section matches.
 */
export default function SectionHeader({ index, label, title, intro, id }: Props) {
  return (
    <header className="mb-header px-gutter">
      <SectionLabel index={index} label={label} />
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <TextReveal as="h2" text={title} className="display text-h2 md:col-span-9" {...(id ? { id } : {})} />
        {intro && (
          <Reveal delay={0.2} className="md:col-span-3 md:pb-3">
            <p className="serif-italic text-lead text-bone/80">{intro}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
