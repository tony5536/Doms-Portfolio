"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";
import Parallax from "@/components/animations/Parallax";
import MagneticButton from "@/components/animations/MagneticButton";
import Lightbox from "@/components/portfolio/Lightbox";
import VideoModal from "@/components/portfolio/VideoModal";
import PlaceholderTag from "@/components/ui/PlaceholderTag";

const ease = [0.16, 1, 0.3, 1] as const;

/** Layout pattern for the stills — alternating full, offset and paired frames. */
const stillLayout = [
  "md:col-span-12",
  "md:col-span-5 md:col-start-2 md:mt-24",
  "md:col-span-10 md:col-start-3",
];

export default function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const hero = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const images = [project.cover, ...project.gallery].map((g) => ({ ...g, caption: `${project.title} — ${g.alt}` }));
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
          initial={reduce ? false : { clipPath: "inset(12% 8% 12% 8%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <Image src={project.cover.src} alt={project.cover.alt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/10 to-ink" />
        </motion.div>

        <motion.div className="absolute inset-x-0 bottom-0 px-gutter pb-14 md:pb-20" style={reduce ? undefined : { y: titleY, opacity: fadeOut }}>
          <motion.div
            className="mb-8 flex flex-wrap items-center gap-4"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease }}
          >
            <Link href="/#work" className="group eyebrow flex items-center gap-2 !text-bone">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.25} />
              All work
            </Link>
            <span className="h-px w-10 bg-line" />
            <span className="eyebrow !text-champagne">{project.category}</span>
            <span className="eyebrow">{project.year}</span>
            {project.placeholder && <PlaceholderTag />}
          </motion.div>
          <TextReveal as="h1" text={project.title} immediate delay={0.4} className="display text-h2" />
        </motion.div>
      </section>

      {/* ── Overview ── */}
      <section className="section-y grid gap-14 px-gutter md:grid-cols-12 md:gap-[var(--gutter)]">
        <Reveal className="md:col-span-4">
          <dl className="grid grid-cols-2 gap-y-8 border-t border-line pt-8 md:grid-cols-1">
            {meta.map((m) => (
              <div key={m.k}>
                <dt className="eyebrow mb-2">{m.k}</dt>
                <dd className="text-lg uppercase tracking-[-0.01em]">{m.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="md:col-span-7 md:col-start-6">
          <TextReveal as="p" text={project.summary} className="serif-italic text-quote" stagger={0.03} />
          <div className="mt-12 space-y-5 md:columns-2 md:gap-10 md:space-y-0">
            {project.description.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="mb-5 text-body text-bone/75">{p}</p>
              </Reveal>
            ))}
          </div>

          {project.video && (
            <Reveal className="mt-12">
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="group flex items-center gap-4 rounded-full border border-line py-2 pl-2 pr-6 text-[12px] uppercase tracking-[0.22em] transition-colors hover:border-bone"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bone text-ink">
                    <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={0} />
                  </span>
                  Watch the film
                </button>
              </MagneticButton>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Stills ── */}
      <section className="grid grid-cols-1 gap-y-6 px-gutter pb-[var(--section-y)] md:grid-cols-12 md:gap-x-[var(--gutter)] md:gap-y-16" aria-label="Project stills">
        {project.gallery.map((img, i) => {
          const isPairRight = i % 3 === 1;
          return (
            <Reveal key={img.src} variant="clip" className={`${stillLayout[i % stillLayout.length]} ${isPairRight ? "" : ""}`}>
              <button
                type="button"
                onClick={() => setLightbox(i + 1)}
                data-cursor="View"
                className="group relative block w-full overflow-hidden bg-ink-2"
                style={{ aspectRatio: `${img.width} / ${img.height}` }}
                aria-label={`Open ${img.alt}`}
              >
                <Parallax className="h-full w-full" amount={10}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={i % 3 === 1 ? "(min-width: 768px) 42vw, 100vw" : "(min-width: 768px) 85vw, 100vw"}
                    className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                </Parallax>
              </button>
              <p className="eyebrow mt-3">
                {String(i + 1).padStart(2, "0")} — {img.alt}
              </p>
            </Reveal>
          );
        })}
        {project.gallery.length > 1 && (
          <Reveal className="hidden md:col-span-5 md:col-start-8 md:row-start-2 md:flex md:items-end">
            <p className="serif-italic text-quote text-bone/70">&ldquo;{project.summary}&rdquo;</p>
          </Reveal>
        )}
      </section>

      {/* ── Credits ── */}
      <section className="px-gutter pb-[var(--section-y)]">
        <Reveal className="mb-10 flex items-center gap-4">
          <span className="eyebrow !text-champagne">Credits</span>
          <span className="h-px w-12 bg-line" />
        </Reveal>
        <ul className="grid md:grid-cols-2 md:gap-x-[var(--gutter)]">
          {project.credits.map((c) => (
            <li key={c.role} className="flex items-baseline justify-between gap-6 border-t border-line py-5">
              <span className="eyebrow">{c.role}</span>
              <span className="text-right text-lg uppercase tracking-[-0.01em]">{c.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Next project ── */}
      <section className="border-t border-line">
        <Link href={`/work/${next.slug}`} data-cursor="Next" className="group relative block overflow-hidden px-gutter section-y">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
            <Image src={next.cover.src} alt="" fill sizes="100vw" className="scale-110 object-cover transition-transform duration-[2s] group-hover:scale-100" />
            <div className="absolute inset-0 bg-ink/60" />
          </div>
          <div className="relative">
            <p className="eyebrow mb-6 flex items-center gap-3">
              Next project <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.25} />
            </p>
            <p className="display text-h2 transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:translate-x-4">
              {next.title}
            </p>
            <p className="eyebrow mt-4 !text-champagne">{next.category}</p>
          </div>
        </Link>
      </section>

      <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} onIndexChange={setLightbox} />
      {project.video && <VideoModal open={videoOpen} onClose={closeVideo} src={project.video} title={project.title} />}
    </article>
  );
}
