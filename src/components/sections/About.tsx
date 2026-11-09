import Image from "@/components/ui/Img";
import { siteConfig } from "@/data/siteConfig";
import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";
import Parallax from "@/components/animations/Parallax";
import { SectionLabel } from "@/components/ui/SectionHeader";

export default function About() {
  const { about, media } = siteConfig;

  return (
    <section id="about" className="section-y relative bg-ink" aria-labelledby="about-title">
      <div className="px-gutter">
        <SectionLabel index="04" label="About" aside={`${siteConfig.location.city}, ${siteConfig.location.country}`} />

        <TextReveal
          as="h2"
          id="about-title"
          text={about.headline}
          className="serif max-w-[18ch] text-statement"
          stagger={0.035}
        />

        <div className="mt-header grid gap-14 md:grid-cols-12 md:gap-[var(--gutter)]">
          {/* Portrait */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-24">
              <Reveal variant="clip">
                <Parallax className="aspect-[635/845] bg-ink-3" amount={10}>
                  <Image src={media.portrait.src} alt={media.portrait.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                </Parallax>
              </Reveal>
              <p className="meta mt-4">{siteConfig.name}, {siteConfig.location.city}</p>
            </div>
          </div>

          {/* Text */}
          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <p className="display text-h3">{siteConfig.name}</p>
              <p className="meta mt-3">{siteConfig.role}</p>
            </Reveal>

            <div className="mt-10 space-y-5">
              {about.bio.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className={`max-w-[56ch] text-bone/80 ${i === 0 ? "text-lead" : "text-body"}`}>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="my-16 border-y border-line py-10 md:my-20">
              <p className="serif text-quote text-bone">&ldquo;{about.philosophy}&rdquo;</p>
            </Reveal>

            <Reveal>
              <h3 className="meta mb-6">Experience</h3>
              <ul>
                {about.experience.map((e) => (
                  <li key={e.place} className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-b border-line py-5 first:border-t">
                    <span className="display text-[clamp(1.1rem,1.6vw,1.5rem)]">{e.place}</span>
                    <span className="meta text-right">{e.detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-14">
              <h3 className="meta mb-5">Expertise</h3>
              <p className="text-lead text-bone/85">
                {about.expertise.map((x, i) => (
                  <span key={x}>
                    {x}
                    {i < about.expertise.length - 1 && <span className="px-2 text-smoke">/</span>}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
