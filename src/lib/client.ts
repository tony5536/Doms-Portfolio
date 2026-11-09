"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false during SSR / hydration, true on the client afterwards. */
export function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** Live media-query match; false on the server. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
