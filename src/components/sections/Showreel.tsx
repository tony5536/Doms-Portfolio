"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { Play } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import MagneticButton from "@/components/animations/MagneticButton";
import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";
import VideoModal from "@/components/portfolio/VideoModal";
import { SectionLabel } from "@/components/ui/SectionHeader";

export default function Showreel() {
  const [open, setOpen] = useState(false);
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { media } = siteConfig;
  const src = media.showreelEmbed || media.showreelVideo;

  // Frame widens from an inset "screen" to full-bleed as it scrolls in.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0, 1], ["8%", "0%"]);
  const clip = useTransform(inset, (v) => `inset(${v} ${v} ${v} ${v})`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <section id="showreel" ref={section} className="section-y relative bg-ink" aria-labelledby="showreel-title">
      <div className="mb-header grid gap-8 px-gutter md:grid-cols-12 md:items-end">
        <div className="md:col-span-9">
          <SectionLabel index="02" label="Showreel" />
          <h2 id="showreel-title" className="display text-h2">
            <TextReveal as="span" text="The Art" className="block" />
            <TextReveal as="span" text="of Seeing." className="block serif-italic normal-case tracking-[-0.02em] md:ml-[8vw]" delay={0.15} />
          </h2>
        </div>
        <Reveal delay={0.2} className="md:col-span-3 md:pb-3">
          <p className="serif-italic text-lead text-bone/80">A selection of visual stories, moments and movements.</p>
        </Reveal>
      </div>

      <motion.div style={reduce ? undefined : { clipPath: clip }} className="relative">
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-cursor="Play"
          className="group relative block aspect-[4/5] w-full overflow-hidden bg-ink-2 sm:aspect-video md:aspect-[2.39/1]"
          aria-label="Play showreel"
        >
          <motion.div className="absolute inset-0" style={reduce ? undefined : { scale }}>
            <Image
              src={media.showreelCover}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
            />
          </motion.div>
          <div className="absolute inset-0 bg-ink/40 transition-colors duration-700 group-hover:bg-ink/25" />

          {/* letterbox UI */}
          <div className="absolute inset-x-0 top-0 flex justify-between px-[var(--gutter)] py-5">
            <span className="eyebrow !text-bone/80">Reel — {siteConfig.name}</span>
            <span className="eyebrow !text-bone/80">2.39 : 1</span>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
            <MagneticButton strength={0.5}>
              <span className="relative flex h-32 w-32 items-center justify-center md:h-44 md:w-44">
                <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
                  <defs>
                    <path id="reel-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
                  </defs>
                  <text className="fill-bone font-mono text-[12.5px] uppercase" letterSpacing="5.2">
                    <textPath href="#reel-circle">Play Showreel · Play Showreel · Play Showreel ·</textPath>
                  </text>
                </svg>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110 md:h-20 md:w-20">
                  <Play className="ml-1 h-5 w-5 fill-current" strokeWidth={0} />
                </span>
              </span>
            </MagneticButton>
          </div>

          <span className="display pointer-events-none absolute bottom-4 hidden text-h3 text-bone/90 md:bottom-8 md:block" style={{ left: "var(--gutter)" }}>
            Play Showreel
          </span>
        </button>
      </motion.div>

      <VideoModal open={open} onClose={close} src={src} title={`Showreel — ${siteConfig.name}`} />
    </section>
  );
}
