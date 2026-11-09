"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";
import { useIsClient } from "@/lib/client";

export type LightboxImage = { src: string; width: number; height: number; alt: string; caption?: string };

type Props = {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

/**
 * Full-screen image viewer: arrows / buttons / swipe to navigate,
 * Escape to close, neighbours preloaded.
 */
export default function Lightbox({ images, index, onClose, onIndexChange }: Props) {
  const { lock, unlock } = useSmoothScroll();
  const [dir, setDir] = useState(0);
  const mounted = useIsClient();
  const touch = useRef<{ x: number; y: number } | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const count = images.length;

  // Ref keeps rapid key repeats from reading a stale index between renders.
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const go = useCallback(
    (step: number) => {
      const current = indexRef.current;
      if (current === null) return;
      const nextIndex = (current + step + count) % count;
      indexRef.current = nextIndex;
      setDir(step);
      onIndexChange(nextIndex);
    },
    [count, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    lock();
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    return () => {
      unlock();
      prev?.focus?.();
    };
  }, [open, lock, unlock]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  if (!mounted) return null;
  const img = index !== null ? images[index] : null;

  return createPortal(
    <AnimatePresence>
      {open && img && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[400] bg-ink/97"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          data-lenis-prevent
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            if (!touch.current) return;
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            else if (dy > 90) onClose();
            touch.current = null;
          }}
        >
          {/* top bar */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-gutter py-5">
            <span className="eyebrow tabular-nums !text-bone">
              {String(index! + 1).padStart(2, "0")} <span className="text-ash">/ {String(count).padStart(2, "0")}</span>
            </span>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              className="group flex items-center gap-3 text-[12px] uppercase tracking-[0.24em]"
              data-cursor="Close"
            >
              <span className="hidden sm:inline">Close</span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors duration-500 group-hover:border-bone">
                <span className="absolute h-px w-4 rotate-45 bg-bone transition-transform duration-500 group-hover:rotate-[135deg]" />
                <span className="absolute h-px w-4 -rotate-45 bg-bone transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </button>
          </div>

          {/* image */}
          <div className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-20 md:px-28">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={img.src}
                custom={dir}
                className="relative h-full w-full"
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={img.src} alt={img.alt} fill sizes="100vw" quality={90} className="object-contain" priority />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* preload neighbours */}
          <div className="hidden" aria-hidden="true">
            {[1, -1].map((s) => {
              const n = images[(index! + s + count) % count];
              return <Image key={s} src={n.src} alt="" width={n.width} height={n.height} sizes="100vw" quality={90} loading="eager" />;
            })}
          </div>

          {/* caption + controls */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-gutter py-5">
            <p className="eyebrow truncate pr-4">{img.caption ?? img.alt}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-bone">
                <ChevronLeft className="h-4 w-4" strokeWidth={1.25} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-bone">
                <ChevronRight className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>

          {/* large invisible hit areas on desktop */}
          <button type="button" aria-hidden="true" tabIndex={-1} data-cursor="Prev" className="absolute bottom-20 left-0 top-20 hidden w-1/4 md:block" onClick={() => go(-1)} />
          <button type="button" aria-hidden="true" tabIndex={-1} data-cursor="Next" className="absolute bottom-20 right-0 top-20 hidden w-1/4 md:block" onClick={() => go(1)} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
