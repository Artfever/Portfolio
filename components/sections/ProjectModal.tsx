"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import type { Project } from "@/data/projects";
import { getLenis } from "@/lib/lenis";
import FlakeArt from "./FlakeArt";

/**
 * Full-screen detail overlay for a selected project (SPA feel). The same
 * content is also reachable at the real route /projects/[slug] for sharing.
 */
export default function ProjectModal({
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

    // Lock scrolling behind the modal.
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
        y: 40,
        opacity: 0,
        duration: 0.5,
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
      aria-label={project.title}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm md:p-10"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="relative max-h-full w-full max-w-5xl overflow-y-auto rounded-2xl border border-paper/10 bg-ink p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          data-cursor="link"
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:border-accent hover:text-accent"
        >
          ✕
        </button>

        <div className="flex items-center gap-4">
          <span className="font-mono text-accent">{project.index}</span>
          <h2 className="text-3xl font-bold md:text-5xl">{project.title}</h2>
        </div>

        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl bg-paper/5">
          {project.videoSrc ? (
            <video
              className="h-full w-full object-contain"
              src={project.videoSrc}
              poster={project.posterSrc}
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
            />
          ) : project.animation === "flake" ? (
            <FlakeArt />
          ) : project.posterSrc ? (
            <Image
              src={project.posterSrc}
              alt={`${project.title} preview`}
              fill
              sizes="(max-width: 1024px) 90vw, 1024px"
              className="object-contain"
            />
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
          <p className="leading-relaxed text-paper/80">{project.description}</p>
          <div>
            <h3 className="eyebrow">Stack</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-paper/20 px-3 py-1 font-mono text-xs text-paper/70"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink"
                >
                  Live site ↗
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="rounded-full border border-paper/30 px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
                >
                  Source ↗
                </a>
              )}
            </div>

            <Link
              href={`/projects/${project.slug}`}
              data-cursor="link"
              className="mt-6 inline-block text-sm text-paper/50 underline underline-offset-4 hover:text-paper"
            >
              Open full page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
