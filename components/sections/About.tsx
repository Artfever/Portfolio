"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";

const stats = [
  { value: 2.5, decimals: 1, suffix: "+", label: "Years coding" },
  { value: 10, suffix: "+", label: "Projects built" },
  { value: 13, suffix: "+", label: "Technologies" },
];

function Stat({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.textContent = `${value.toFixed(decimals)}${suffix}`;
      return;
    }

    const counter = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          v: value,
          duration: 1.6,
          ease: "power2.out",
          snap: { v: decimals > 0 ? 0.1 : 1 },
          onUpdate: () => {
            el.textContent = `${counter.v.toFixed(decimals)}${suffix}`;
          },
        }),
    });

    return () => st.kill();
  }, [value, suffix, decimals]);

  return (
    <div>
      <span
        ref={numberRef}
        className="block font-mono text-4xl font-bold text-accent md:text-6xl"
      >
        {(0).toFixed(decimals)}
        {suffix}
      </span>
      <span className="mt-2 block text-sm text-paper/60">{label}</span>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="section section-pad">
      <div className="container-wide">
        <Reveal className="mb-12 md:mb-16">
          <p className="eyebrow">About</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            A little about me
          </h2>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Portrait — replace /portrait-placeholder.svg with your photo.
              For a raster image (jpg/png/webp) you can switch to next/image. */}
          <Reveal>
            <figure className="group relative w-full max-w-sm">
              <div className="absolute -inset-3 -z-10 rounded-3xl bg-accent/15 opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-paper/10">
                <Image
                  src="/portrait.jpg"
                  alt="Portrait of Muhammad Shaheer"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover grayscale transition-all duration-700 ease-out-expo group-hover:grayscale-0 group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between font-mono text-xs text-paper/40">
                <span>Muhammad Shaheer</span>
                <span>Islamabad, PK</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="flex flex-col gap-12">
            <Reveal className="space-y-6 text-lg leading-relaxed text-paper/80">
              <p>
                I&apos;m Muhammad Shaheer, a software engineer and third-year
                Software Engineering student at FAST NUCES Islamabad. I&apos;ve been
                coding for 2.5+ years and have built 10+ projects spanning web,
                desktop, and systems programming.
              </p>
              <p>
                I love building all kinds of applications — right now I&apos;m
                focused on one for animal welfare. I work across the stack with
                C++, C#, Java, and the JavaScript ecosystem, and edit video on
                the side.
              </p>
            </Reveal>

            <Reveal
              className="grid grid-cols-2 gap-8 border-t border-paper/10 pt-10 md:grid-cols-3"
              stagger={0.1}
            >
              {stats.map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
