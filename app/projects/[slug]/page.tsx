import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects, getProjectBySlug } from "@/data/projects";
import ProjectArt from "@/components/sections/ProjectArt";

type Params = { params: { slug: string } };

// Pre-render every project page at build time (real, shareable URLs).
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.title} — Muhammad Shaheer`,
    description: project.summary,
  };
}

export default function ProjectPage({ params }: Params) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <main className="section section-pad min-h-screen">
      <div className="container-wide">
        <Link
          href="/#projects"
          className="eyebrow inline-flex items-center gap-2 hover:text-accent"
          data-cursor="link"
        >
          ← Back to work
        </Link>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-accent">{project.index}</span>
            <h1 className="mt-2 text-4xl font-bold md:text-6xl">
              {project.title}
            </h1>
          </div>
          <div className="flex gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-paper/30 px-5 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
                data-cursor="link"
              >
                Live site ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-paper/30 px-5 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
                data-cursor="link"
              >
                Source ↗
              </a>
            )}
          </div>
        </div>

        <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl bg-paper/5">
          {project.videoSrc ? (
            <video
              className="h-full w-full object-contain"
              src={project.videoSrc}
              poster={project.posterSrc}
              controls
              playsInline
              preload="metadata"
            />
          ) : project.animation ? (
            <ProjectArt variant={project.animation} />
          ) : project.posterSrc ? (
            <Image
              src={project.posterSrc}
              alt={`${project.title} preview`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          ) : null}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[2fr_1fr]">
          <p className="text-lg leading-relaxed text-paper/80">
            {project.description}
          </p>
          <div>
            <h2 className="eyebrow">Stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-paper/20 px-3 py-1 font-mono text-xs text-paper/70"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
