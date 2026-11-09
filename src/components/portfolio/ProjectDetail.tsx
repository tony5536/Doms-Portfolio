"use client";

import Image from "@/components/ui/Img";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Fragment, useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project, ProjectImage } from "@/data/projects";
import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";
import Parallax from "@/components/animations/Parallax";
import Lightbox from "@/components/portfolio/Lightbox";
import VideoModal from "@/components/portfolio/VideoModal";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Stills are placed by orientation so no frame becomes absurdly tall:
 * landscape alternates full width / inset wide; portrait takes a narrow
 * column, alternating sides.
 */
function stillClass(img: { width: number; height: number }, landscapeIdx: number, portraitIdx: number) {
  if (img.height > img.width) return portraitIdx % 2 === 0 ? "md:col-span-5 md:col-start-1" : "md:col-span-5 md:col-start-8";
  return landscapeIdx % 2 === 0 ? "md:col-span-12" : "md:col-span-10 md:col-start-3";
}

/** Pure layout pass; the pull quote sits beside the first left-hand portrait. */
function layoutStills(gallery: ProjectImage[]) {
  let landscapeIdx = 0;
  let portraitIdx = 0;
  let quoted = false;
  return gallery.map((img) => {
    const portrait = img.height > img.width;
    const cls = stillClass(img, landscapeIdx, portraitIdx);
    const withQuote = portrait && portraitIdx % 2 === 0 && !quoted;
    if (withQuote) quoted = true;
    if (portrait) portraitIdx++;
    else landscapeIdx++;
    return { img, cls, portrait, withQuote };
  });
}

export default function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const hero = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const images = [project.cover, ...project.gallery].map((g) => ({ ...g, caption: g.alt }));

  const stills = layoutStills(project.gallery);
  const meta = [
    { k: "Category", v: project.category },
    { k: "Year", v: project.year },
    ...project.credits.slice(0, 1).map((c) => ({ k: "Role", v: c.role })),
  ];

  return (
    <article>
      {/* ── Hero ── */}
      <section ref={hero} className="relative h-[100svh] min-h-[600px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { scale: imgScale }}
          initial={reduce ? false : { clipPath: "inset(14% 10% 14% 10%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <Image src={project.cover.src} alt={project.cover.alt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/15 to-ink" />
        </motion.div>

        <motion.div className="absolute inset-x-0 bottom-0 px-gutter pb-12 md:pb-16" style={reduce ? undefined : { y: titleY, opacity: fadeOut }}>
          <motion.div
            className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease }}
          >
            <Link href="/#work" className="group flex items-center gap-2 text-sm text-bone">
              <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.25} />
              All work
            </Link>
            <span className="h-3 w-px bg-line" />
            <span className="meta !text-bone/80">{project.category}</span>
            <span className="meta">{project.year}</span>
          </motion.div>
          <TextReveal as="h1" text={project.title} immediate delay={0.4} className="display text-hero" />
        </motion.div>
      </section>

      {/* ── Overview ── */}
      <section className="section-y grid gap-14 px-gutter md:grid-cols-12 md:gap-[var(--gutter)]">
        <Reveal className="md:col-span-4">
          <dl className="grid grid-cols-2 gap-y-6 border-t border-line pt-6 md:grid-cols-1">
            {meta.map((m) => (
              <div key={m.k}>
                <dt className="meta mb-1.5">{m.k}</dt>
                <dd className="text-lead">{m.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="md:col-span-7 md:col-start-6">
          <TextReveal as="p" text={project.summary} className="serif text-statement" stagger={0.03} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-10">
            {project.description.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-body text-bone/75">{p}</p>
              </Reveal>
            ))}
          </div>

          {project.video && (
            <Reveal className="mt-12">
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="group flex items-center gap-4 text-lead"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/60 transition-colors duration-500 group-hover:bg-bone">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-bone transition-colors duration-500 group-hover:fill-ink" aria-hidden="true">
                    <path d="M6 4l14 8-14 8z" />
                  </svg>
                </span>
                Watch the film
              </button>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Stills ── */}
      <section className="grid grid-cols-1 gap-y-6 px-gutter pb-[var(--section-y)] md:grid-cols-12 md:gap-x-[var(--gutter)] md:gap-y-20" aria-label="Project stills">
        {stills.map(({ img, cls, portrait, withQuote }, i) => (
          <Fragment key={img.src}>
          <Reveal variant="clip" className={cls}>
            <button
              type="button"
              onClick={() => setLightbox(i + 1)}
              data-cursor="View"
              className="group relative block w-full overflow-hidden bg-ink-3"
              style={{ aspectRatio: `${img.width} / ${img.height}` }}
              aria-label={`Open: ${img.alt}`}
            >
              <Parallax className="h-full w-full" amount={10}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={portrait ? "(min-width: 768px) 42vw, 100vw" : "(min-width: 768px) 90vw, 100vw"}
                  className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]"
                />
              </Parallax>
            </button>
            <p className="meta mt-3">
              {String(i + 1).padStart(2, "0")} — {img.alt}
            </p>
          </Reveal>
          {withQuote && (
            <Reveal className="hidden md:col-span-5 md:col-start-8 md:flex md:items-center">
              <p className="serif text-quote text-bone/70">&ldquo;{project.summary}&rdquo;</p>
            </Reveal>
          )}
          </Fragment>
        ))}
      </section>

      {/* ── Credits, set like end titles ── */}
      <section className="px-gutter pb-[var(--section-y)]">
        <Reveal>
          <h2 className="meta mb-10 text-center">Credits</h2>
          <dl className="mx-auto max-w-2xl space-y-4">
            {project.credits.map((c) => (
              <div key={c.role} className="grid grid-cols-2 items-baseline gap-6">
                <dt className="meta text-right">{c.role}</dt>
                <dd className="credit text-[0.95rem]">{c.name}</dd>
              </div>
            ))}
          </dl>
          {project.demo && (
            <p className="meta mx-auto mt-12 max-w-md text-center">Demo project — imagery via Unsplash, copy to be replaced.</p>
          )}
        </Reveal>
      </section>

      {/* ── Next project ── */}
      <section className="border-t border-line">
        <Link href={`/work/${next.slug}`} data-cursor="Next" className="group relative block overflow-hidden px-gutter py-24 md:py-36">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
            <Image src={next.cover.src} alt="" fill sizes="100vw" className="scale-110 object-cover transition-transform duration-[2s] group-hover:scale-100" />
            <div className="absolute inset-0 bg-ink/60" />
          </div>
          <div className="relative">
            <p className="meta mb-6 flex items-center gap-2">
              Next project <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.25} />
            </p>
            <p className="display text-h2 transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:translate-x-4">{next.title}</p>
            <p className="meta mt-4">{next.category}</p>
          </div>
        </Link>
      </section>

      <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} onIndexChange={setLightbox} />
      {project.video && <VideoModal open={videoOpen} onClose={closeVideo} src={project.video} title={project.title} />}
    </article>
  );
}
