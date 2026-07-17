import Reveal from "@/components/Reveal";

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
    <section id="skills" className="section section-pad">
      <div className="container-wide">
        <Reveal className="mb-12 md:mb-16">
          <p className="eyebrow">What I do</p>
          <h2 className="mt-3 text-5xl font-bold tracking-tight md:text-7xl">
            Skills &amp; Services
          </h2>
        </Reveal>

        <Reveal
          className="grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-2 lg:grid-cols-4"
          stagger={0.1}
        >
          {groups.map((group) => (
            <div key={group.title} className="bg-ink p-8">
              <h3 className="font-mono text-sm uppercase tracking-widest text-accent">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="text-lg text-paper/80">
                    {item}
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
