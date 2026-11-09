/**
 * SITE CONFIGURATION — the single place to edit Dominic's details.
 * ---------------------------------------------------------------------------
 * Contact fields are intentionally EMPTY. Nothing has been invented.
 * Fill them in and the matching links appear automatically across the site.
 * An empty string = hidden in production (shown as "not configured" in dev).
 */

export type SocialKey = "instagram" | "vimeo" | "youtube" | "linkedin";

export const siteConfig = {
  /** Production URL, used for canonical links, sitemap and social previews. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dominicxavier.com", // TODO: set real domain

  name: "Dominic Xavier",
  firstName: "Dominic",
  lastName: "Xavier",
  titles: ["Cinematographer", "Filmmaker", "Photographer"],
  role: "Filmmaker / Cinematographer / Photographer / Video Editor",
  tagline: "Visuals That Speak. Stories That Stay.",
  location: { city: "Bengaluru", country: "India", coords: "12.97° N  77.59° E" },

  seo: {
    title: "Dominic Xavier | Cinematographer & Filmmaker",
    description:
      "Dominic Xavier is a Bengaluru-based filmmaker, cinematographer, photographer and video editor creating compelling visual stories.",
    keywords: [
      "Dominic Xavier",
      "cinematographer Bengaluru",
      "filmmaker Bengaluru",
      "photographer Bengaluru",
      "video editor",
      "commercial films",
      "short films",
      "portrait photography",
    ],
  },

  contact: {
    email: "", // e.g. "hello@example.com"
    phone: "", // e.g. "+91 00000 00000"
    /** WhatsApp number in international format, digits only, e.g. "919900000000" */
    whatsapp: "",
    /**
     * Optional form endpoint (Formspree, Getform, your own API route …).
     * If empty, the inquiry form opens the visitor's mail app pre-filled
     * (requires `email` above).
     */
    formEndpoint: "",
  },

  socials: {
    instagram: "", // full URL, e.g. "https://instagram.com/handle"
    vimeo: "",
    youtube: "",
    linkedin: "",
  } satisfies Record<SocialKey, string>,

  media: {
    /** Hero background video. Missing file → falls back to `heroPoster`. */
    heroVideo: "/videos/hero.mp4", // PLACEHOLDER PATH — file not supplied yet
    /** Still shown before the video loads, on mobile, and if the video is missing. */
    heroPoster: "/images/hero/hero-still.jpg", // PLACEHOLDER IMAGE
    /** Showreel: a local mp4 OR a Vimeo / YouTube embed URL. */
    showreelVideo: "/videos/showreel.mp4", // PLACEHOLDER PATH — file not supplied yet
    showreelEmbed: "", // e.g. "https://player.vimeo.com/video/000000000"
    showreelCover: "/images/hero/showreel-cover.jpg", // PLACEHOLDER IMAGE
    contactBackground: "/images/hero/contact-bg.jpg", // PLACEHOLDER IMAGE
    /** Real photograph of Dominic supplied by the client. */
    portrait: { src: "/images/portraits/dominic-xavier.png", width: 635, height: 845, alt: "Portrait of Dominic Xavier in sunglasses against a clear sky" },
  },

  about: {
    headline: "Behind every frame, there is a perspective.",
    /** Temporary biography — edit freely. Each string is a paragraph. */
    bio: [
      "I am a filmmaker, cinematographer and photographer driven by the art of visual storytelling. My approach combines composition, lighting, movement and emotion to create visual experiences that communicate beyond words.",
      "From commercial productions and creative campaigns to portraits and short films, I enjoy exploring different perspectives and transforming ideas into compelling visuals.",
    ],
    // TEMPORARY copy — replace with Dominic's own words.
    philosophy: "Composition, light, movement and emotion — working together to say what words cannot.",
    experience: [
      { place: "Blissclub", detail: "Creative work — direction, videography and video editing" },
      { place: "Rooster Media TX", detail: "Previous creative experience" },
      { place: "Freelance", detail: "Video production and creative editing" },
    ],
    expertise: ["Direction", "Cinematography", "Videography", "Photography", "Video Editing", "Post Production"],
  },

  services: [
    { title: "Cinematography", image: "/images/projects/cinematography/cover.jpg" },
    { title: "Commercial Film Production", image: "/images/projects/commercial-films/cover.jpg" },
    { title: "Creative Direction", image: "/images/projects/commercial-films/still-02.jpg" },
    { title: "Photography", image: "/images/projects/photography/cover.jpg" },
    { title: "Portrait & Fashion Photography", image: "/images/projects/portraits-fashion/cover.jpg" },
    { title: "Short Film Production", image: "/images/projects/short-films/cover.jpg" },
    { title: "Event Films", image: "/images/projects/events/cover.jpg" },
    { title: "Video Editing & Post Production", image: "/images/projects/short-films/still-03.jpg" },
  ],

  nav: [
    { label: "Work", href: "#work", id: "work" },
    { label: "Showreel", href: "#showreel", id: "showreel" },
    { label: "About", href: "#about", id: "about" },
    { label: "Contact", href: "#contact", id: "contact" },
  ],
};

export type SiteConfig = typeof siteConfig;

/** Ordered list of contact channels, built from config. Empty values = not configured. */
export function contactChannels() {
  const { contact, socials } = siteConfig;
  return [
    { label: "Email", value: contact.email, href: contact.email ? `mailto:${contact.email}` : "" },
    { label: "Instagram", value: socials.instagram, href: socials.instagram },
    { label: "Vimeo", value: socials.vimeo, href: socials.vimeo },
    { label: "YouTube", value: socials.youtube, href: socials.youtube },
    { label: "LinkedIn", value: socials.linkedin, href: socials.linkedin },
    { label: "WhatsApp", value: contact.whatsapp, href: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}` : "" },
  ];
}
