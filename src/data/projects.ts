/**
 * PROJECTS
 * ---------------------------------------------------------------------------
 * ⚠ Every entry below is a SAMPLE ENTRY (`placeholder: true`) — one per
 * category — so the exhibition layout can be reviewed. Titles, years,
 * descriptions and credits are neutral stand-ins, not real work.
 * Replace each with a real project and set `placeholder: false`.
 */

export type Category =
  | "Cinematography"
  | "Commercial Films"
  | "Short Films"
  | "Photography"
  | "Portraits & Fashion"
  | "Events";

export type ProjectImage = { src: string; width: number; height: number; alt: string };

export type Project = {
  slug: string;
  title: string;
  category: Category;
  year: string;
  /** One or two sentences for the index. */
  summary: string;
  /** Longer text for the project page. Each string = paragraph. */
  description: string[];
  cover: ProjectImage;
  gallery: ProjectImage[];
  /** Optional: local mp4 path, or a Vimeo/YouTube embed URL. */
  video?: string;
  /** Optional muted preview clip shown on hover in the index. */
  previewVideo?: string;
  credits: { role: string; name: string }[];
  placeholder: boolean;
};

const img = (slug: string, file: string, width: number, height: number, alt: string): ProjectImage => ({
  src: `/images/projects/${slug}/${file}.jpg`,
  width,
  height,
  alt,
});

const sample = (slug: string, category: Category): Project => {
  const portraitCover = slug === "portraits-fashion";
  return {
    slug,
    title: `${category}`,
    category,
    year: "—", // TODO: real year
    summary: `Sample entry for ${category.toLowerCase()}. Replace with the project's logline.`,
    description: [
      "This is a sample entry. Replace it with the story behind the project — the brief, the idea, and the visual approach.",
      "Describe the lighting, the camera language and the decisions made in the edit. Keep it short; let the frames do the talking.",
    ],
    cover: portraitCover
      ? img(slug, "cover", 1600, 2000, `Placeholder cover — ${category}`)
      : img(slug, "cover", 2400, 1350, `Placeholder cover — ${category}`),
    gallery: [
      img(slug, "still-01", 2100, 1400, `Placeholder still 01 — ${category}`),
      img(slug, "still-02", 1600, 2000, `Placeholder still 02 — ${category}`),
      img(slug, "still-03", 2400, 1030, `Placeholder still 03 — ${category}`),
    ],
    video: undefined, // e.g. "https://player.vimeo.com/video/000000000"
    credits: [
      { role: "Direction & Cinematography", name: "Dominic Xavier" },
      { role: "Client", name: "To be added" },
      { role: "Edit", name: "To be added" },
    ],
    placeholder: true,
  };
};

export const projects: Project[] = [
  sample("cinematography", "Cinematography"),
  sample("commercial-films", "Commercial Films"),
  sample("short-films", "Short Films"),
  sample("photography", "Photography"),
  sample("portraits-fashion", "Portraits & Fashion"),
  sample("events", "Events"),
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
