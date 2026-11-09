# Dominic Xavier — Cinematic Portfolio

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP ScrollTrigger · Lenis · Lucide.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Editing content — everything lives in `src/data/`

| File | What it controls |
| --- | --- |
| `siteConfig.ts` | Name, titles, tagline, location, **email / phone / WhatsApp / socials**, form endpoint, hero video + poster, showreel (mp4 or Vimeo/YouTube embed), portrait, biography, philosophy, experience, expertise, services, nav, SEO text, site URL |
| `projects.ts` | Selected Work + `/work/[slug]` pages: title, category, year, summary, description, cover, stills, optional video, optional hover-preview clip, credits |
| `gallery.ts` | Photography masonry + lightbox |

Contact fields are **empty on purpose** — nothing was invented. Empty channels are hidden in production
(and shown as "Not configured" in `npm run dev`). The inquiry form posts JSON to `contact.formEndpoint`
if set (Formspree, Getform, your API route…), otherwise opens a pre-filled email to `contact.email`.

Set the real domain via `NEXT_PUBLIC_SITE_URL` (or `siteConfig.url`) — it drives canonical URLs,
`sitemap.xml`, `robots.txt` and Open Graph links.

## ⚠ Placeholder assets — replace before launch

| Asset | Status |
| --- | --- |
| `public/images/portraits/dominic-xavier.png` | **Real** — supplied photo of Dominic (635×845; a higher-res original would sharpen the About section and desktop hero) |
| `public/images/projects/**` | PLACEHOLDER — generated abstract frames, visibly labelled |
| `public/images/gallery/**` | PLACEHOLDER — generated abstract frames, visibly labelled |
| `public/images/hero/*.jpg` | PLACEHOLDER — hero still, showreel cover, contact background |
| `public/videos/hero.mp4` | **Missing** — hero falls back to the still (desktop) / portrait (mobile) |
| `public/videos/showreel.mp4` | **Missing** — modal shows "Coming soon" until a file or embed URL is set |
| Projects in `projects.ts` | SAMPLE ENTRIES (`placeholder: true`) — shown with a "Sample entry" tag |
| `about.philosophy` | Temporary copy — replace with Dominic's own words |

To replace an image, drop the real file at the same path (or change the path) and update `width`/`height`
to the real pixel size (prevents layout shift). Set `placeholder: false` to remove the tag.

Regenerate placeholders / social image:

```bash
node scripts/generate-placeholders.mjs   # abstract placeholder frames
node scripts/generate-social.mjs         # public/og-image.jpg (1200×630) + apple icon, from the portrait
```

### Video tips
Hero loop: H.264 MP4, 1920×1080 (or 2560×1080), 8–15 s, no audio track, ~4–8 MB, seamless first/last frame.
The hero video only loads on ≥768 px screens without reduced-motion or Save-Data.

## Structure

```
src/app/            layout (fonts, metadata, JSON-LD), page, work/[slug], template (route curtain),
                    sitemap.ts, robots.ts, icon.svg, apple-icon.png, not-found
src/components/
  layout/           Navbar, Footer, Preloader, JsonLd
  sections/         Hero, SelectedWork, Showreel, Photography, About, Services, Contact
  portfolio/        ProjectCard, ProjectIndex, ProjectDetail, Gallery, Lightbox, VideoModal
  animations/       SmoothScroll (Lenis+GSAP), CustomCursor, TextReveal, Reveal, Parallax,
                    MagneticButton, ScrollMarquee
src/lib/            intro store, reveal hook, client/media-query hooks
```

Motion respects `prefers-reduced-motion` (Lenis, parallax, cursor, hero video, preloader and reveals are disabled or instant).
