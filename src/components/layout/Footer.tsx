import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import CurrentYear from "@/components/ui/CurrentYear";
import BackToTop from "@/components/ui/BackToTop";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink px-gutter pb-8 pt-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Link href="/" className="text-[13px] font-medium uppercase tracking-[0.28em]">
            {siteConfig.name}
          </Link>
          <p className="eyebrow">{siteConfig.role}</p>
        </div>
        <div className="flex items-center gap-8">
          <p className="eyebrow">
            {siteConfig.location.city}, {siteConfig.location.country}
          </p>
          <BackToTop />
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:justify-between">
        <p className="eyebrow">
          © <CurrentYear /> {siteConfig.name}. All rights reserved.
        </p>
        <p className="eyebrow">All frames are the property of their creator.</p>
      </div>
    </footer>
  );
}
