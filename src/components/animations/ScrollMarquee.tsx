"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Oversized outlined type that slides horizontally with scroll (scrubbed). */
export default function ScrollMarquee({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        track.current,
        { xPercent: reverse ? -30 : 0 },
        {
          xPercent: reverse ? 0 : -30,
          ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  }, [reverse]);

  return (
    <div ref={wrap} className="pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((k) => (
          <span
            key={k}
            className="display pr-[0.3em] text-[clamp(5rem,16vw,16rem)] text-transparent [-webkit-text-stroke:1px_rgb(245_243_239/0.18)]"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
