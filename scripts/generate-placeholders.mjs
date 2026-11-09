/**
 * PLACEHOLDER ASSET GENERATOR
 * ---------------------------------------------------------------------------
 * Renders abstract, colour-graded "frames" so the layout can be reviewed
 * before Dominic's real work is added. Every file written here is a
 * PLACEHOLDER and carries a visible "PLACEHOLDER" label in the image itself.
 *
 * Replace them by dropping real files at the same paths (or by changing the
 * paths in src/data/projects.ts and src/data/gallery.ts).
 *
 *   node scripts/generate-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "..", "public");

// Colour grades — muted, filmic. [shadow, mid, highlight]
const grades = {
  teal: ["#05090b", "#16262b", "#8fa7a6"],
  amber: ["#0b0705", "#2d1d12", "#d8b98c"],
  mono: ["#060606", "#202020", "#c9c6c0"],
  rose: ["#0a0607", "#2a1719", "#c9a39a"],
  dusk: ["#06060b", "#1b1a2c", "#b7a9c9"],
  olive: ["#070806", "#1f2318", "#b9b994"],
};

const motifs = {
  horizon: (w, h, c) => `
    <rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="${c[0]}" opacity="0.85"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.62}" rx="${w * 0.55}" ry="${h * 0.06}" fill="${c[2]}" opacity="0.18" filter="url(#blur)"/>`,
  sun: (w, h, c) => `
    <circle cx="${w * 0.68}" cy="${h * 0.42}" r="${Math.min(w, h) * 0.16}" fill="${c[2]}" opacity="0.55" filter="url(#blur)"/>
    <path d="M0 ${h * 0.78} Q ${w * 0.3} ${h * 0.6} ${w * 0.55} ${h * 0.74} T ${w} ${h * 0.68} V ${h} H 0 Z" fill="${c[0]}"/>`,
  figure: (w, h, c) => `
    <ellipse cx="${w * 0.5}" cy="${h * 0.45}" rx="${w * 0.35}" ry="${h * 0.42}" fill="${c[2]}" opacity="0.14" filter="url(#blur)"/>
    <circle cx="${w * 0.5}" cy="${h * 0.4}" r="${Math.min(w, h) * 0.09}" fill="${c[0]}"/>
    <path d="M ${w * 0.3} ${h} Q ${w * 0.33} ${h * 0.55} ${w * 0.5} ${h * 0.53} Q ${w * 0.67} ${h * 0.55} ${w * 0.7} ${h} Z" fill="${c[0]}"/>`,
  window: (w, h, c) => `
    <rect x="${w * 0.58}" y="${h * 0.12}" width="${w * 0.22}" height="${h * 0.62}" fill="${c[2]}" opacity="0.32" filter="url(#blur)"/>
    <path d="M ${w * 0.58} ${h * 0.74} L ${w * 0.2} ${h} L ${w * 0.9} ${h} L ${w * 0.8} ${h * 0.74} Z" fill="${c[2]}" opacity="0.08"/>`,
  lines: (w, h, c) =>
    Array.from({ length: 9 }, (_, i) => {
      const x = (w / 9) * i + w / 18;
      return `<rect x="${x}" y="0" width="${w * 0.012}" height="${h}" fill="${c[2]}" opacity="${0.04 + (i % 3) * 0.05}" filter="url(#blur)"/>`;
    }).join(""),
  mountain: (w, h, c) => `
    <path d="M0 ${h * 0.72} L ${w * 0.22} ${h * 0.44} L ${w * 0.38} ${h * 0.6} L ${w * 0.6} ${h * 0.32} L ${w * 0.82} ${h * 0.58} L ${w} ${h * 0.46} V ${h} H 0 Z" fill="${c[0]}" opacity="0.92"/>
    <ellipse cx="${w * 0.6}" cy="${h * 0.3}" rx="${w * 0.4}" ry="${h * 0.2}" fill="${c[2]}" opacity="0.16" filter="url(#blur)"/>`,
  lights: (w, h, c) =>
    Array.from({ length: 14 }, (_, i) => {
      const x = ((i * 137) % 100) / 100;
      const y = 0.35 + (((i * 71) % 40) / 100);
      const r = Math.min(w, h) * (0.02 + ((i * 13) % 5) / 100);
      return `<circle cx="${w * x}" cy="${h * y}" r="${r}" fill="${c[2]}" opacity="${0.12 + (i % 4) * 0.08}" filter="url(#blur)"/>`;
    }).join(""),
};

function svg({ w, h, grade, motif, label, letterbox }) {
  const c = grades[grade];
  const blur = Math.round(Math.min(w, h) * 0.04);
  const fs = Math.max(14, Math.round(w * 0.011));
  const bar = letterbox ? Math.round(h * 0.09) : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${c[1]}"/>
      <stop offset="1" stop-color="${c[0]}"/>
    </linearGradient>
    <radialGradient id="v" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.85"/>
    </radialGradient>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${motifs[motif](w, h, c)}
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.07"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
  ${bar ? `<rect width="${w}" height="${bar}" fill="#000"/><rect y="${h - bar}" width="${w}" height="${bar}" fill="#000"/>` : ""}
  <g font-family="Consolas, 'Courier New', monospace" font-size="${fs}" fill="#f5f3ef" opacity="0.55" letter-spacing="${fs * 0.18}">
    <text x="${fs * 2}" y="${h - bar - fs * 2}">PLACEHOLDER · ${label}</text>
    <text x="${w - fs * 2}" y="${bar + fs * 3}" text-anchor="end">REPLACE WITH ORIGINAL WORK</text>
  </g>
</svg>`;
}

const R = { wide: [2400, 1350], scope: [2400, 1030], portrait: [1600, 2000], tall: [1400, 2100], square: [1800, 1800], classic: [2100, 1400] };

const projects = [
  { slug: "cinematography", grade: "teal", motifs: ["mountain", "horizon", "figure", "window"] },
  { slug: "commercial-films", grade: "amber", motifs: ["window", "lights", "figure", "lines"] },
  { slug: "short-films", grade: "dusk", motifs: ["figure", "window", "horizon", "lights"] },
  { slug: "photography", grade: "mono", motifs: ["sun", "lines", "mountain", "figure"] },
  { slug: "portraits-fashion", grade: "rose", motifs: ["figure", "lines", "window", "figure"] },
  { slug: "events", grade: "olive", motifs: ["lights", "figure", "lights", "horizon"] },
];
const shapes = [["cover", "wide", true], ["still-01", "classic", false], ["still-02", "portrait", false], ["still-03", "scope", true]];

const jobs = [];
for (const p of projects) {
  shapes.forEach(([name, ratio, lb], i) => {
    const [w, h] = R[p.slug === "portraits-fashion" && name === "cover" ? "portrait" : ratio];
    jobs.push({ out: `images/projects/${p.slug}/${name}.jpg`, w, h, grade: p.grade, motif: p.motifs[i], letterbox: lb && w > h, label: `${p.slug.toUpperCase()} / ${name.toUpperCase()}` });
  });
}

const gallery = [
  ["portraits-01", "portrait", "rose", "figure"], ["fashion-01", "tall", "mono", "lines"],
  ["editorial-01", "classic", "amber", "window"], ["lifestyle-01", "square", "olive", "sun"],
  ["events-01", "classic", "dusk", "lights"], ["creative-01", "tall", "teal", "mountain"],
  ["portraits-02", "square", "mono", "figure"], ["fashion-02", "portrait", "rose", "window"],
  ["editorial-02", "wide", "teal", "horizon"], ["lifestyle-02", "portrait", "amber", "figure"],
  ["events-02", "tall", "olive", "lights"], ["creative-02", "classic", "dusk", "sun"],
];
for (const [name, ratio, grade, motif] of gallery) {
  const [w, h] = R[ratio];
  jobs.push({ out: `images/gallery/${name}.jpg`, w, h, grade, motif, letterbox: false, label: `GALLERY / ${name.toUpperCase()}` });
}
jobs.push({ out: "images/hero/hero-still.jpg", w: 2400, h: 1350, grade: "mono", motif: "horizon", letterbox: false, label: "HERO FALLBACK STILL" });
jobs.push({ out: "images/hero/showreel-cover.jpg", w: 2400, h: 1030, grade: "teal", motif: "mountain", letterbox: false, label: "SHOWREEL COVER" });
jobs.push({ out: "images/hero/contact-bg.jpg", w: 2400, h: 1350, grade: "amber", motif: "sun", letterbox: false, label: "CONTACT BACKGROUND" });

for (const j of jobs) {
  const file = join(root, j.out);
  await mkdir(dirname(file), { recursive: true });
  await sharp(Buffer.from(svg(j))).jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(file);
  console.log("✓", j.out, `${j.w}x${j.h}`);
}
