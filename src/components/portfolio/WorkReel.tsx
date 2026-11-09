"use client";

import Image from "@/components/ui/Img";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

/** Keeps extreme photos from producing absurdly thin or wide frames. */
const frameRatio = (w: number, h: number) => Math.min(1.85, Math.max(0.72, w / h));

/**
 * Desktop: the section pins and the projects travel sideways like frames
 * on a strip, scrubbed by scroll. Mobile / reduced motion: a vertical list.
 */
export default function WorkReel({ projects }: { projects: Project[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
            if (counter.current) {
              const n = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1);
              counter.current.textContent = String(n).padStart(2, "0");
            }
          },
        },
      });
      // Images loading late can change widths.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => {
        window.removeEventListener("load", refresh);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, [projects.length]);

  return (
    <div ref={wrap} className="relative md:flex md:h-[100svh] md:flex-col md:justify-center md:overflow-hidden">
      <div
        ref={track}
        className="flex flex-col gap-20 px-gutter md:w-max md:flex-row md:items-end md:gap-[5vw] md:pr-[12vw] md:will-change-transform"
      >
        {projects.map((p, i) => (
          <article key={p.slug} className="group md:shrink-0">
            <Link href={`/work/${p.slug}`} data-cursor="View" className="block" aria-label={`${p.title} — ${p.category}, ${p.year}`}>
              <div
                className="relative w-full overflow-hidden bg-ink-3 md:h-[58svh] md:w-auto"
                style={{ aspectRatio: frameRatio(p.cover.width, p.cover.height) }}
              >
                <Image
                  src={p.cover.src}
                  alt={p.cover.alt}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  // Native lazy-loading doesn't see frames inside a transformed, pinned track.
                  loading="eager"
                  className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-ink/10 transition-colors duration-700 group-hover:bg-transparent" />
              </div>
              <div className="mt-5 flex items-baseline gap-5">
                <span className="meta w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h3 className="display text-h3 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                    {p.title}
                  </h3>
                  <p className="meta mt-2">
                    {p.category} <span className="px-1.5 text-smoke">·</span> {p.year}
                  </p>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* progress (desktop) */}
      <div className="mt-10 hidden items-center gap-6 px-gutter md:flex">
        <span className="meta tabular-nums !text-bone">
          <span ref={counter}>01</span>
          <span className="text-ash"> / {String(projects.length).padStart(2, "0")}</span>
        </span>
        <span className="relative h-px flex-1 bg-line">
          <span ref={progress} className="absolute inset-0 origin-left scale-x-0 bg-bone" />
        </span>
        <span className="meta">Scroll</span>
      </div>
    </div>
  );
}
