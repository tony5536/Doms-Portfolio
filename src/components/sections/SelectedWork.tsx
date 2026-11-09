import { projects } from "@/data/projects";
import WorkReel from "@/components/portfolio/WorkReel";
import ProjectIndex from "@/components/portfolio/ProjectIndex";
import SectionHeader, { SectionLabel } from "@/components/ui/SectionHeader";

export default function SelectedWork() {
  return (
    <section id="work" className="relative bg-ink pt-[var(--section-y)]" aria-labelledby="work-title">
      <SectionHeader
        id="work-title"
        index="01"
        label="Selected Work"
        aside={`${String(projects.length).padStart(2, "0")} projects`}
        title="Selected Work"
        intro="A collection of frames, stories and visual experiences."
      />

      <WorkReel projects={projects} />

      <div className="mt-block pb-[var(--section-y)]">
        <SectionLabel index="Index" label="All projects" className="mx-[var(--edge)]" />
        <ProjectIndex projects={projects} />
      </div>
    </section>
  );
}
