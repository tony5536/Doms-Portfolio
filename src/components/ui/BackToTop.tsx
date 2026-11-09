"use client";

import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";

export default function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  return (
    <button type="button" onClick={() => scrollTo(0)} className="group flex items-center gap-2 text-sm text-bone/80 hover:text-bone" aria-label="Back to top">
      Back to top
      <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.25} />
    </button>
  );
}
