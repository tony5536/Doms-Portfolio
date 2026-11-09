import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import CurrentYear from "@/components/ui/CurrentYear";
import BackToTop from "@/components/ui/BackToTop";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="grid gap-8 px-gutter pt-12 md:grid-cols-12">
        <p className="serif text-lead text-bone/80 md:col-span-5">{siteConfig.tagline}</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-4 md:col-start-7" aria-label="Footer">
          {siteConfig.nav.map((n) => (
            <Link key={n.id} href={`/${n.href}`} className="link-line text-sm text-bone/80 hover:text-bone">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="md:col-span-2 md:col-start-11 md:justify-self-end">
          <BackToTop />
        </div>
      </div>

      {/* Wordmark — sized to the page width */}
      <p aria-hidden="true" className="display mt-14 select-none whitespace-nowrap px-gutter text-center text-[9.1vw] leading-[0.8] text-bone/95 [@media(min-width:1680px)]:text-[9.5rem]">
        {siteConfig.name}
      </p>

      <div className="mt-6 flex flex-col gap-2 border-t border-line px-gutter py-6 sm:flex-row sm:justify-between">
        <p className="meta">
          © <CurrentYear /> {siteConfig.name} — {siteConfig.location.city}, {siteConfig.location.country}
        </p>
        {siteConfig.demoContent && <p className="meta">Demo imagery via Unsplash — portfolio in progress</p>}
      </div>
    </footer>
  );
}
