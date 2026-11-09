"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { contactChannels, siteConfig } from "@/data/siteConfig";
import TextReveal from "@/components/animations/TextReveal";
import Reveal from "@/components/animations/Reveal";
import MagneticButton from "@/components/animations/MagneticButton";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";
import { SectionLabel } from "@/components/ui/SectionHeader";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

const field =
  "peer w-full border-b border-line bg-transparent pb-3 pt-6 text-lg text-bone outline-none transition-colors placeholder:text-transparent focus:border-champagne";
const label =
  "pointer-events-none absolute left-0 top-6 text-[13px] uppercase tracking-[0.18em] text-ash transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-champagne peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px]";

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
      {/* Animated background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image src={siteConfig.media.contactBackground} alt="" fill sizes="100vw" className="animate-kenburns object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </div>

      <div className="section-y relative px-gutter">
        <SectionLabel index="06" label="Contact" />

        <h2 id="contact-title" className="display text-h2">
          <TextReveal as="span" by="line" text={"Let's create\nsomething worth"} className="block" stagger={0.1} />
          <TextReveal as="span" text="remembering." className="serif-italic block normal-case tracking-[-0.02em] text-champagne md:ml-[10vw]" delay={0.2} />
        </h2>

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="serif-italic max-w-md text-lead text-bone/85">
              Have an idea, a story or a project in mind? Let&apos;s bring it to life.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <MagneticButton>
              <button
                type="button"
                onClick={() => scrollTo("#inquiry", { offset: -100 })}
                className="group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-bone/40 text-[12px] uppercase tracking-[0.2em] md:h-44 md:w-44"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-bone transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                <span className="relative flex items-center gap-2 transition-colors duration-500 group-hover:text-ink">
                  Start a project <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
                </span>
              </button>
            </MagneticButton>
          </Reveal>
        </div>

        <div className="mt-header grid gap-16 border-t border-line pt-14 md:grid-cols-12 md:gap-[var(--gutter)]">
          {/* Channels */}
          <div className="md:col-span-5">
            <h3 className="eyebrow mb-8">Get in touch</h3>
            <ul>
              {channels.map((c) =>
                c.href ? (
                  <li key={c.label} className="border-t border-line last:border-b">
                    <a href={c.href} target={c.label === "Email" ? undefined : "_blank"} rel="noreferrer" className="group flex items-center justify-between py-4">
                      <span className="text-xl font-medium uppercase tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-2">{c.label}</span>
                      <ArrowUpRight className="h-5 w-5 text-ash transition-all duration-500 group-hover:rotate-45 group-hover:text-champagne" strokeWidth={1} />
                    </a>
                  </li>
                ) : isDev ? (
                  <li key={c.label} className="flex items-center justify-between border-t border-line py-4 last:border-b opacity-40">
                    <span className="text-xl font-medium uppercase tracking-[-0.02em]">{c.label}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Not configured</span>
                  </li>
                ) : null,
              )}
            </ul>
            <p className="eyebrow mt-8">
              Based in {siteConfig.location.city}, {siteConfig.location.country} — available for projects worldwide.
            </p>
          </div>

          {/* Inquiry form */}
          <form id="inquiry" onSubmit={onSubmit} className="md:col-span-6 md:col-start-7" noValidate={false}>
            <h3 className="eyebrow mb-8">Project inquiry</h3>
            <div className="grid gap-8 sm:grid-cols-2">
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
                <span className="pointer-events-none absolute left-0 top-0 text-[10px] uppercase tracking-[0.18em] text-ash">Project type</span>
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
              <MagneticButton strength={0.25}>
                <button
                  type="submit"
                  disabled={status.kind === "sending"}
                  className="group relative overflow-hidden rounded-full bg-bone px-8 py-4 text-[12px] uppercase tracking-[0.22em] text-ink disabled:opacity-60"
                >
                  <span className="absolute inset-0 translate-y-full bg-champagne transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                  <span className="relative">{status.kind === "sending" ? "Sending…" : "Send inquiry"}</span>
                </button>
              </MagneticButton>
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
