/**
 * PROJECTS
 * ---------------------------------------------------------------------------
 * ⚠ DEMO CONTENT. Titles, years and copy are stand-ins and every image is a
 * free Unsplash photograph (not Dominic's work) used to show the layout.
 * Replace each project with real work and set `demo: false`.
 * Images can be local paths ("/images/projects/x.jpg") or remote URLs.
 */
import { unsplash } from "@/lib/unsplash";

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
  /** One line for the index. */
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
  /** True while the entry uses demo copy / demo photography. */
  demo: boolean;
};

const u = (id: string, width: number, height: number, alt: string): ProjectImage => ({
  src: unsplash(id),
  width,
  height,
  alt,
});

const demoCredits = [
  { role: "Direction & Cinematography", name: "Dominic Xavier" },
  { role: "Client", name: "To be added" },
  { role: "Edit & Colour", name: "To be added" },
];

export const projects: Project[] = [
  {
    slug: "altitude",
    title: "Altitude",
    category: "Cinematography",
    year: "2025",
    summary: "A study of scale, silence and the last light above the clouds.",
    description: [
      "Demo copy — replace with the story behind the project: the brief, the location, and why the images look the way they do.",
      "Describe the lensing, the light you waited for, and the decisions made in the grade. Keep it short and let the frames carry the weight.",
    ],
    cover: u("photo-1485470733090-0aae1788d5af", 4717, 2984, "Snow-capped peaks under a starry night sky"),
    gallery: [
      u("photo-1469474968028-56623f02e42e", 3506, 2329, "Mountain ridge cut by sun rays"),
      u("photo-1661124280301-ca0e33ceb438", 9700, 6467, "Fog drifting through a forest beside a lake"),
      u("photo-1498404781417-2b02e42ecd0d", 6000, 3375, "Lone tree on rocks at sunset"),
    ],
    credits: demoCredits,
    demo: true,
  },
  {
    slug: "on-set",
    title: "On Set",
    category: "Commercial Films",
    year: "2025",
    summary: "Brand storytelling built on a full crew, one camera and a tight call sheet.",
    description: [
      "Demo copy — replace with the campaign idea, the client's objective and how the film answered it.",
      "Talk about the production: crew size, shooting days, camera package and what made the final cut.",
    ],
    cover: u("photo-1612544409025-e1f6a56c1152", 4000, 2667, "Film crew working on a soundstage with lighting rigs"),
    gallery: [
      u("photo-1632187981988-40f3cbaeef5e", 6720, 4480, "Crew gathered around a cinema camera"),
      u("photo-1759417501248-0aa9489dab3f", 5760, 3840, "Cinema camera set up in a studio hallway"),
      u("photo-1786325492193-bb05874e01b9", 4000, 3000, "Studio set with paper lanterns and a director's chair"),
    ],
    credits: demoCredits,
    demo: true,
  },
  {
    slug: "after-hours",
    title: "After Hours",
    category: "Short Films",
    year: "2024",
    summary: "A city after midnight, told through sodium light and long pauses.",
    description: [
      "Demo copy — replace with the logline, the cast and where the film has screened.",
      "Explain the visual language: practical lights, handheld or locked-off, and the rhythm of the edit.",
    ],
    cover: u("photo-1674123938212-a4135468551f", 3865, 2577, "A man standing alone in the middle of a road at night"),
    gallery: [
      u("photo-1674123937291-4adf87217bf4", 4921, 3456, "A man beside a parked car under street light"),
      u("photo-1680698334862-81a24b4eefbf", 3984, 4980, "A rider on a scooter crossing a city street at night"),
      u("photo-1642443055969-282b3416a333", 6000, 3376, "A bus moving down a city street at night"),
    ],
    credits: demoCredits,
    demo: true,
  },
  {
    slug: "field-notes",
    title: "Field Notes",
    category: "Photography",
    year: "2024",
    summary: "Landscapes and passing moments collected between assignments.",
    description: [
      "Demo copy — replace with the idea that ties this series together.",
      "Mention the camera, film or format, and where the images were made.",
    ],
    cover: u("photo-1477346611705-65d1883cee1e", 7952, 5304, "Aerial view of folded brown mountains"),
    gallery: [
      u("photo-1475070929565-c985b496cb9f", 5472, 3648, "A river flowing between tall trees"),
      u("photo-1461083899291-816b884d2ade", 3000, 1688, "Passengers riding a train"),
      u("photo-1572635148897-47ee6da250e6", 5760, 3840, "A man walking along a paved road"),
    ],
    credits: demoCredits,
    demo: true,
  },
  {
    slug: "monochrome",
    title: "Monochrome",
    category: "Portraits & Fashion",
    year: "2025",
    summary: "Portrait and fashion work stripped back to shape, shadow and gesture.",
    description: [
      "Demo copy — replace with the brand or publication, the stylist and the creative direction.",
      "Describe the lighting setup and how the looks were built around it.",
    ],
    cover: u("photo-1574015974293-817f0ebebb74", 2080, 3241, "Black-and-white portrait of a woman in a long-sleeved shirt"),
    gallery: [
      u("photo-1768595583026-01106c88aa10", 4914, 7371, "Person in a suit holding a newspaper over their face"),
      u("photo-1603189343302-e603f7add05a", 5000, 3750, "Silhouette in a wide-sleeved black jacket"),
      u("photo-1580478491436-fd6a937acc9e", 3264, 4928, "Woman in a red blazer sitting on stairs"),
    ],
    credits: demoCredits,
    demo: true,
  },
  {
    slug: "live-at-night",
    title: "Live at Night",
    category: "Events",
    year: "2024",
    summary: "Crowds, haze and the half-second when the lights hit the stage.",
    description: [
      "Demo copy — replace with the event, the venue and what the film or photographs were for.",
      "Note how coverage was planned: cameras, positions and turnaround time.",
    ],
    cover: u("photo-1610901056511-31de499995f0", 5472, 3648, "Silhouettes of a crowd watching a concert"),
    gallery: [
      u("photo-1657208431551-cbf415b8ef26", 6000, 4000, "Teal and purple spotlights cutting through haze"),
      u("photo-1577648884063-1d3d1477b8a7", 3934, 5901, "Crowd reaching toward a performer on stage"),
      u("photo-1558258021-971dd2148be5", 6000, 4000, "Black-and-white photograph of a performer on stage"),
    ],
    credits: demoCredits,
    demo: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
