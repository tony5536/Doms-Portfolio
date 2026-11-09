"use client";

import { useSyncExternalStore } from "react";

/** Rendered on the client so the static page never ships a stale year. */
export default function CurrentYear() {
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year ?? ""}</span>;
}
