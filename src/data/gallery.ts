/**
 * PHOTOGRAPHY GALLERY
 * ---------------------------------------------------------------------------
 * ⚠ DEMO IMAGES — free Unsplash photographs, not Dominic's work.
 * Replace `src`, `width`, `height` and `alt` with real photographs
 * (width/height = real pixel size; prevents layout shift) and set demo: false.
 */
import { unsplash } from "@/lib/unsplash";

export const galleryCategories = ["Portraits", "Fashion", "Editorial", "Lifestyle", "Events", "Creative"] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  category: GalleryCategory;
  caption?: string;
  demo: boolean;
};

const g = (id: string, width: number, height: number, category: GalleryCategory, alt: string): GalleryImage => ({
  src: unsplash(id, 2000),
  width,
  height,
  category,
  alt,
  caption: alt,
  demo: true,
});

export const gallery: GalleryImage[] = [
  g("photo-1508186225823-0963cf9ab0de", 3166, 4749, "Portraits", "Hands framing a face, black and white"),
  g("photo-1662532577856-e8ee8b138a8b", 9538, 6470, "Fashion", "Red outfit against a clear blue sky"),
  g("photo-1779406970957-71df0abe57f8", 5792, 8688, "Fashion", "A face glimpsed through sheer white fabric"),
  g("photo-1572635148749-3be19f2f3a0c", 5760, 3840, "Lifestyle", "A figure walking down a street in motion blur"),
  g("photo-1587397845856-e6cf49176c70", 2965, 4448, "Portraits", "Man in a black crew-neck shirt"),
  g("photo-1779675258719-83281262612e", 5970, 3980, "Editorial", "Sheer veil reflected in a full-length mirror"),
  g("photo-1681149341674-45fd772fd463", 2832, 4240, "Events", "A single spotlight on an empty stage"),
  g("photo-1574155088851-0c770818ba40", 6000, 4000, "Events", "A party crowd under coloured light"),
  g("photo-1656177965828-9e0df65c8e30", 3648, 5472, "Lifestyle", "Hair caught mid-air in a forest"),
  g("photo-1573339887617-d674bc961c31", 4000, 6000, "Creative", "Laser light slicing through darkness"),
  g("photo-1506863530036-1efeddceb993", 3813, 2975, "Portraits", "Black-and-white portrait with a necklace"),
  g("photo-1613915617430-8ab0fd7c6baf", 2217, 2771, "Editorial", "Tailored blazer and trousers, hand in pocket"),
  g("photo-1596993100471-c3905dafa78e", 3200, 4800, "Fashion", "Man in a black and yellow jacket and sunglasses"),
  g("photo-1686246251484-693fa4e12633", 4892, 3261, "Creative", "Neon sign glowing on a building at night"),
];
