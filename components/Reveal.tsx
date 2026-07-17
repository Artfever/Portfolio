"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Distance in px the content travels up as it fades in. */
  y?: number;
  delay?: number;
  duration?: number;
  /** If set, animates the element's *direct children* with this stagger. */
  stagger?: number;
};

/**
 * Reusable scroll-reveal wrapper. Fades + slides content in when it enters the
 * viewport (start: "top 80%"), or staggers its direct children when `stagger`
 * is provided. Respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className,
  y = 40,
  delay = 0,
  duration = 0.9,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targets: gsap.TweenTarget =
      stagger != null ? Array.from(el.children) : el;

    if (prefersReduced) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger: stagger ?? 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, duration, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
