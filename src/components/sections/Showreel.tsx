"use client";

import Image from "@/components/ui/Img";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import TextReveal from "@/components/animations/TextReveal";
import VideoModal from "@/components/portfolio/VideoModal";
import { SectionLabel } from "@/components/ui/SectionHeader";

/** Full-bleed reel frame that opens from a "screen" in the dark as it scrolls in. */
export default function Showreel() {
  const [open, setOpen] = useState(false);
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { media } = siteConfig;
  const src = media.showreelEmbed || media.showreelVideo;

  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const clip = useTransform(inset, (v) => `inset(${v}% ${v}% ${v}% ${v}%)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1.02]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <section id="showreel" ref={section} className="section-y relative bg-ink" aria-labelledby="showreel-title">
      <SectionLabel index="02" label="Showreel" className="mx-[var(--edge)]" />

      <motion.div style={reduce ? undefined : { clipPath: clip }} className="relative">
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-cursor="Play"
          className="group relative block aspect-[4/5] w-full overflow-hidden bg-ink-3 sm:aspect-video md:aspect-[2/1] 2xl:aspect-[2.39/1]"
          aria-label="Play showreel"
        >
          <motion.div className="absolute inset-0" style={reduce ? undefined : { scale }}>
            <Image src={media.showreelCover.src} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-ink/50 transition-colors duration-1000 group-hover:bg-ink/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-gutter text-center">
            <h2 id="showreel-title" className="display text-h2">
              <TextReveal as="span" text="The Art of Seeing." className="block" />
            </h2>
            <p className="serif mt-5 max-w-[30ch] text-lead text-bone/85">A selection of visual stories, moments and movements.</p>
            <span className="mt-10 flex items-center gap-4">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-bone/60 transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:border-bone group-hover:bg-bone md:h-20 md:w-20">
                <svg viewBox="0 0 24 24" className="ml-1 h-4 w-4 fill-bone transition-colors duration-500 group-hover:fill-ink" aria-hidden="true">
                  <path d="M6 4l14 8-14 8z" />
                </svg>
              </span>
              <span className="meta !text-bone">Play reel</span>
            </span>
          </div>
        </button>
      </motion.div>

      <VideoModal open={open} onClose={close} src={src} title={`Showreel — ${siteConfig.name}`} />
    </section>
  );
}
