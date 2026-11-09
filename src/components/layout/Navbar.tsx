"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { siteConfig, contactChannels } from "@/data/siteConfig";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollTo, lock, unlock } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  // Sticky header: always visible; gains a solid background and compacts once scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section indication
  useEffect(() => {
    if (!isHome) return;
    const sections = siteConfig.nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const top = () => window.scrollY < window.innerHeight * 0.5 && setActive("");
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, [isHome]);

  // Lock scroll while the mobile menu is open; close on Escape
  useEffect(() => {
    if (!open) return;
    lock();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lock, unlock]);

  const go = (e: React.MouseEvent, href: string) => {
    const wasOpen = open;
    setOpen(false);
    if (!isHome) return; // let Link navigate to /#id
    e.preventDefault();
    history.replaceState(null, "", href === "#top" ? "/" : href);
    // If the menu was open, wait until its scroll lock is released.
    // Hero (#top) goes to 0; sections land just below the sticky header.
    const run = () => (href === "#top" ? scrollTo(0) : scrollTo(href, { offset: -56 }));
    if (wasOpen) requestAnimationFrame(() => requestAnimationFrame(run));
    else run();
  };

  const homeHref = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] border-b transition-[background-color,border-color] duration-700 ease-[var(--ease-out-expo)] ${
          scrolled && !open ? "border-line bg-ink/95" : "border-transparent bg-transparent"
        }`}
      >
        <nav
          className={`flex items-center justify-between px-gutter transition-[height] duration-700 ease-[var(--ease-out-expo)] ${
            scrolled && !open ? "h-14 md:h-16" : "h-16 md:h-20"
          }`}
          aria-label="Primary"
        >
          <Link
            href={isHome ? "#top" : "/"}
            onClick={(e) => isHome && go(e, "#top")}
            className="group relative z-[130] flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.28em]"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-champagne transition-transform duration-500 group-hover:scale-150" />
            {siteConfig.name}
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {siteConfig.nav.map((item, i) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={homeHref(item.href)}
                    onClick={(e) => go(e, item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className="group relative flex items-baseline gap-1.5 py-2 text-[12px] uppercase tracking-[0.24em] text-bone/70 transition-colors duration-300 hover:text-bone aria-[current]:text-bone"
                  >
                    <span className="font-mono text-[9px] text-ash">0{i + 1}</span>
                    <span className="relative overflow-hidden">
                      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{item.label}</span>
                      <span className="absolute inset-0 block translate-y-full text-champagne transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
                        {item.label}
                      </span>
                    </span>
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px bg-champagne transition-all duration-700 ease-[var(--ease-out-expo)] ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="relative z-[130] flex items-center gap-3 py-2 text-[12px] uppercase tracking-[0.24em] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="grid h-4 overflow-hidden text-right">
              <span className={`[grid-area:1/1] transition-transform duration-500 ${open ? "-translate-y-full" : ""}`}>Menu</span>
              <span className={`[grid-area:1/1] transition-transform duration-500 ${open ? "translate-y-0" : "translate-y-full"}`}>Close</span>
            </span>
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-bone transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
              <span className={`absolute left-0 h-px w-6 bg-bone transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-ink-2 px-gutter pb-10 pt-28 md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-2">
              {siteConfig.nav.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={homeHref(item.href)}
                      onClick={(e) => go(e, item.href)}
                      className="flex items-baseline gap-4 py-1"
                    >
                      <span className="font-mono text-xs text-ash">0{i + 1}</span>
                      <span className={`display text-[clamp(3rem,16vw,6rem)] ${active === item.id ? "text-champagne" : ""}`}>{item.label}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
              className="space-y-6 border-t border-line pt-6"
            >
              <p className="serif-italic text-2xl text-bone/90">{siteConfig.tagline}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {contactChannels()
                  .filter((c) => c.href)
                  .map((c) => (
                    <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="eyebrow !text-bone">
                      {c.label}
                    </a>
                  ))}
              </div>
              <p className="eyebrow">
                {siteConfig.location.city}, {siteConfig.location.country}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
