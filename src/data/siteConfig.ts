/**
 * SITE CONFIGURATION — the single place to edit Dominic's details.
 * ---------------------------------------------------------------------------
 * Contact fields are intentionally EMPTY. Nothing has been invented.
 * Fill them in and the matching links appear automatically across the site.
 * An empty string = hidden in production (shown as "not configured" in dev).
 */
import { unsplash } from "@/lib/unsplash";

export type SocialKey = "instagram" | "vimeo" | "youtube" | "linkedin";

export const siteConfig = {
  /** Production URL, used for canonical links, sitemap and social previews. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dominicxavier.com", // TODO: set real domain

  /**
   * While true, a small note says the imagery is demo content.
   * Set to false once real work replaces the demo projects and gallery.
   */
  demoContent: true,

  name: "Dominic Xavier",
  firstName: "Dominic",
  lastName: "Xavier",
  titles: ["Cinematographer", "Filmmaker", "Photographer"],
  role: "Filmmaker / Cinematographer / Photographer / Video Editor",
  tagline: "Visuals That Speak. Stories That Stay.",
  location: { city: "Bengaluru", country: "India" },

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
    /**
     * Hero photo — Dominic's portrait. Use a portrait-orientation image;
     * a higher-resolution original (e.g. 1600×2130+) will look sharper.
     */
    heroPortrait: { src: "/images/portraits/dominic-xavier.png", width: 635, height: 845, alt: "Dominic Xavier in sunglasses against a clear sky" },
    /** Showreel: a local mp4 OR a Vimeo / YouTube embed URL. */
    showreelVideo: "/videos/showreel.mp4", // add file to enable
    showreelEmbed: "", // e.g. "https://player.vimeo.com/video/000000000"
    showreelCover: { src: unsplash("photo-1471341971476-ae15ff5dd4ea", 2560), alt: "Camera and lighting set up in a studio" }, // DEMO
    contactBackground: { src: unsplash("photo-1699289644404-5bb3b9889705", 2400), alt: "" }, // DEMO
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
      { place: "Blissclub", detail: "Direction, videography & video editing" },
      { place: "Rooster Media TX", detail: "Creative" },
      { place: "Freelance", detail: "Video production & creative editing" },
    ],
    expertise: ["Direction", "Cinematography", "Videography", "Photography", "Video Editing", "Post Production"],
  },

  /** Hover previews reuse demo project imagery — swap for real stills. */
  services: [
    { title: "Cinematography", image: unsplash("photo-1485470733090-0aae1788d5af", 900) },
    { title: "Commercial Film Production", image: unsplash("photo-1612544409025-e1f6a56c1152", 900) },
    { title: "Creative Direction", image: unsplash("photo-1786325492193-bb05874e01b9", 900) },
    { title: "Photography", image: unsplash("photo-1477346611705-65d1883cee1e", 900) },
    { title: "Portrait & Fashion Photography", image: unsplash("photo-1574015974293-817f0ebebb74", 900) },
    { title: "Short Film Production", image: unsplash("photo-1674123938212-a4135468551f", 900) },
    { title: "Event Films", image: unsplash("photo-1610901056511-31de499995f0", 900) },
    { title: "Video Editing & Post Production", image: unsplash("photo-1759417501248-0aa9489dab3f", 900) },
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
