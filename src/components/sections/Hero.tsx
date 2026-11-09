"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { useIntroDone } from "@/lib/intro";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;

function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let raf = 0;
    let lastFrame = -1;
    const p = (n: number) => String(n).padStart(2, "0");
    const tick = (now: number) => {
      const frames = Math.floor(((now - start) / 1000) * 24);
      if (frames !== lastFrame && ref.current) {
        lastFrame = frames;
        const f = frames % 24;
        const s = Math.floor(frames / 24);
        ref.current.textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(f)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span ref={ref} className="tabular-nums">
      00:00:00:00
    </span>
  );
}

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time ? `${time} IST` : "IST"}</span>;
}

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const { scrollTo } = useSmoothScroll();
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { media } = siteConfig;

  // Only mount the background video on larger screens, with motion allowed.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setShowVideo(Boolean(media.heroVideo) && mq.matches && !conn?.saveData);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [media.heroVideo]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const frameY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.85]);

  const show = ready || reduce;
  const letter = (i: number, base = 0) => ({
    initial: reduce ? false : { y: "105%" },
    animate: show ? { y: "0%" } : undefined,
    transition: { duration: 1.4, delay: base + i * 0.05, ease },
  });
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.2, delay, ease },
  });

  return (
    <section id="top" ref={section} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink" aria-label="Introduction">
      {/* ── Background ── */}
      <motion.div className="absolute inset-0" style={reduce ? undefined : { scale: bgScale }}>
        {/* Mobile: the portrait is the opening frame */}
        <Image
          src={media.portrait.src}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 1px, 100vw"
          className="object-cover object-[50%_25%] md:hidden"
        />
        {/* Desktop: still (poster) → video when available */}
        <div className="absolute inset-0 hidden md:block">
          <Image src={media.heroPoster} alt="" fill sizes="100vw" className="animate-kenburns object-cover opacity-80" />
          {showVideo && (
            <video
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${videoReady ? "opacity-100" : "opacity-0"}`}
              src={media.heroVideo}
              poster={media.heroPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              onCanPlay={() => setVideoReady(true)}
              onError={() => setShowVideo(false)}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,8,8,0.85)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" />
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: veil }} />

      {/* ── Portrait frame (desktop) ── */}
      <motion.figure
        className="absolute right-[var(--edge)] top-[18%] hidden w-[min(26vw,400px)] md:block"
        style={reduce ? undefined : { y: frameY }}
        initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
        animate={show ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.6, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="relative aspect-[635/845] overflow-hidden bg-ink-2">
          <Image
            src={media.portrait.src}
            alt={media.portrait.alt}
            fill
            priority
            sizes="(min-width: 768px) 400px, 1px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        </div>
        <figcaption className="mt-3 flex justify-between">
          <span className="eyebrow">Fig. 01</span>
          <span className="eyebrow">{siteConfig.name}</span>
        </figcaption>
      </motion.figure>

      {/* ── Viewfinder UI ── */}
      <motion.div className="pointer-events-none absolute inset-0" {...fade(0.9)}>
        <div className="absolute inset-x-[var(--edge)] top-20 flex justify-between md:top-28">
          <span className="eyebrow flex items-center gap-2 !text-bone/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c4523f] animate-blink" />
            Rec <span className="hidden sm:inline">·</span> <span className="hidden sm:inline"><Timecode /></span>
          </span>
          <span className="eyebrow text-right !text-bone/80">
            {siteConfig.location.city}, {siteConfig.location.country}
            <span className="hidden sm:inline"> · <LocalTime /></span>
          </span>
        </div>
        {/* corner marks */}
        <div className="absolute inset-[calc(var(--gutter)*0.6)] hidden md:block">
          {["left-0 top-14 border-l border-t", "right-0 top-14 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
            <span key={c} className={`absolute h-6 w-6 border-bone/40 ${c}`} />
          ))}
        </div>
      </motion.div>

      {/* ── Title ── */}
      <motion.div
        className="absolute inset-x-0 bottom-0 px-gutter pb-24 md:pb-16"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p className="eyebrow mb-6 !text-champagne md:mb-8" {...fade(0.5)}>
          {siteConfig.titles.join(" / ")}
        </motion.p>

        <h1 className="relative" aria-label={siteConfig.name}>
          <span aria-hidden="true" className="display block overflow-hidden text-hero">
            {siteConfig.firstName.toUpperCase().split("").map((ch, i) => (
              <motion.span key={i} className="inline-block will-change-transform" {...letter(i)}>
                {ch}
              </motion.span>
            ))}
          </span>
          <span aria-hidden="true" className="-mt-[0.06em] block overflow-hidden pb-[0.12em] md:ml-[12vw]">
            <motion.span
              className="serif-italic inline-block text-hero text-bone/95"
              {...letter(0, 0.3)}
            >
              {siteConfig.lastName}
            </motion.span>
          </span>
        </h1>

        <div className="mt-6 flex items-end justify-between gap-8 md:mt-10">
          <motion.p className="serif-italic max-w-[22ch] text-quote text-bone/85" {...fade(0.9)}>
            &ldquo;{siteConfig.tagline}&rdquo;
          </motion.p>

          <motion.button
            type="button"
            onClick={() => scrollTo("#work")}
            className="group pointer-events-auto hidden shrink-0 flex-col items-center gap-3 sm:flex"
            aria-label="Scroll to selected work"
            {...fade(1.1)}
          >
            <span className="eyebrow [writing-mode:vertical-rl]">Scroll</span>
            <span className="relative block h-16 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/3 bg-bone animate-scroll-cue" />
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* mobile scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:hidden" aria-hidden="true">
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/3 bg-bone animate-scroll-cue" />
        </span>
      </div>
    </section>
  );
}
