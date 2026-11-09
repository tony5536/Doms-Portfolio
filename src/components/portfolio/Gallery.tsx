"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState, type ReactNode } from "react";
import { useRevealOnce } from "@/lib/useRevealOnce";
import { galleryCategories, type GalleryImage } from "@/data/gallery";
import Lightbox from "@/components/portfolio/Lightbox";
import PlaceholderTag from "@/components/ui/PlaceholderTag";

type Filter = "All" | (typeof galleryCategories)[number];

const GalleryFigure = forwardRef<HTMLElement, { index: number; children: ReactNode }>(function GalleryFigure({ index, children }, forwarded) {
  const ref = useRef<HTMLElement>(null);
  useImperativeHandle(forwarded, () => ref.current as HTMLElement);
  const shown = useRevealOnce(ref, "-8%");
  return (
    <motion.figure
      ref={ref}
      layout
      initial={{ opacity: 0, clipPath: "inset(18% 0% 0% 0%)" }}
      animate={shown ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 1.2, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group mb-[clamp(0.75rem,1.6vw,1.75rem)] break-inside-avoid ${index % 5 === 2 ? "lg:mt-16" : ""}`}
    >
      {children}
    </motion.figure>
  );
});

/** Editorial masonry with category filter and full-screen lightbox. */
export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [index, setIndex] = useState<number | null>(null);

  const visible = useMemo(() => (filter === "All" ? images : images.filter((i) => i.category === filter)), [filter, images]);
  const filters: Filter[] = ["All", ...galleryCategories.filter((c) => images.some((i) => i.category === c))];

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-x-2 gap-y-3 px-gutter md:mb-16" role="toolbar" aria-label="Filter photographs">
        {filters.map((f) => {
          const count = f === "All" ? images.length : images.filter((i) => i.category === f).length;
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`group relative rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                active ? "border-bone bg-bone text-ink" : "border-line text-bone/75 hover:border-bone/60 hover:text-bone"
              }`}
            >
              {f}
              <sup className={`ml-1 font-mono text-[8px] ${active ? "text-ink/60" : "text-ash"}`}>{count}</sup>
            </button>
          );
        })}
      </div>

      <motion.div layout className="columns-1 gap-[clamp(0.75rem,1.6vw,1.75rem)] px-gutter sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {visible.map((img, i) => (
            <GalleryFigure key={img.src} index={i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                data-cursor="View"
                className="relative block w-full overflow-hidden bg-ink-2"
                aria-label={`Open ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full scale-[1.01] transition-[transform,filter] duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] md:grayscale-[35%] md:group-hover:grayscale-0"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                {img.placeholder && <PlaceholderTag label="Placeholder" className="absolute right-3 top-3 bg-ink/60" />}
              </button>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="eyebrow">{img.category}</span>
                <span className="font-mono text-[10px] text-ash">{String(i + 1).padStart(2, "0")}</span>
              </figcaption>
            </GalleryFigure>
          ))}
        </AnimatePresence>
      </motion.div>

      <Lightbox images={visible} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </>
  );
}
