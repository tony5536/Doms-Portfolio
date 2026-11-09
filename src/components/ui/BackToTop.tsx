"use client";

import { ArrowUpRight } from "lucide-react";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";

export default function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      className="group eyebrow flex items-center gap-2 !text-bone"
      aria-label="Back to top"
    >
      Top
      <ArrowUpRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.25} />
    </button>
  );
}
