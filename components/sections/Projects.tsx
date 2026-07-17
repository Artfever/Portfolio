"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import DescriptionModal from "./DescriptionModal";

/**
 * Horizontal project gallery.
 *  - Desktop + motion allowed: the section pins and the card track scrubs
 *    left→right as you scroll vertically (GSAP ScrollTrigger).
 *  - Mobile / reduced-motion: falls back to a native horizontal swipe scroller
 *    with scroll snapping.
 */
export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [descProject, setDescProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!section || !wrapper || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        // GSAP owns horizontal movement here, so hide the native scrollbar.
        wrapper.style.overflowX = "hidden";
        const distance = () => Math.max(0, track.scrollWidth - wrapper.clientWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.kill();
          wrapper.style.overflowX = "";
          gsap.set(track, { clearProps: "transform" });
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 motion-safe:md:flex motion-safe:md:h-screen motion-safe:md:flex-col motion-safe:md:justify-center motion-safe:md:py-0"
    >
      <div className="section container-wide mb-10 flex items-end justify-between md:mb-14">
        <div>
          <p className="eyebrow">Selected Work</p>
          <h2 className="mt-3 text-5xl font-bold tracking-tight md:text-7xl">
            Projects
          </h2>
        </div>
        <span className="hidden font-mono text-sm text-paper/50 md:block">
          {projects.length.toString().padStart(2, "0")} — Projects · scroll →
        </span>
      </div>

      <div ref={wrapperRef} className="no-scrollbar w-full overflow-x-auto">
        <div
          ref={trackRef}
          className="flex w-max gap-6 pb-4 pl-6 will-change-transform snap-x snap-mandatory md:pl-12 lg:pl-20"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onOpen={setSelected}
              onDescribe={setDescProject}
            />
          ))}
          {/* trailing spacer so the last card isn't glued to the edge */}
          <div className="w-6 shrink-0 md:w-20" aria-hidden="true" />
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
      <DescriptionModal
        project={descProject}
        onClose={() => setDescProject(null)}
      />
    </section>
  );
}
