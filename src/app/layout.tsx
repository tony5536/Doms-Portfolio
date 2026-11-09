import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import SmoothScroll from "@/components/animations/SmoothScroll";
import CustomCursor from "@/components/animations/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Preloader, { introScript } from "@/components/layout/Preloader";
import JsonLd from "@/components/layout/JsonLd";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

const { seo } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: seo.title, template: `%s — ${siteConfig.name}` },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: siteConfig.name,
    title: seo.title,
    description: seo.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.titles.join(" / ")}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${interTight.variable} ${cormorant.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <JsonLd />
        <a
          href="#main"
          className="eyebrow fixed left-4 top-4 z-[200] -translate-y-24 bg-bone px-4 py-3 !text-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Navbar />
          {children}
        </SmoothScroll>
        <CustomCursor />
        <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
