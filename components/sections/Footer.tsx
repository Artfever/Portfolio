import Reveal from "@/components/Reveal";

const socials = [
  { label: "GitHub", href: "https://github.com/Artfever" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muhammad-shaheer-28bb1a3ab/",
  },
  { label: "Email", href: "mailto:shaheerraiden@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="section border-t border-paper/10 pb-10 pt-20">
      <div className="container-wide">
        <Reveal className="grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-paper/10 p-8">
            <p className="eyebrow">Based in</p>
            <p className="mt-3 text-2xl font-bold">Islamabad, Pakistan</p>
            <p className="mt-2 text-paper/60">
              Open to remote work &amp; collaboration.
            </p>
          </div>
          <div className="rounded-2xl border border-paper/10 p-8">
            <p className="eyebrow">Availability</p>
            <p className="mt-3 text-2xl font-bold">Open to opportunities</p>
            <p className="mt-2 text-paper/60">
              Internships, freelance &amp; collaboration — let&apos;s talk.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-8 border-t border-paper/10 pt-10 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-6" aria-label="Social links">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="text-sm text-paper/60 transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </nav>

          <a
            href="/resume.pdf"
            download
            data-cursor="link"
            className="text-sm text-paper/60 transition-colors hover:text-accent"
          >
            Download résumé ↗
          </a>

          <p className="font-mono text-xs text-paper/40">
            © {new Date().getFullYear()} Muhammad Shaheer
          </p>
        </div>
      </div>
    </footer>
  );
}
