"use client";

import Image from "@/components/ui/Img";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/data/projects";

/** Typographic index of all projects; on desktop a still trails the pointer. */
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 140, damping: 20, mass: 0.5 });

  return (
    <div
      className="relative px-gutter"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setHovered(null)}
    >
      <ul>
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-line first:border-t">
            <Link
              href={`/work/${p.slug}`}
              data-cursor="Open"
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
              className={`grid grid-cols-12 items-baseline gap-x-4 gap-y-1 py-5 transition-opacity duration-500 md:py-6 ${
                hovered !== null && hovered !== i ? "md:opacity-35" : ""
              }`}
            >
              <span className="meta col-span-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <span className="col-span-10 md:col-span-5">
                <span
                  className={`display inline-block text-[clamp(1.35rem,2.2vw,2.25rem)] leading-none transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                    hovered === i ? "md:translate-x-3" : ""
                  }`}
                >
                  {p.title}
                </span>
              </span>
              <span className="meta col-span-10 col-start-3 md:col-span-3 md:col-start-auto">{p.category}</span>
              <span className="serif col-span-10 col-start-3 hidden text-bone/60 md:col-span-2 md:col-start-auto md:block">{p.summary.split(" ").slice(0, 4).join(" ")}…</span>
              <span className="meta hidden text-right md:col-span-1 md:block">{p.year}</span>
            </Link>
          </li>
        ))}
      </ul>

      <motion.div className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block" style={{ x: sx, y: sy }} aria-hidden="true">
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9, clipPath: "inset(50% 0% 50% 0%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, scale: 0.94, clipPath: "inset(50% 0% 50% 0%)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative -translate-y-1/2 translate-x-8 overflow-hidden"
              style={{ width: 360, height: 240 }}
            >
              {projects.map((p, i) => (
                <Image
                  key={p.slug}
                  src={p.cover.src}
                  alt=""
                  fill
                  sizes="360px"
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
