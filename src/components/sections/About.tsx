import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";
import Parallax from "@/components/animations/Parallax";
import Marquee from "@/components/animations/ScrollMarquee";
import { SectionLabel } from "@/components/ui/SectionHeader";

export default function About() {
  const { about, media } = siteConfig;

  return (
    <section id="about" className="section-y relative overflow-hidden bg-ink" aria-labelledby="about-title">
      <Marquee text="Perspective — Light — Movement — Emotion —" />

      <div className="mt-header grid gap-14 px-gutter md:grid-cols-12 md:gap-[var(--gutter)]">
        {/* Portrait */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Reveal variant="clip">
              <Parallax className="aspect-[635/845] bg-ink-2" amount={10}>
                <Image
                  src={media.portrait.src}
                  alt={media.portrait.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
            <div className="mt-4 flex justify-between">
              <span className="eyebrow">{siteConfig.name}</span>
              <span className="eyebrow">
                {siteConfig.location.city}, {siteConfig.location.country}
              </span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="md:col-span-7 md:pl-[4vw]">
          <SectionLabel index="04" label="About" />

          <TextReveal
            as="h2"
            id="about-title"
            text={about.headline}
            className="serif-italic text-statement"
            stagger={0.04}
          />

          <Reveal delay={0.1} className="mt-14 border-t border-line pt-8">
            <p className="text-lead font-medium uppercase tracking-[-0.02em]">{siteConfig.name}</p>
            <p className="eyebrow mt-3">{siteConfig.role}</p>
          </Reveal>

          <div className="mt-10 space-y-6">
            {about.bio.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="max-w-[58ch] text-body text-bone/80">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="my-16 md:my-20">
            <blockquote className="relative border-l border-champagne/60 pl-6 md:pl-10">
              <span className="eyebrow mb-4 block !text-champagne">Philosophy</span>
              <p className="serif-italic text-quote text-bone">{about.philosophy}</p>
            </blockquote>
          </Reveal>

          <div className="grid gap-14 lg:grid-cols-2 lg:gap-10">
            <Reveal>
              <h3 className="eyebrow mb-6">Experience</h3>
              <ul>
                {about.experience.map((e) => (
                  <li key={e.place} className="border-t border-line py-5 last:border-b">
                    <p className="text-xl font-medium uppercase tracking-[-0.02em]">{e.place}</p>
                    <p className="mt-1 text-sm text-ash">{e.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="eyebrow mb-6">Expertise</h3>
              <ul className="flex flex-wrap gap-2">
                {about.expertise.map((x) => (
                  <li key={x} className="rounded-full border border-line px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-bone/85">
                    {x}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
