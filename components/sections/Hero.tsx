"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { onPreloadComplete, scrollToSection } from "@/lib/lenis";

/**
 * Hero: headline + role over the site-wide particle background (see
 * components/three/Background.tsx). No local canvas — the backdrop is global.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lines = root.querySelectorAll<HTMLElement>("[data-hero-line]");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(lines, { yPercent: 0, opacity: 1 });
      return;
    }

    gsap.set(lines, { yPercent: 110 });
    // Sequence the intro to start once the preloader has revealed the page.
    const off = onPreloadComplete(() => {
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
      });
    });

    return () => off();
  }, []);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      <div className="section container-wide text-center">
        <p className="eyebrow mb-6">Software Engineer</p>

        <h1 className="text-[11vw] font-bold leading-[0.85] tracking-tighter md:text-[8vw]">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-hero-line className="block">
              MUHAMMAD
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-hero-line className="block">
              SHAHEER
            </span>
          </span>
        </h1>

        <div className="mx-auto mt-8 max-w-2xl overflow-hidden">
          <p data-hero-line className="text-base text-paper/70 md:text-lg">
            Software Engineer building applications across web, desktop &amp;
            systems — currently focused on one for animal welfare.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("#about")}
        data-cursor="link"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-paper/50 transition-colors hover:text-paper"
        aria-label="Scroll to about section"
      >
        <span className="eyebrow">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-paper/40" />
      </button>
    </section>
  );
}
