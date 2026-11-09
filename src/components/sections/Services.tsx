"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import SectionHeader from "@/components/ui/SectionHeader";

/** Interactive typographic list. Hovering a service reveals a framed preview that trails the pointer. */
export default function Services() {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });
  const services = siteConfig.services;

  return (
    <section id="services" className="section-y relative bg-ink-2" aria-labelledby="services-title">
      <SectionHeader id="services-title" index="05" label="Services" title="What I Do" intro="From the first frame to the final grade." />

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
            className="group relative border-t border-line last:border-b"
          >
            <div
              className={`grid grid-cols-12 items-center gap-4 py-6 transition-opacity duration-500 md:py-8 ${
                active !== null && active !== i ? "md:opacity-25" : ""
              }`}
            >
              <span className="col-span-2 font-mono text-xs text-ash md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="col-span-10 md:col-span-10">
                <span className="relative block overflow-hidden text-h3 leading-[1.05]">
                  <span
                    className={`block font-medium uppercase tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                      active === i ? "md:-translate-y-full" : ""
                    }`}
                  >
                    {s.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`serif-italic absolute inset-0 block text-champagne transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                      active === i ? "translate-y-0" : "translate-y-full"
                    }`}
                  >
                    {s.title}
                  </span>
                </span>
              </h3>
              <span
                className={`col-span-1 hidden justify-self-end text-2xl text-ash transition-transform duration-700 md:block ${active === i ? "rotate-45 text-bone" : ""}`}
                aria-hidden="true"
              >
                +
              </span>
            </div>
          </li>
        ))}
      </ul>

      <motion.div className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block" style={{ x: sx, y: sy }} aria-hidden="true">
        <AnimatePresence>
          {active !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden"
              style={{ width: 300, height: 380 }}
            >
              {services.map((s, i) => (
                <Image
                  key={s.title}
                  src={s.image}
                  alt=""
                  fill
                  sizes="300px"
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
