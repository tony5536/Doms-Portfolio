"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Shared fallback for elements that were skipped over (anchor jump, restored
 * scroll position, fast fling). IntersectionObserver only reports *changes*,
 * so going from "below" straight to "above" the viewport never fires.
 * One rAF-throttled scroll listener checks all pending elements.
 */
const pending = new Map<Element, () => void>();
let ticking = false;

function check() {
  ticking = false;
  pending.forEach((reveal, el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) reveal();
  });
}
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(check);
  }
}
function track(el: Element, reveal: () => void) {
  if (pending.size === 0) window.addEventListener("scroll", onScroll, { passive: true });
  pending.set(el, reveal);
}
function untrack(el: Element) {
  pending.delete(el);
  if (pending.size === 0) window.removeEventListener("scroll", onScroll);
}

/** True once the element has entered — or been scrolled past — the viewport. */
export function useRevealOnce(ref: RefObject<Element | null>, bottomMargin = "-10%") {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const reveal = () => setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) reveal();
      },
      { rootMargin: `0px 0px ${bottomMargin} 0px` },
    );
    io.observe(el);
    track(el, reveal);
    return () => {
      io.disconnect();
      untrack(el);
    };
  }, [ref, shown, bottomMargin]);

  return shown;
}
