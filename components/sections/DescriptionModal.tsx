"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Project } from "@/data/projects";
import { getLenis } from "@/lib/lenis";

/**
 * Minimal same-page overlay that shows only a project's text description
 * (opened by the "Description" button on a card). Same open/close behaviour as
 * the video modal — backdrop click, Escape, and scroll lock.
 */
export default function DescriptionModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;

    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const ctx = gsap.context(() => {
      gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
      gsap.from(panelRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.45,
        ease: "power3.out",
        delay: 0.05,
      });
    });

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} description`}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm md:p-10"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="relative max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-paper/10 bg-ink p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          data-cursor="link"
          aria-label="Close"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:border-accent hover:text-accent"
        >
          ✕
        </button>

        <div className="flex items-center gap-4">
          <span className="font-mono text-accent">{project.index}</span>
          <h2 className="text-2xl font-bold md:text-4xl">{project.title}</h2>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-paper/80">
          {project.description}
        </p>
      </div>
    </div>
  );
}
