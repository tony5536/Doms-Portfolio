"use client";

import Image from "@/components/ui/Img";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { contactChannels, siteConfig } from "@/data/siteConfig";
import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";
import { SectionLabel } from "@/components/ui/SectionHeader";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

const field =
  "peer w-full border-b border-line bg-transparent pb-3 pt-7 text-lg text-bone outline-none transition-colors placeholder:text-transparent focus:border-bone";
const label =
  "pointer-events-none absolute left-0 top-7 text-[0.95rem] text-ash transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-bone peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs";

export default function Contact() {
  const { scrollTo } = useSmoothScroll();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const channels = contactChannels();
  const isDev = process.env.NODE_ENV !== "production";
  const { email, formEndpoint } = siteConfig.contact;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.company) return; // honeypot

    if (formEndpoint) {
      setStatus({ kind: "sending" });
      try {
        const res = await fetch(formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus({ kind: "sent", message: "Thank you — your message is on its way." });
      } catch {
        setStatus({ kind: "error", message: "Something went wrong. Please try again or reach out directly." });
      }
      return;
    }

    if (email) {
      const subject = `Project inquiry — ${data.type || "New project"}`;
      const body = `Name: ${data.name}\nEmail: ${data.email}\nProject: ${data.type}\nTimeline: ${data.timeline || "—"}\n\n${data.message}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: "sent", message: "Your mail app should open with the message ready to send." });
      return;
    }

    setStatus({
      kind: "error",
      message: "The inquiry form isn't connected yet. Add an email or form endpoint in siteConfig.ts.",
    });
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-ink" aria-labelledby="contact-title">
      <div className="absolute inset-x-0 top-0 h-[90svh]" aria-hidden="true">
        <Image src={siteConfig.media.contactBackground.src} alt="" fill sizes="100vw" className="animate-kenburns object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" />
      </div>

      <div className="section-y relative px-gutter">
        <SectionLabel index="06" label="Contact" aside="Available for projects worldwide" />

        <h2 id="contact-title" className="display text-h2">
          <TextReveal as="span" by="line" text={"Let's create\nsomething worth\nremembering."} className="block" stagger={0.12} />
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-6">
            <p className="serif max-w-[30ch] text-quote text-bone/85">Have an idea, a story or a project in mind? Let&apos;s bring it to life.</p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5 md:col-start-8 md:text-right">
            {email ? (
              <a href={`mailto:${email}`} className="display link-line text-[clamp(1.25rem,2.4vw,2.25rem)]">
                {email}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => scrollTo("#inquiry", { offset: -100 })}
                className="group inline-flex items-center gap-3 border-b border-bone pb-2 text-lead"
              >
                Start a project
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.25} />
              </button>
            )}
          </Reveal>
        </div>

        <div className="mt-block grid gap-16 md:grid-cols-12 md:gap-[var(--gutter)]">
          {/* Channels */}
          <div className="md:col-span-4">
            <h3 className="meta mb-6">Elsewhere</h3>
            <ul>
              {channels.map((c) =>
                c.href ? (
                  <li key={c.label} className="border-b border-line first:border-t">
                    <a href={c.href} target={c.label === "Email" ? undefined : "_blank"} rel="noreferrer" className="group flex items-center justify-between py-4">
                      <span className="text-lead transition-transform duration-500 group-hover:translate-x-2">{c.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-ash transition-all duration-500 group-hover:rotate-45 group-hover:text-bone" strokeWidth={1.25} />
                    </a>
                  </li>
                ) : isDev ? (
                  <li key={c.label} className="flex items-center justify-between border-b border-line py-4 opacity-40 first:border-t">
                    <span className="text-lead">{c.label}</span>
                    <span className="meta">Not configured</span>
                  </li>
                ) : null,
              )}
            </ul>
            <p className="meta mt-8">
              Based in {siteConfig.location.city}, {siteConfig.location.country}
            </p>
          </div>

          {/* Inquiry form */}
          <form id="inquiry" onSubmit={onSubmit} className="md:col-span-7 md:col-start-6">
            <h3 className="meta mb-6">Project inquiry</h3>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="relative">
                <input id="f-name" name="name" required autoComplete="name" placeholder="Name" className={field} />
                <label htmlFor="f-name" className={label}>Name</label>
              </div>
              <div className="relative">
                <input id="f-email" name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
                <label htmlFor="f-email" className={label}>Email</label>
              </div>
              <div className="relative">
                <select id="f-type" name="type" required defaultValue="" className={`${field} appearance-none [&:invalid]:text-ash`}>
                  <option value="" disabled>
                    Select…
                  </option>
                  {siteConfig.services.map((s) => (
                    <option key={s.title} value={s.title} className="bg-ink">
                      {s.title}
                    </option>
                  ))}
                  <option value="Other" className="bg-ink">Something else</option>
                </select>
                <span className="pointer-events-none absolute left-0 top-0 text-xs text-ash">Project type</span>
              </div>
              <div className="relative">
                <input id="f-timeline" name="timeline" placeholder="Timeline" className={field} />
                <label htmlFor="f-timeline" className={label}>Timeline (optional)</label>
              </div>
              <div className="relative sm:col-span-2">
                <textarea id="f-message" name="message" required rows={4} placeholder="Message" className={`${field} resize-none`} />
                <label htmlFor="f-message" className={label}>Tell me about the project</label>
              </div>
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={status.kind === "sending"}
                className="group relative overflow-hidden rounded-full bg-bone px-8 py-4 text-sm font-medium text-ink disabled:opacity-60"
              >
                <span className="absolute inset-0 translate-y-full bg-champagne transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                <span className="relative">{status.kind === "sending" ? "Sending…" : "Send inquiry"}</span>
              </button>
              <p role="status" aria-live="polite" className={`max-w-sm text-sm ${status.kind === "error" ? "text-[#d9a28f]" : "text-ash"}`}>
                {status.message}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
