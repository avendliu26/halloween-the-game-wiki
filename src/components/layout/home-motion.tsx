"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Progressive enhancement: sections are readable before JS, without IO, and with reduced motion. */
export function HomeMotion({ children }: Readonly<{ children: ReactNode }>) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia || !window.IntersectionObserver) return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 48rem)");
    const sections = root.current?.querySelectorAll<HTMLElement>(".home-section") ?? [];
    let observer: IntersectionObserver | undefined;

    const update = () => {
      observer?.disconnect();
      sections.forEach((section) => section.classList.remove("home-section--revealed"));
      if (!motion.matches) return;

      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("home-section--revealed");
          observer?.unobserve(entry.target);
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
      sections.forEach((section) => observer?.observe(section));
    };

    update();
    motion.addEventListener("change", update);
    return () => {
      observer?.disconnect();
      motion.removeEventListener("change", update);
    };
  }, []);

  return <div className="home-page" ref={root}>{children}</div>;
}
