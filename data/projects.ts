export type Project = {
  slug: string;
  title: string;
  index: string; // "001", "002" for the numbered list style
  summary: string;
  description: string; // longer text for the modal / detail view
  stack: string[];
  videoSrc?: string; // optional .mp4 demo clip — omit for projects with no video
  posterSrc?: string; // image shown on the card / detail view (and video poster)
  animation?: "flake" | "sdrmis" | "cdiem" | "ocean"; // custom animated poster
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "flake",
    title: "Flake",
    index: "01",
    summary: "An all-in-one student portal — my rework of FAST's Flex.",
    description:
      "Flake is an all-in-one student portal that reworks FAST's Flex, bringing the core functionality of Google Classroom, email, and Flex together in a single, unified interface. Built with HTML and CSS on the frontend and Python with the Flask framework on the backend.",
    stack: ["HTML", "CSS", "Python", "Flask"],
    animation: "flake",
    liveUrl: "https://student-portal-project-bice.vercel.app/",
    repoUrl: "https://github.com/Artfever/Student-Portal-Project",
  },
  {
    slug: "smart-disaster-response",
    title: "Smart Disaster Response MIS",
    index: "02",
    summary:
      "A management information system for coordinating disaster response in real time.",
    description:
      "A Smart Disaster Response Management Information System built to coordinate emergency operations. It centralizes incident reporting, resource allocation, and role-based access so response teams can act quickly and stay in sync. The interface is built with Next.js, React, and Framer Motion, backed by a Node.js and Express API, a MySQL database, and secure authentication using JSON Web Tokens with bcrypt password hashing.",
    stack: ["Next.js", "React", "Node.js", "Express", "MySQL", "JWT", "Framer Motion"],
    videoSrc: "/videos/Project-2.mp4",
    animation: "sdrmis",
    repoUrl: "https://github.com/TahaSohail-Goat/SmartDisasterResponseMIS",
  },
  {
    slug: "cdiem",
    title: "CDIEM",
    index: "03",
    summary:
      "A desktop system for managing criminal investigations and digital evidence.",
    description:
      "CDIEM (Criminal Digital Investigation & Evidence Management) is a desktop application for managing criminal investigations and the digital evidence tied to them. It centralizes case records, evidence tracking, and investigation workflows in one structured, organized system. Built with JavaFX and Java, backed by a MySQL database, with a CSS-styled interface.",
    stack: ["JavaFX", "Java", "MySQL", "CSS"],
    videoSrc: "/videos/Project-3.mp4",
    animation: "cdiem",
    repoUrl: "https://github.com/Artfever/CDIEM-Projct",
  },
  {
    slug: "ocean-route-navigation",
    title: "Ocean Route Navigation",
    index: "04",
    summary:
      "Finds the shortest, lowest-cost sea routes between ports using graph algorithms.",
    description:
      "An Ocean Route Navigation System that computes the shortest and lowest-cost sea routes between ports. It models the ports and their connections as a graph and applies core pathfinding algorithms — A*, Dijkstra, BFS, and DFS — to find optimal, cost-efficient routes. Built in C++ with SFML for real-time visualization.",
    stack: ["C++", "SFML", "A* / Dijkstra", "BFS / DFS"],
    videoSrc: "/videos/Project-4.mp4",
    animation: "ocean",
    repoUrl: "https://github.com/Artfever/Ocean-Route-Navigation-Project",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
