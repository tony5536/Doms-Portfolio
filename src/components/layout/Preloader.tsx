"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { markIntroDone } from "@/lib/intro";
import { siteConfig } from "@/data/siteConfig";

export const INTRO_KEY = "dx-intro-seen";

/**
 * Runs before hydration (inlined in <head>): returning visitors in the same
 * session, and reduced-motion users, never see the slate — not even a flash.
 */
export const introScript = `try{if(sessionStorage.getItem("${INTRO_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

/**
 * Opening slate: a frame counter, then the "letterbox" splits open.
 * Plays once per browser session.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      markIntroDone();
      return;
    }

    const start = performance.now();
    const duration = 1500;
    let raf = 0;
    let timer = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      timer = window.setTimeout(() => {
        setVisible(false);
        markIntroDone();
      }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <noscript>
        <style>{`#dx-preloader{display:none!important}`}</style>
      </noscript>
      <AnimatePresence>
        {visible && (
          <motion.div id="dx-preloader" className="fixed inset-0 z-[250]" aria-hidden="true" exit={{ pointerEvents: "none" }}>
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 bg-ink"
              exit={{ y: "-100%" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
              exit={{ y: "100%" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center px-gutter"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-px w-[min(60vw,420px)] bg-line">
                <div className="absolute inset-y-0 left-0 bg-champagne" style={{ width: `${count}%` }} />
              </div>
              <div className="mt-6 flex w-[min(60vw,420px)] justify-between">
                <span className="eyebrow">{siteConfig.name}</span>
                <span className="eyebrow tabular-nums text-bone">{String(count).padStart(3, "0")}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
