"use client";

import Image from "@/components/ui/Img";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { siteConfig } from "@/data/siteConfig";
import { useIntroDone } from "@/lib/intro";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Opening title sequence, set like a film poster around Dominic's portrait.
 * Desktop: the photo sits in a tall frame at native sharpness over a blurred,
 * darkened copy of itself; the name runs across the lower third.
 * Phones: the photo fills the screen.
 * While pinned, letterbox bars close to 2.39:1 and the title dissolves.
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const { scrollTo } = useSmoothScroll();
  const { media } = siteConfig;
  const photo = media.heroPortrait;

  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });
  const bar = useTransform(p, [0.05, 0.75], [0, 1], { clamp: true });
  const barHeight = useTransform(bar, (v) => `calc(${v} * max(0px, (100svh - 100vw / 2.39) / 2))`);
  const imgScale = useTransform(p, [0, 1], [1.04, 1]); // small range keeps the 635px photo sharp
  const titleOpacity = useTransform(p, [0, 0.35], [1, 0]);
  const titleY = useTransform(p, [0, 0.4], ["0%", "-18%"]);
  const titleSpacing = useTransform(p, [0, 0.4], ["-0.035em", "0.06em"]);
  const captionOpacity = useTransform(p, [0.6, 0.85], [0, 1]);

  const show = ready || reduce;
  const words = siteConfig.name.toUpperCase().split(" ");

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.4, delay, ease },
  });

  return (
    <section
      id="top"
      ref={section}
      className={`relative bg-ink ${reduce ? "h-[100svh]" : "h-[185svh]"}`}
      aria-label="Introduction"
    >
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
        {/* ── Frame ── */}
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { scale: imgScale }}
          initial={reduce ? false : { opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: 2.2, ease }}
        >
          {/* Ambient backdrop (desktop): the same photo, blurred and pushed into shadow */}
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="50vw"
            className="hidden scale-125 object-cover blur-3xl brightness-[0.32] saturate-[0.7] md:block"
          />
          {/* Phones: full-bleed portrait */}
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(min-width: 768px) 1px, 100vw"
            className="object-cover object-[50%_20%] brightness-[0.82] contrast-[1.05] saturate-[0.85] md:hidden"
          />
          {/* Desktop: the portrait in a tall frame, shown at native sharpness */}
          <div
            className="absolute left-1/2 top-[11svh] hidden h-[78svh] max-h-[845px] -translate-x-1/2 overflow-hidden md:block"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority
              sizes="(min-width: 768px) 640px, 1px"
              className="object-cover brightness-[0.85] contrast-[1.05] saturate-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-ink/90" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent via-40% to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,8,0.7)_100%)]" />
        </motion.div>

        {/* ── Letterbox ── */}
        {!reduce && (
          <>
            <motion.div className="absolute inset-x-0 top-0 z-10 bg-ink" style={{ height: barHeight }} />
            <motion.div className="absolute inset-x-0 bottom-0 z-10 bg-ink" style={{ height: barHeight }}>
              <motion.div className="flex h-full items-center justify-between px-gutter" style={{ opacity: captionOpacity }}>
                <span className="meta">{siteConfig.name} — {siteConfig.location.city}</span>
                <span className="meta hidden sm:inline">2.39 : 1</span>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* ── Title card ── */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col px-gutter pb-8 pt-24 md:pb-10 md:pt-28"
          style={reduce ? undefined : { opacity: titleOpacity }}
        >
          <motion.div className="flex items-start justify-between gap-6" {...fade(0.6)}>
            <p className="meta !text-bone/80">
              {siteConfig.titles.map((t, i) => (
                <span key={t} className="block sm:inline">
                  {t}
                  {i < siteConfig.titles.length - 1 && <span className="hidden px-2 text-ash sm:inline">/</span>}
                </span>
              ))}
            </p>
            <p className="meta text-right !text-bone/80">
              {siteConfig.location.city}, {siteConfig.location.country}
            </p>
          </motion.div>

          <motion.div className="flex flex-1 flex-col items-center justify-end pb-[5svh] text-center" style={reduce ? undefined : { y: titleY }}>
            <h1 aria-label={siteConfig.name}>
              <motion.span
                aria-hidden="true"
                className="display flex flex-col items-center text-[13.5vw] leading-[0.92] sm:flex-row sm:gap-[0.32em] sm:text-hero"
                style={reduce ? undefined : { letterSpacing: titleSpacing }}
              >
                {words.map((word, w) => (
                  <span key={word} className="block overflow-hidden pb-[0.04em]">
                    {word.split("").map((ch, i) => (
                      <motion.span
                        key={i}
                        className="inline-block will-change-transform"
                        initial={reduce ? false : { y: "105%" }}
                        animate={show ? { y: "0%" } : undefined}
                        transition={{ duration: 1.5, delay: 0.15 + w * 0.2 + i * 0.045, ease }}
                      >
                        {ch}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.span>
            </h1>
            <motion.p className="serif mt-6 text-quote text-bone/90 md:mt-8" {...fade(1.1)}>
              {siteConfig.tagline}
            </motion.p>
          </motion.div>

          <motion.div className="flex items-end justify-between" {...fade(1.3)}>
            <button type="button" onClick={() => scrollTo("#work", { offset: -56 })} className="group flex items-center gap-3" aria-label="Scroll to selected work">
              <span className="relative block h-10 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-1/3 bg-bone animate-scroll-cue" />
              </span>
              <span className="meta !text-bone/80 transition-colors group-hover:!text-bone">Scroll</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#showreel", { offset: -56 })}
              className="meta link-line pb-1 !text-bone"
            >
              Watch the reel
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
