"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { scrollToSection } from "@/lib/lenis";

const items = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

/**
 * Fixed numbered side navigation that highlights the active section (via
 * IntersectionObserver) and smooth-scrolls on click. Each label uses the
 * stacked "double label" swap-on-hover trick from the reference site.
 */
export default function NavDots() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
      aria-label="Section navigation"
    >
      {items.map((item, i) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(`#${item.id}`)}
            data-cursor="link"
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3"
          >
            {/* double-label swap */}
            <span className="relative block h-4 overflow-hidden font-mono text-[11px] uppercase tracking-[0.2em]">
              <span
                className={clsx(
                  "block transition-transform duration-300 ease-out-expo group-hover:-translate-y-full",
                  isActive ? "text-paper" : "text-paper/40"
                )}
              >
                {item.label}
              </span>
              <span className="absolute left-0 top-full block text-accent transition-transform duration-300 ease-out-expo group-hover:-translate-y-full">
                {item.label}
              </span>
            </span>

            <span
              className={clsx(
                "font-mono text-[11px] transition-colors",
                isActive ? "text-paper" : "text-paper/40"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <span
              className={clsx(
                "h-px transition-all duration-300 ease-out-expo",
                isActive ? "w-8 bg-accent" : "w-4 bg-paper/30 group-hover:w-6"
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
