import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";

/** Editorial rule: hairline with the section number and name sitting on it. */
export function SectionLabel({ index, label, aside, className = "" }: { index: string; label: string; aside?: string; className?: string }) {
  return (
    <Reveal className={`mb-10 flex items-baseline justify-between gap-6 border-t border-line pt-4 md:mb-14 ${className}`}>
      <span className="meta">
        <span className="text-bone">({index})</span>
        <span className="ml-3">{label}</span>
      </span>
      {aside && <span className="meta">{aside}</span>}
    </Reveal>
  );
}

type Props = {
  index: string;
  label: string;
  title: string;
  intro?: string;
  aside?: string;
  id?: string;
};

/** Section opener: rule, wide title, a short line of serif. Owns the gap to the content. */
export default function SectionHeader({ index, label, title, intro, aside, id }: Props) {
  return (
    <header className="mb-header px-gutter">
      <SectionLabel index={index} label={label} aside={aside} />
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <TextReveal as="h2" text={title} className="display text-h2 md:col-span-8" {...(id ? { id } : {})} />
        {intro && (
          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9 md:pb-2">
            <p className="serif max-w-[26ch] text-lead text-bone/75">{intro}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
