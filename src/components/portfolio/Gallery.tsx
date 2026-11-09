"use client";

import Image from "@/components/ui/Img";
import { motion } from "framer-motion";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { galleryCategories, type GalleryImage } from "@/data/gallery";
import Lightbox from "@/components/portfolio/Lightbox";
import { useRevealOnce } from "@/lib/useRevealOnce";

type Filter = "All" | (typeof galleryCategories)[number];

function Frame({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealOnce(ref, "-6%");
  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.3, delay: (index % 3) * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className="group mb-[var(--gutter)] break-inside-avoid"
    >
      {children}
    </motion.figure>
  );
}

/** Editorial masonry: text tabs, staggered reveals, full-screen viewer. */
export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [index, setIndex] = useState<number | null>(null);

  const visible = useMemo(() => (filter === "All" ? images : images.filter((i) => i.category === filter)), [filter, images]);
  const filters: Filter[] = ["All", ...galleryCategories.filter((c) => images.some((i) => i.category === c))];

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-x-7 gap-y-3 px-gutter md:mb-16" role="toolbar" aria-label="Filter photographs">
        {filters.map((f) => {
          const count = f === "All" ? images.length : images.filter((i) => i.category === f).length;
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`group relative pb-1 text-[0.95rem] transition-colors duration-500 ${active ? "text-bone" : "text-ash hover:text-bone"}`}
            >
              {f}
              <sup className="ml-1 text-[0.6rem] tabular-nums text-ash">{count}</sup>
              <span
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-bone transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div key={filter} className="columns-1 gap-[var(--gutter)] px-gutter sm:columns-2 lg:columns-3">
        {visible.map((img, i) => (
          <Frame key={img.src} index={i}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              data-cursor="View"
              className="relative block w-full overflow-hidden bg-ink-3"
              aria-label={`Open: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]"
              />
            </button>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4">
              <span className="meta">{img.category}</span>
              <span className="meta tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            </figcaption>
          </Frame>
        ))}
      </div>

      <Lightbox images={visible} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </>
  );
}
