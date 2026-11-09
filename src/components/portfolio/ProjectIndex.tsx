"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/data/projects";

/**
 * Typographic index of all projects. On desktop a framed preview of the
 * hovered project follows the pointer.
 */
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 140, damping: 20, mass: 0.5 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <div className="relative px-gutter" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
      <div className="mb-6 grid grid-cols-12 gap-4 border-b border-line pb-4">
        <span className="eyebrow col-span-2 md:col-span-1">No.</span>
        <span className="eyebrow col-span-10 md:col-span-6">Project</span>
        <span className="eyebrow hidden md:col-span-4 md:block">Category</span>
        <span className="eyebrow hidden text-right md:col-span-1 md:block">Year</span>
      </div>
      <ul>
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-line">
            <Link
              href={`/work/${p.slug}`}
              data-cursor="Open"
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
              className={`grid grid-cols-12 items-baseline gap-4 py-5 transition-opacity duration-500 md:py-7 ${
                hovered !== null && hovered !== i ? "md:opacity-30" : ""
              }`}
            >
              <span className="col-span-2 font-mono text-xs text-ash md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <span className="col-span-10 text-h3 font-medium uppercase tracking-[-0.03em] md:col-span-6">
                <span className={`inline-block transition-transform duration-700 ease-[var(--ease-out-expo)] ${hovered === i ? "md:translate-x-6" : ""}`}>
                  {p.title}
                </span>
              </span>
              <span className="eyebrow col-span-10 col-start-3 md:col-span-4 md:col-start-auto">{p.category}</span>
              <span className="eyebrow hidden text-right md:col-span-1 md:block">{p.year}</span>
            </Link>
          </li>
        ))}
      </ul>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        style={{ x: sx, y: sy }}
        aria-hidden="true"
      >
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.85, clipPath: "inset(50% 50% 50% 50%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, scale: 0.9, clipPath: "inset(50% 50% 50% 50%)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden"
              style={{ width: 340, height: 220 }}
            >
              {projects.map((p, i) => (
                <Image
                  key={p.slug}
                  src={p.cover.src}
                  alt=""
                  fill
                  sizes="340px"
                  className={`object-cover transition-opacity duration-500 ${hovered === i ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
