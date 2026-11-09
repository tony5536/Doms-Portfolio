import { projects } from "@/data/projects";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ProjectIndex from "@/components/portfolio/ProjectIndex";
import SectionHeader, { SectionLabel } from "@/components/ui/SectionHeader";
import Reveal from "@/components/animations/Reveal";

/**
 * Exhibition layout. Each slot defines where an exhibit hangs on the
 * 12-column wall, its frame proportion and its vertical offset.
 * Projects beyond the defined slots cycle through the pattern.
 */
const slots = [
  { col: "md:col-span-12", aspect: "aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9]", sizes: "100vw", size: "xl" as const, offset: "" },
  { col: "md:col-span-7", aspect: "aspect-[4/3]", sizes: "(min-width: 768px) 58vw, 100vw", size: "lg" as const, offset: "" },
  { col: "md:col-span-4 md:col-start-9", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 33vw, 100vw", size: "md" as const, offset: "md:mt-48" },
  { col: "md:col-span-9 md:col-start-3", aspect: "aspect-[16/9] md:aspect-[2.39/1]", sizes: "(min-width: 768px) 75vw, 100vw", size: "lg" as const, offset: "" },
  { col: "md:col-span-5", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 42vw, 100vw", size: "lg" as const, offset: "" },
  { col: "md:col-span-6 md:col-start-7", aspect: "aspect-[3/2]", sizes: "(min-width: 768px) 50vw, 100vw", size: "lg" as const, offset: "md:mt-64" },
];

const categories = ["Cinematography", "Commercial Films", "Short Films", "Photography", "Portraits & Fashion", "Events"];

export default function SelectedWork() {
  return (
    <section id="work" className="section-y relative bg-ink" aria-labelledby="work-title">
      <SectionHeader
        id="work-title"
        index="01"
        label="Portfolio"
        title="Selected Work"
        intro="A collection of frames, stories and visual experiences."
      />

      <Reveal className="px-gutter">
        <ul className="flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-5">
          {categories.map((c, i) => (
            <li key={c} className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] text-champagne">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[12px] uppercase tracking-[0.2em] text-bone/80">{c}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-block grid grid-cols-1 gap-x-[var(--gutter)] gap-y-[var(--block-gap)] px-gutter md:grid-cols-12">
        {projects.map((project, i) => {
          const slot = slots[i % slots.length];
          // Full-bleed first exhibit: break out of the gutter.
          const bleed = i % slots.length === 0;
          return (
            <div key={project.slug} className={`${slot.col} ${slot.offset} ${bleed ? "-mx-[var(--edge)]" : ""}`}>
              <ProjectCard project={project} index={i} aspect={slot.aspect} sizes={slot.sizes} size={slot.size} bleed={bleed} />
            </div>
          );
        })}
      </div>

      <div className="mt-block">
        <SectionLabel index="Index" label="All projects" className="px-gutter" />
        <ProjectIndex projects={projects} />
      </div>
    </section>
  );
}
