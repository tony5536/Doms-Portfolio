/**
 * Demo photography helper. Builds an Unsplash CDN URL capped at a sensible
 * size so the Next.js image optimiser never pulls 9000px originals.
 * Replace with local paths (e.g. "/images/projects/x.jpg") for real work.
 */
export const unsplash = (id: string, w = 2400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=max&q=80&w=${w}`;

export const isRemote = (src: string) => src.startsWith("http");
