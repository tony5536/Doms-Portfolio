"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useRevealOnce } from "@/lib/useRevealOnce";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** "fade" = fade+rise; "clip" = cinematic wipe from bottom. */
  variant?: "fade" | "clip";
};

export default function Reveal({ children, className, delay = 0, y = 40, variant = "fade" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRevealOnce(ref);

  if (reduce) return <div className={className}>{children}</div>;

  if (variant === "clip") {
    // The observed wrapper stays unclipped: IntersectionObserver honours the
    // target's own clip-path, so a fully clipped element would never "enter".
    const inner: Variants = {
      hidden: { clipPath: "inset(100% 0% 0% 0%)" },
      show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, delay, ease: [0.76, 0, 0.24, 1] } },
    };
    return (
      <motion.div ref={ref} className={className} initial="hidden" animate={shown ? "show" : "hidden"}>
        <motion.div variants={inner}>{children}</motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
