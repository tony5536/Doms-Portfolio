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

## ⚠ Demo content — replace before launch

The site currently uses **free Unsplash photographs as demo imagery** (not Dominic's work), loaded
straight from Unsplash's CDN at the size each screen needs. While `siteConfig.demoContent` is `true`,
the footer and project pages carry a small "Demo imagery via Unsplash" note.

| Content | Status |
| --- | --- |
| `public/images/portraits/dominic-xavier.png` | **Real** — supplied photo of Dominic (635×845; a higher-res original would sharpen the About section) |
| Projects in `projects.ts` | DEMO — titles, years, copy and Unsplash images are stand-ins (`demo: true`) |
| Gallery in `gallery.ts` | DEMO — Unsplash images (`demo: true`) |
| Hero still, showreel cover, contact background (`siteConfig.media`) | DEMO — Unsplash |
| Service hover previews (`siteConfig.services`) | DEMO — reuse project imagery |
| Hero (`siteConfig.media.heroPortrait`) | **Real** — Dominic's portrait, set like a film poster. Swap in a higher-res portrait for extra sharpness |
| `public/videos/showreel.mp4` | **Missing** — modal shows "Coming soon" until a file or embed URL is set |
| `about.philosophy` | Temporary copy — replace with Dominic's own words |

To swap in real work: put files in `public/images/...` and use local paths (e.g. `"/images/projects/altitude/cover.jpg"`)
with the real pixel `width`/`height`, or any `https://images.unsplash.com/...` URL. Then set `demo: false` on each
entry and `demoContent: false` in `siteConfig.ts`.

Regenerate the social image (from the portrait):

```bash
node scripts/generate-social.mjs         # public/og-image.jpg (1200×630) + apple icon
```

## Typography

- **Archivo** (variable, `wdth` axis) carries the system — set wide (`wdth 125`) for titles via the
  `display` / `credit` utilities, normal width for text and the small `meta` labels.
- **Newsreader** italic (`serif` utility) is reserved for a few spoken statements.
- Sizes come from one scale in `globals.css` (`text-hero`, `text-h2`, `text-h3`, `text-statement`,
  `text-quote`, `text-lead`, `text-body`, `text-meta`); spacing from `--edge`, `--section-y`, `--header-gap`.

### Video tips
Showreel: H.264 MP4 at `public/videos/showreel.mp4` (1920×1080, ~20–40 MB), or a Vimeo/YouTube embed URL in
`siteConfig.media.showreelEmbed` — an embed is lighter to host.

## Structure

```
src/app/            layout (fonts, metadata, JSON-LD), page, work/[slug], template (route curtain),
                    sitemap.ts, robots.ts, icon.svg, apple-icon.png, not-found
src/components/
  layout/           Navbar (sticky), Footer (wordmark), Preloader (title card), JsonLd
  sections/         Hero (letterbox title sequence), SelectedWork, Showreel, Photography,
                    About, Services, Contact
  portfolio/        WorkReel (pinned horizontal reel), ProjectIndex, ProjectDetail, Gallery,
                    Lightbox, VideoModal
  animations/       SmoothScroll (Lenis+GSAP), CustomCursor, TextReveal, Reveal, Parallax
  ui/               Img (next/image + Unsplash CDN loader), SectionHeader, BackToTop, CurrentYear
src/lib/            unsplash URL helper, intro store, reveal hook, client/media-query hooks
```

Motion respects `prefers-reduced-motion` (Lenis, parallax, cursor, hero video, preloader and reveals are disabled or instant).
