"use client";

import { useEffect, useRef } from "react";

/**
 * Lerped custom cursor: a small instant dot plus a lagging ring that grows when
 * hovering elements marked with `data-cursor="view" | "link"`. Only enabled on
 * fine-pointer devices; hidden entirely on touch.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const hit = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      ring.dataset.state = hit?.getAttribute("data-cursor") ?? "default";
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(render);
    };
    render();

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden md:block"
        aria-hidden="true"
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </div>
      <div
        ref={ringRef}
        data-state="default"
        className="group pointer-events-none fixed left-0 top-0 z-[95] hidden md:block"
        aria-hidden="true"
      >
        <div className="h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/60 transition-transform duration-300 ease-out-expo group-data-[state=view]:scale-[2.6] group-data-[state=link]:scale-[1.8] group-data-[state=view]:bg-accent/10 group-data-[state=view]:border-accent" />
      </div>
    </>
  );
}
