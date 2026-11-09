/**
 * Builds the social sharing image (public/og-image.jpg, 1200×630) and the
 * Apple touch icon (src/app/apple-icon.png) from Dominic's portrait.
 *
 * A static, compressed JPEG is used on purpose: WhatsApp and LinkedIn
 * previews are most reliable with small (<300 KB) JPEGs.
 *
 *   node scripts/generate-social.mjs
 */
import sharp from "sharp";
import { join } from "node:path";
import { statSync } from "node:fs";

const root = join(import.meta.dirname, "..");
const portrait = join(root, "public/images/portraits/dominic-xavier.png");
const W = 1200, H = 630, PW = 470;

const photo = await sharp(portrait)
  .resize(PW, H, { fit: "cover", position: "attention" })
  .modulate({ saturation: 0.85 })
  .toBuffer();

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="#080808" stop-opacity="0"/>
      <stop offset="1" stop-color="#080808" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect x="${PW - 160}" y="0" width="160" height="${H}" fill="url(#fade)"/>
  <g font-family="Arial, Helvetica, sans-serif" fill="#f5f3ef">
    <text x="${PW + 60}" y="118" font-family="Consolas, monospace" font-size="17" letter-spacing="4" fill="#c8b89a">CINEMATOGRAPHER / FILMMAKER / PHOTOGRAPHER</text>
    <text x="${PW + 52}" y="285" font-size="128" font-weight="bold" letter-spacing="-6">DOMINIC</text>
    <text x="${PW + 56}" y="405" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="124" letter-spacing="-3">Xavier</text>
    <text x="${PW + 60}" y="490" font-family="Georgia, serif" font-style="italic" font-size="30" fill="#f5f3ef" fill-opacity="0.8">“Visuals That Speak. Stories That Stay.”</text>
    <rect x="${PW + 60}" y="540" width="40" height="1" fill="#f5f3ef" fill-opacity="0.4"/>
    <text x="${PW + 115}" y="546" font-family="Consolas, monospace" font-size="15" letter-spacing="3" fill="#929292">BENGALURU, INDIA</text>
  </g>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: "#080808" } })
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: Buffer.from(overlay), left: 0, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(root, "public/og-image.jpg"));
console.log("✓ public/og-image.jpg", Math.round(statSync(join(root, "public/og-image.jpg")).size / 1024), "KB");

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <rect width="180" height="180" fill="#080808"/>
  <circle cx="36" cy="36" r="7" fill="#c8b89a"/>
  <text x="90" y="122" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="84" fill="#f5f3ef" letter-spacing="-3">DX</text>
</svg>`;
await sharp(Buffer.from(icon)).png().toFile(join(root, "src/app/apple-icon.png"));
console.log("✓ src/app/apple-icon.png");
