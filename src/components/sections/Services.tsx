"use client";

import Image from "@/components/ui/Img";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import SectionHeader from "@/components/ui/SectionHeader";

/** Disciplines as a typographic list; a still trails the pointer on hover (desktop). */
export default function Services() {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });
  const services = siteConfig.services;

  return (
    <section id="services" className="section-y relative bg-ink-2" aria-labelledby="services-title">
      <SectionHeader
        id="services-title"
        index="05"
        label="Services"
        aside={`${String(services.length).padStart(2, "0")} disciplines`}
        title="What I Do"
        intro="From the first frame to the final grade."
      />

      <ul
        className="relative px-gutter"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          x.set(e.clientX);
          y.set(e.clientY);
        }}
        onPointerLeave={() => setActive(null)}
      >
        {services.map((s, i) => (
          <li
            key={s.title}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            className="border-b border-line first:border-t"
          >
            <div
              className={`grid grid-cols-12 items-baseline gap-4 py-5 transition-opacity duration-500 md:py-7 ${
                active !== null && active !== i ? "md:opacity-30" : ""
              }`}
            >
              <span className="meta col-span-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="col-span-10 md:col-span-11">
                <span
                  className={`display inline-block text-h3 transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                    active === i ? "md:translate-x-4" : ""
                  }`}
                >
                  {s.title}
                </span>
              </h3>
            </div>
          </li>
        ))}
      </ul>

      <motion.div className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block" style={{ x: sx, y: sy }} aria-hidden="true">
        <AnimatePresence>
          {active !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative -translate-y-1/2 translate-x-10 overflow-hidden"
              style={{ width: 280, height: 350 }}
            >
              {services.map((s, i) => (
                <Image
                  key={s.title}
                  src={s.image}
                  alt=""
                  fill
                  sizes="280px"
                  className={`object-cover transition-[opacity,transform] duration-700 ${active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
