"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const socials = [
  {
    label: "Email",
    value: "shaheerraiden@gmail.com",
    href: "mailto:shaheerraiden@gmail.com",
  },
  { label: "GitHub", value: "@Artfever", href: "https://github.com/Artfever" },
  {
    label: "LinkedIn",
    value: "Muhammad Shaheer",
    href: "https://www.linkedin.com/in/muhammad-shaheer-28bb1a3ab/",
  },
  {
    label: "Instagram",
    value: "@artfever_2",
    href: "https://www.instagram.com/artfever_2/",
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText("Artfever");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; ignore */
    }
  };

  return (
    <section id="contact" className="section section-pad">
      <div className="container-wide grid gap-16 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-4 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            Let&apos;s
            <br />
            connect.
          </h2>
          <p className="mt-8 max-w-md text-lg text-paper/70">
            Have a project, an opportunity, or just want to say hi? I&apos;m
            around on all of these — reach out anywhere.
          </p>
        </Reveal>

        <Reveal
          className="flex flex-col divide-y divide-paper/10 border-y border-paper/10"
          stagger={0.08}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="group flex items-center justify-between gap-4 py-5"
            >
              <span className="text-2xl font-bold tracking-tight transition-transform duration-300 ease-out-expo group-hover:translate-x-2 md:text-3xl">
                {s.label}
              </span>
              <span className="flex items-center gap-2 text-right font-mono text-sm text-paper/50 transition-colors group-hover:text-accent">
                {s.value}
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}

          {/* Discord has no public profile URL — click to copy the handle */}
          <button
            type="button"
            onClick={copyDiscord}
            data-cursor="view"
            className="group flex items-center justify-between gap-4 py-5 text-left"
            aria-label="Copy Discord username"
          >
            <span className="text-2xl font-bold tracking-tight transition-transform duration-300 ease-out-expo group-hover:translate-x-2 md:text-3xl">
              Discord
            </span>
            <span className="flex items-center gap-2 font-mono text-sm text-paper/50 transition-colors group-hover:text-accent">
              {copied ? "Copied!" : "Artfever"}
              <span aria-hidden="true">⧉</span>
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
