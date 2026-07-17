import Reveal from "@/components/Reveal";
import CodeRain from "./CodeRain";

const groups = [
  {
    title: "Languages",
    items: ["C++", "C#", "C", "Java", "Assembly"],
  },
  {
    title: "Web & Backend",
    items: ["Next.js", "React", "Node.js", "HTML", "CSS"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "SQLite", "SQL"],
  },
  {
    title: "Creative & Tools",
    items: [
      "After Effects",
      "Filmora",
      "CapCut",
      "Topaz",
      "Kiro",
      "Aikido (security)",
      "Gemini",
    ],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="section section-pad relative overflow-hidden"
    >
      <CodeRain />

      <div className="container-wide relative z-10">
        <Reveal className="mb-12 md:mb-16">
          <p className="eyebrow">What I do</p>
          <h2 className="mt-3 text-5xl font-bold tracking-tight md:text-7xl">
            Skills &amp; Services
          </h2>
        </Reveal>

        <Reveal
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          stagger={0.12}
        >
          {groups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-paper/10 bg-ink/50 p-6 backdrop-blur-md transition-colors duration-500 hover:border-accent/40"
            >
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group/skill flex items-center gap-2 text-lg font-semibold text-paper/85 transition-colors duration-300 hover:text-accent"
                  >
                    <span className="w-3 shrink-0 font-mono text-sm text-accent opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100">
                      {">"}
                    </span>
                    <span className="transition-transform duration-300 ease-out-expo group-hover/skill:translate-x-1">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
