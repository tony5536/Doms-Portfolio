"use client";

import NextImage, { type ImageLoader, type ImageProps } from "next/image";

/**
 * Unsplash's CDN resizes on the fly, so remote demo photos are requested
 * at the exact width the browser needs instead of being proxied through
 * the Next.js optimiser. Local images (e.g. the portrait) keep the default.
 */
const unsplashLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
};

export default function Image(props: ImageProps) {
  const remote = typeof props.src === "string" && props.src.startsWith("https://images.unsplash.com/");
  return <NextImage {...props} loader={remote ? unsplashLoader : props.loader} />;
}
