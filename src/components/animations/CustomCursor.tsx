"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/client";

/**
 * Desktop-only cursor: a small dot + a lagging ring.
 * Elements with `data-cursor="Label"` expand the ring and show the label.
 * Elements that are links/buttons slightly grow the ring.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const enabled = useMediaQuery("(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)");
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setHidden(false);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? "");
      setHovering(Boolean(t?.closest("a, button, input, textarea, select, [role=button]")));
    };
    const leave = () => setHidden(true);

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = label ? 96 : hovering ? 52 : 34;

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[300] transition-opacity duration-300 ${hidden ? "opacity-0" : "opacity-100"}`}>
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]"
          style={{
            width: size,
            height: size,
            borderColor: label ? "transparent" : "rgb(245 243 239 / 0.45)",
            backgroundColor: label ? "var(--color-bone)" : "transparent",
          }}
        >
          <span className={`font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"}`}>
            {label}
          </span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 will-change-transform">
        <div className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone mix-blend-difference transition-opacity ${label ? "opacity-0" : ""}`} />
      </div>
    </div>
  );
}
