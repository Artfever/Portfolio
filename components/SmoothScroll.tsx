"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerLenis, isPreloadComplete, onPreloadComplete } from "@/lib/lenis";

/**
 * Root-level client component that:
 *  - initializes Lenis smooth scroll
 *  - drives lenis.raf() from gsap.ticker so GSAP + Lenis share one clock
 *  - forwards Lenis scroll events to ScrollTrigger.update()
 *  - keeps the page locked until the preloader finishes
 *
 * Get this right before building scroll-linked sections/3D — it's what makes
 * everything feel synced instead of janky.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Reduced motion: skip smooth scroll, use native scrolling only.
    if (prefersReduced) {
      const off = onPreloadComplete(() => ScrollTrigger.refresh());
      return () => off();
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    registerLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Lock scroll until the preloader reveals the page (shared flag avoids a race).
    if (!isPreloadComplete()) {
      lenis.stop();
    }
    const off = onPreloadComplete(() => {
      lenis.start();
      ScrollTrigger.refresh();
    });

    return () => {
      off();
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      registerLenis(null);
    };
  }, []);

  return <>{children}</>;
}
