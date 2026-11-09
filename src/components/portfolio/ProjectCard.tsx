"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import Parallax from "@/components/animations/Parallax";
import Reveal from "@/components/animations/Reveal";
import PlaceholderTag from "@/components/ui/PlaceholderTag";

type Props = {
  project: Project;
  index: number;
  /** Tailwind aspect class for the frame, chosen by the exhibition layout. */
  aspect: string;
  sizes: string;
  /** Visual weight of the title. */
  size?: "xl" | "lg" | "md";
  /** Image runs edge-to-edge; caption keeps the page gutter. */
  bleed?: boolean;
};

/**
 * One exhibit: the frame (parallax image + optional hover video)
 * and an editorial caption block — not a card.
 */
export default function ProjectCard({ project, index, aspect, sizes, size = "lg", bleed = false }: Props) {
  const pad = bleed ? "px-gutter" : "";
  const video = useRef<HTMLVideoElement>(null);
  const num = String(index + 1).padStart(2, "0");
  // Two steps from the shared scale: the full-bleed lead exhibit, and everything else.
  const titleSize = size === "xl" ? "text-statement" : "text-h3";

  return (
    <article className="group">
      <Link
        href={`/work/${project.slug}`}
        data-cursor="View"
        className="block"
        onPointerEnter={() => video.current?.play().catch(() => {})}
        onPointerLeave={() => video.current?.pause()}
        aria-label={`${project.title} — ${project.category}, ${project.year}`}
      >
        <Reveal variant="clip">
          <div className={`relative overflow-hidden bg-ink-2 ${aspect}`}>
            <div className="absolute inset-0 transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.045]">
              <Parallax className="h-full w-full" amount={14}>
                <Image src={project.cover.src} alt={project.cover.alt} fill sizes={sizes} className="object-cover" />
              </Parallax>
              {project.previewVideo && (
                <video
                  ref={video}
                  src={project.previewVideo}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-ink/10 transition-colors duration-700 group-hover:bg-ink/0" />
            <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.2em] text-bone/80 md:left-6 md:top-6">{num}</span>
            {project.placeholder && <PlaceholderTag className="absolute right-4 top-4 bg-ink/60 md:right-6 md:top-6" />}
          </div>
        </Reveal>

        <div className={`mt-5 grid grid-cols-[1fr_auto] items-start gap-x-6 md:mt-7 ${pad}`}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="eyebrow !text-champagne">{project.category}</span>
            <span className="h-px w-6 bg-line" />
            <span className="eyebrow">{project.year}</span>
          </div>
          <ArrowUpRight
            className="row-span-2 h-6 w-6 text-ash transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-45 group-hover:text-bone md:h-8 md:w-8"
            strokeWidth={1}
          />
          <h3 className={`display mt-3 ${titleSize}`}>
            <span className="relative inline-block">
              {project.title}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-bone transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
            </span>
          </h3>
        </div>
        <p className={`mt-4 max-w-[46ch] text-body text-ash ${pad} ${bleed ? "box-content" : ""}`}>{project.summary}</p>
      </Link>
    </article>
  );
}
