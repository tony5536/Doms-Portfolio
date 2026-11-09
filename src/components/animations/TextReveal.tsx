"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { createElement, useRef, type ElementType } from "react";
import { useRevealOnce } from "@/lib/useRevealOnce";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Split per word (default) or per line using "\n" in the text. */
  by?: "word" | "line";
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** Optional class applied to each word/line. */
  itemClassName?: string;
  id?: string;
};

const item: Variants = {
  hidden: { y: "110%", rotate: 2 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

/** Masked word/line reveal. Text stays in the DOM for SEO and screen readers. */
export default function TextReveal({
  text,
  as = "p",
  className,
  by = "word",
  delay = 0,
  stagger = 0.06,
  immediate = false,
  itemClassName = "",
  id,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useRevealOnce(ref, "-12%");
  const parts = by === "line" ? text.split("\n") : text.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const inner = (
    <motion.span
      ref={ref}
      className="inline"
      variants={container}
      initial={reduce ? "show" : "hidden"}
      animate={immediate || inView ? "show" : "hidden"}
    >
      {parts.map((part, i) => (
        <span
          key={i}
          className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${by === "line" ? "block" : ""}`}
        >
          <motion.span variants={item} className={`inline-block origin-bottom-left will-change-transform ${itemClassName}`}>
            {part}
            {by === "word" && i < parts.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );

  return createElement(as, { id, className, "aria-label": text }, <span aria-hidden="true">{inner}</span>);
}
