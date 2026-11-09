"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";
import { useIsClient } from "@/lib/client";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Local mp4 path OR a Vimeo / YouTube URL. */
  src: string;
  title: string;
};

const isEmbed = (src: string) => /vimeo\.com|youtube\.com|youtu\.be/.test(src);

function embedUrl(src: string) {
  const url = new URL(src);
  url.searchParams.set("autoplay", "1");
  if (/youtu/.test(src)) url.searchParams.set("rel", "0");
  if (/vimeo/.test(src)) url.searchParams.set("dnt", "1");
  return url.toString();
}

/** Immersive fullscreen player with custom close, Escape support and scroll lock. */
export default function VideoModal({ open, onClose, src, title }: Props) {
  const { lock, unlock } = useSmoothScroll();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(false);
  const mounted = useIsClient();

  const close = useCallback(() => {
    setFailed(false); // retry next time it opens
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    lock();
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, close, lock, unlock]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-ink"
          initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(50% 0% 50% 0%)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          data-lenis-prevent
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-gutter py-5 md:py-7">
            <span className="meta !text-bone/80">{title}</span>
            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              data-cursor="Close"
              className="group flex items-center gap-3 text-[12px] uppercase tracking-[0.24em]"
            >
              <span className="hidden sm:inline">Close</span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors duration-500 group-hover:border-bone">
                <span className="absolute h-px w-4 rotate-45 bg-bone transition-transform duration-500 group-hover:rotate-[135deg]" />
                <span className="absolute h-px w-4 -rotate-45 bg-bone transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </button>
          </div>

          <motion.div
            className="relative aspect-video w-full max-w-[min(100vw,calc((100svh-9rem)*16/9))]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.8 } }}
            exit={{ opacity: 0 }}
          >
            {failed || !src ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 border border-line px-6 text-center">
                <p className="serif text-3xl md:text-5xl">Coming soon.</p>
                <p className="meta max-w-md">
                  Video not available yet — add the file at <span className="text-bone">{src || "the configured path"}</span> or set an embed URL in siteConfig.
                </p>
              </div>
            ) : isEmbed(src) ? (
              <iframe
                src={embedUrl(src)}
                title={title}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={src} className="h-full w-full bg-black" controls autoPlay playsInline onError={() => setFailed(true)} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
