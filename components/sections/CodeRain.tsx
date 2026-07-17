"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "01{}[]()<>/\\=+-*;:&|!?$#%01ABCDEF01";

/**
 * Subtle monospace "code rain" (matrix-style) used as the Skills section
 * backdrop — a coding vibe that's distinct from the site's particle field.
 * 2D canvas, throttled to ~18fps, paused when the section is off-screen, and
 * disabled under prefers-reduced-motion.
 */
export default function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const fontSize = 15;

    let width = 0;
    let height = 0;
    let cols = 0;
    let drops: number[] = [];

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      ctx.textBaseline = "top";
      const next = Math.ceil(width / fontSize);
      drops = new Array(next)
        .fill(0)
        .map((_, i) => drops[i] ?? Math.floor(Math.random() * -30));
      cols = next;
    };

    let raf = 0;
    let last = 0;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 55) return; // ~18fps
      last = t;

      ctx.fillStyle = "rgba(10, 10, 10, 0.1)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(245, 244, 240, 0.85)";

      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const start = () => {
      if (!raf && !reduced) {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    setup();

    const ro = new ResizeObserver(() => setup());
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.45]"
    />
  );
}
