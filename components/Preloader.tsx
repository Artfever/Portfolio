"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { markPreloadComplete } from "@/lib/lenis";

/**
 * Preloader: traces a straight, symmetric "A" mark (just the two legs — / then
 * \) with a reflection beneath it, then reveals the site once assets are ready
 * (~2.3s). Only the stroke draw animates, so it stays smooth. Instant under
 * prefers-reduced-motion.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("is-loading");

    const root = rootRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    const label = labelRef.current;
    const strokes = svg
      ? Array.from(svg.querySelectorAll<SVGPathElement>("[data-stroke]"))
      : [];

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let settled = false;
    let drawn = false;
    let exited = false;

    const maybeExit = () => {
      if (exited || !settled || !drawn) return;
      exited = true;
      window.clearTimeout(safety);

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove("is-loading");
          markPreloadComplete();
          setDone(true);
        },
      });

      if (!prefersReduced && stage) {
        tl.to([stage, label], {
          scale: 1.1,
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
        });
      }
      if (root) {
        tl.to(
          root,
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          prefersReduced ? 0 : "-=0.1"
        );
      }
    };

    const tasks: Promise<unknown>[] = [];
    if ("fonts" in document) tasks.push(document.fonts.ready);
    tasks.push(
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      })
    );
    Promise.allSettled(tasks).then(() => {
      settled = true;
      maybeExit();
    });

    const safety = window.setTimeout(() => {
      settled = true;
      maybeExit();
    }, 7000);

    strokes.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    let introTl: gsap.core.Timeline | null = null;

    if (prefersReduced) {
      gsap.set(strokes, { strokeDashoffset: 0 });
      gsap.set([stage, label], { opacity: 1 });
      drawn = true;
      maybeExit();
    } else {
      gsap.set(stage, { opacity: 0 });
      gsap.set(label, { opacity: 0, y: 8 });

      const [leg1, leg2] = strokes;

      introTl = gsap.timeline({
        onComplete: () => {
          drawn = true;
          maybeExit();
        },
      });

      introTl.to(stage, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);

      // draw / then \
      if (leg1)
        introTl.to(
          leg1,
          { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" },
          0.2
        );
      if (leg2)
        introTl.to(
          leg2,
          { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" },
          1.05
        );

      introTl
        .to(label, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.5)
        .to({}, { duration: 0.3 }); // brief hold
    }

    return () => {
      window.clearTimeout(safety);
      introTl?.kill();
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      aria-hidden="true"
    >
      <div ref={stageRef} className="reflect-a" style={{ opacity: 0 }}>
        <svg ref={svgRef} width="170" height="190" viewBox="0 0 200 220" fill="none">
          <defs>
            <linearGradient id="aStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#8f8b82" />
            </linearGradient>
          </defs>
          <g
            stroke="url(#aStroke)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path data-stroke d="M44 200 L100 24" />
            <path data-stroke d="M100 24 L156 200" />
          </g>
        </svg>
      </div>

      <span
        ref={labelRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.45em] text-paper/40"
      >
        Artfever
      </span>
    </div>
  );
}
