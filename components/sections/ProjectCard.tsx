"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import FlakeArt from "./FlakeArt";

const primaryBtn =
  "inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-ink transition-transform duration-300 ease-out-expo hover:scale-[1.04]";
const outlineBtn =
  "inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-2 text-[13px] font-medium text-paper transition-colors duration-300 hover:border-accent hover:text-accent";

/**
 * Project card (box). Shows the poster (a muted hover-preview video when the
 * project has one, otherwise a static image), the title/summary, stack badges,
 * and up to three actions: Watch video (opens the modal) or View project (live
 * site), Code (repo), and Description (detail page). Media is black & white and
 * returns to colour on hover.
 */
export default function ProjectCard({
  project,
  onOpen,
  onDescribe,
}: {
  project: Project;
  onOpen: (p: Project) => void;
  onDescribe: (p: Project) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const hasVideo = Boolean(project.videoSrc);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const play = () =>
    videoRef.current?.play().catch(() => {
      /* autoplay can reject; ignore */
    });

  const pause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0.1;
  };

  const mediaClass =
    "h-full w-full object-cover grayscale transition-all duration-700 ease-out-expo group-hover:grayscale-0 group-hover:scale-105";

  return (
    <article
      ref={cardRef}
      onMouseEnter={hasVideo ? play : undefined}
      onMouseLeave={hasVideo ? pause : undefined}
      className="group relative flex w-[85vw] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.03] backdrop-blur-sm transition-colors duration-500 hover:border-paper/25 sm:w-[460px]"
    >
      {/* poster / hover preview */}
      <div className="relative aspect-video w-full overflow-hidden bg-paper/5">
        {hasVideo ? (
          inView && (
            // #t=0.1 makes the browser show a real frame as the thumbnail
            <video
              ref={videoRef}
              src={`${project.videoSrc}#t=0.1`}
              muted
              loop
              playsInline
              preload="metadata"
              className={mediaClass}
            />
          )
        ) : project.animation === "flake" ? (
          <FlakeArt className="grayscale transition-[filter] duration-700 ease-out-expo group-hover:grayscale-0" />
        ) : project.posterSrc ? (
          <Image
            src={project.posterSrc}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 640px) 85vw, 460px"
            className="object-contain grayscale transition-all duration-700 ease-out-expo group-hover:grayscale-0"
          />
        ) : null}
        <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-2.5 py-1 font-mono text-xs text-accent backdrop-blur-sm">
          {project.index}
        </span>
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-paper/60">
          {project.summary}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-paper/15 px-2.5 py-1 font-mono text-[11px] text-paper/60"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {project.videoSrc && (
            <button
              type="button"
              onClick={() => onOpen(project)}
              data-cursor="view"
              className={primaryBtn}
              aria-label={`Watch video for ${project.title}`}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2 1.5v9l8-4.5-8-4.5z" />
              </svg>
              Watch video
            </button>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className={primaryBtn}
            >
              View project <span aria-hidden="true">↗</span>
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className={outlineBtn}
            >
              Code <span aria-hidden="true">↗</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onDescribe(project)}
            data-cursor="view"
            className={outlineBtn}
            aria-label={`Read description of ${project.title}`}
          >
            Description <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}
