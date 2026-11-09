"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  /** Percentage of travel. The inner layer is oversized to avoid gaps. */
  amount?: number;
};

/**
 * Image parallax via GSAP ScrollTrigger. The wrapper clips; the inner layer
 * moves. Disabled for reduced motion and on small screens.
 */
export default function Parallax({ children, className = "", amount = 12 }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrap.current || !inner.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        inner.current,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, [amount]);

  return (
    <div ref={wrap} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-x-0 will-change-transform" style={{ top: `-${amount / 2}%`, bottom: `-${amount / 2}%` }}>
        {children}
      </div>
    </div>
  );
}
