# Portfolio Website — Implementation Plan

Reference: fame-estate.com (Dubai real estate agency site)
Goal: a Next.js + Three.js single-page portfolio with a preloader, numbered
section navigation, scroll-driven animation, and a video-based project
showcase — deployable on Vercel out of the box.

---

## 1. Why this stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | Zero-config Vercel deploys, image/video optimization, easy routing if you add case-study pages later |
| 3D | **three.js** via **@react-three/fiber** + **@react-three/drei** | Declarative Three.js in React, avoids manual render-loop plumbing |
| Scroll & motion | **GSAP + ScrollTrigger** | Industry standard for the kind of pinned/scrubbed section transitions fame-estate.com uses |
| Smooth scroll | **Lenis** (`@studio-freight/lenis`) | Gives the inertial "buttery" scroll feel that site has; syncs with ScrollTrigger |
| Styling | **Tailwind CSS** | Fast iteration, easy to keep design tokens consistent |
| Video | **next/video-ish custom `<video>` wrapper** + lazy `IntersectionObserver` | Native `<video>` with poster frames, no bloated player lib needed |
| Hosting | **Vercel** | Native Next.js support, free tier fine for a portfolio |

---

## 2. What we're borrowing from fame-estate.com

Observed structure/pattern on the reference site:

1. **Preloader** — "0% loaded" counter before the page reveals.
2. **Fixed numbered side nav** — `[1] Intro [2] About [3] Work [4] Services...`
   that highlights the active section as you scroll, with each item
   double-labelled for a hover text-swap effect.
3. **Full-bleed section-by-section scroll** — each section pins briefly,
   content animates in (fade/slide/mask reveals), then releases.
4. **Big stat counters** that count up when scrolled into view.
5. **Horizontal/scroll-driven case gallery** (their "cases" list, numbered `001, 002...`).
6. **Team/testimonial carousel** with prev/next controls.
7. **Contact section with a form**, then a **footer with two "office" cards**.
8. **Custom cursor + micro-interactions** on hover (implied by the site's polish).

We'll map these 1:1 onto a portfolio:

| fame-estate.com section | Your portfolio equivalent |
|---|---|
| Intro / hero | Hero — name, role, 3D centerpiece |
| About | About — bio, stats (years coding, projects shipped, stack) |
| Cases (001, 002...) | **Projects** — numbered list, each opens a video + detail panel |
| Services | Skills/Services (what you build: web, 3D, backend, etc.) |
| Partnership | (optional) Tools/Stack or Testimonials |
| Team | (optional) skip, or "Now" / current focus |
| Contact | Contact form |
| Footer offices | Footer — socials, resume link, location |

---

## 3. Folder structure

```
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # assembles all sections
│   ├── globals.css
│   └── api/contact/route.ts     # optional serverless contact endpoint
├── components/
│   ├── Preloader.tsx
│   ├── SmoothScroll.tsx         # Lenis + ScrollTrigger bridge (client component)
│   ├── CustomCursor.tsx
│   ├── NavDots.tsx              # numbered fixed nav
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectModal.tsx     # fullscreen video + detail view
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── three/
│       ├── Scene.tsx            # <Canvas> wrapper, camera, lights
│       ├── HeroObject.tsx       # main 3D model/particles for hero
│       └── ScrollRig.tsx        # ties Three.js camera/object state to scroll progress
├── data/
│   └── projects.ts              # array of project objects (typed)
├── public/
│   ├── videos/                  # project demo videos (or use a CDN, see §6)
│   └── models/                  # .glb/.gltf assets if any
├── lib/
│   └── utils.ts
├── next.config.js
├── tailwind.config.ts
├── package.json
└── vercel.json                  # only if you need custom headers/redirects
```

---

## 4. Core interaction system

### 4.1 Smooth scroll + ScrollTrigger sync
Create one client component mounted at the root that:
- Initializes `Lenis`
- On every Lenis `scroll` event, calls `ScrollTrigger.update()`
- Uses `gsap.ticker.add()` to drive `lenis.raf()` instead of `requestAnimationFrame` directly, so GSAP and Lenis share one clock.

This is the piece that makes scroll-linked 3D and text animation feel synced instead of janky — get this right first before building sections.

### 4.2 Preloader
- Preload critical assets (hero 3D model, first project video poster, fonts) with a simple asset manager (`Promise.all`).
- Animate a percentage counter (0→100) tied to real load progress, not a fake timer.
- On complete: fade/mask out, then call `ScrollTrigger.refresh()` (layout may have shifted) and enable scroll (Lenis `start()`).
- Keep body scroll locked (`overflow: hidden` / Lenis `stop()`) until preload finishes.

### 4.3 Numbered side navigation
- Fixed position, one entry per section (`01 Intro`, `02 About`, `03 Work`...).
- Use `ScrollTrigger` per section to toggle an `active` class.
- Hover effect: two stacked spans, translate-Y swap on hover (the "double label" trick from the reference site).
- Clicking scrolls via `lenis.scrollTo(el, { duration: 1.2 })`.

### 4.4 Custom cursor
- A small fixed div that follows the pointer with a lerp/lag (not 1:1) for a premium feel.
- Grows/changes on hover over project cards and links (`data-cursor="view"` attribute pattern + a single mousemove listener with event delegation).

### 4.5 3D hero (three.js)
Options depending on your comfort level and desired visual:
- **Particle field / abstract geometry** reacting to scroll + mouse (cheapest to build, very "agency site" feeling) — use `InstancedMesh` or `Points` with a custom shader, or drei's `<Sparkles>`/`<Float>` as a fast start.
- **A single stylized 3D model** (e.g., your initials, a logo mark, or an object relevant to your work) imported as `.glb`, rotated/scaled on scroll via `ScrollTrigger` driving a ref.
- Keep the render loop lightweight: cap `dpr` to `[1, 1.5]`, disable shadows unless needed, use `frameloop="demand"` on `<Canvas>` and only re-render on scroll/pointer changes if the scene is otherwise static — this matters a lot for mobile performance.

### 4.6 Section reveal animations
- Use one reusable `<Reveal>` wrapper component that GSAP-animates children (`opacity`, `y`, optional `clipPath` mask) via `ScrollTrigger` with `start: 'top 80%'`.
- Give each section a *distinct* motion signature so it doesn't feel copy-pasted, e.g.:
  - Hero: 3D object scales in + text mask-reveals line by line.
  - About: stat numbers count up (`gsap.to` with `snap: 1` on a value + `onUpdate` to update text).
  - Projects: cards stagger in with slight rotation, scale on hover.
  - Contact: form fields fade/slide in sequence.

---

## 5. Projects section (your main differentiator)

Since these are *your built projects* with videos + details, not just images:

**Data shape** (`data/projects.ts`):
```ts
export type Project = {
  slug: string;
  title: string;
  index: string;       // "001", "002" for the numbered list style
  summary: string;
  description: string; // longer text for the modal/detail view
  stack: string[];
  videoSrc: string;     // .mp4, ideally already compressed (h264, <10-15MB)
  posterSrc: string;    // static frame shown before video loads/plays
  liveUrl?: string;
  repoUrl?: string;
};
```

**Behavior:**
- List view mirrors the reference site's numbered case list — title + index number, video plays muted/looped as a *background preview* on hover (desktop) or autoplay-in-view (mobile), using `IntersectionObserver` to only load/play video when the card is near viewport.
- Clicking a card opens a **full-screen modal/route** (`/projects/[slug]` works well — real URLs, shareable, and Next.js will statically generate them) with:
  - Large video player (controls enabled here)
  - Description, stack badges, links to live site / repo
  - GSAP shared-element-style transition: the clicked card's video expands into the modal position rather than a hard cut.
- **Performance rule:** never autoplay more than one full-res video at a time. Use low-res/blurred poster images generated at build time (e.g., a tiny frame extracted with `ffmpeg`) as placeholders.

---

## 6. Video hosting — decide this early

**Chosen approach: self-hosted.** Videos live in `/public/videos` in the
repo, get pushed to GitHub, and Vercel deploys/serves them automatically via
its CDN — same flow as the rest of the site, no extra service or account
needed. `videoSrc` in `projects.ts` is just a relative path
(`/videos/project1.mp4`), and the native `<video>` tag plays it directly.

**Why compression is mandatory with this approach (not optional):**
- **GitHub file limit:** hard block on any single file over 100MB, warnings
  from ~50MB. Raw project-demo footage crosses this fast — compress before
  committing, or you'll need Git LFS just to push.
- **Vercel bandwidth cap:** the free Hobby plan includes 100GB/month of
  bandwidth; once it's used up, new deployments get blocked and dynamic
  routes can start failing until the monthly reset. Compressed clips mean
  far more visitor views per GB before that ever becomes a concern.
- **Load speed:** uncompressed video stalls on mobile connections, which
  undercuts the whole "smooth" feel this plan is built around.

**Compression command:**
```
ffmpeg -i input.mp4 -vcodec h264 -crf 26 -preset slow output.mp4
```
- Card hover-preview loops (muted, short, background): target **5–15MB**.
- Full-quality demo clip in the project modal: target **~30–50MB**.

Always pair every `<video>` with a `poster` image and
`preload="none"`/`"metadata"` so nothing downloads until it's actually
needed (see §5's `IntersectionObserver` gating).

**If the project ever outgrows self-hosting** (many long videos, or hitting
the 100GB/month bandwidth cap regularly): move to **Cloudinary**, **Mux**,
or **Bunny Stream** — generous free/cheap tiers, adaptive bitrate streaming,
and no repo bloat. Only the `videoSrc` URLs in `projects.ts` need to change;
nothing else in the architecture moves.

---

## 7. Performance & Vercel deploy checklist

- [ ] `next/font` for self-hosted fonts (no FOUT, no extra network hop)
- [ ] Lazy-load the `<Canvas>` (three.js) with `next/dynamic(() => import(...), { ssr: false })` — WebGL can't run server-side
- [ ] `frameloop="demand"` on the Canvas where the scene is idle most of the time
- [ ] Compress all videos/images before commit (`ffmpeg`, `sharp`/`squoosh` for images); use `.webp`/`.avif` posters
- [ ] `IntersectionObserver` gating for any video autoplay
- [ ] Respect `prefers-reduced-motion` — disable/simplify GSAP + Three.js motion for users who request it
- [ ] Test on a throttled mobile profile (Three.js scenes are the most common perf killer on phones)
- [ ] `vercel.json` only needed if you add custom caching headers for `/videos/*`
- [ ] Connect the GitHub repo to Vercel → every push to `main` auto-deploys; PRs get preview URLs for free — use those to review animation timing before merging

---

## 8. Suggested build order

1. Scaffold Next.js + Tailwind, deploy an empty page to Vercel first (confirms pipeline works before anything gets complex).
2. Build `SmoothScroll` (Lenis + ScrollTrigger bridge) and confirm it works on a placeholder page.
3. Build static section layout (Hero/About/Projects/Contact/Footer) with no animation — get content and responsive layout right first.
4. Add `NavDots` + section-active tracking.
5. Add GSAP reveal animations section by section.
6. Add the three.js hero scene, lazy-loaded, scroll-linked.
7. Build the Projects data + list + modal/detail route, wire up videos with lazy loading.
8. Add Preloader last (once you know what actually needs preloading).
9. Add custom cursor + final micro-interaction polish.
10. Performance pass (Lighthouse + mobile throttling) before calling it done.

---

## 9. package.json — core dependencies

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "three": "^0.165",
    "@react-three/fiber": "^8",
    "@react-three/drei": "^9",
    "gsap": "^3",
    "@studio-freight/lenis": "^1",
    "tailwindcss": "^3",
    "clsx": "^2"
  }
}
```

---

## 10. Open decisions to make before/while building

- Exact 3D concept for the hero (abstract particles vs. a modeled object) — pick based on what you can source/build a `.glb` for, or how comfortable you are with shader work.
- Number of sections beyond Hero/About/Projects/Contact — do you want Skills, Testimonials, or a Now/Blog section?
- Video hosting choice (§6) — depends on how many/how large your project demo videos are.
- Whether project detail pages are modals (SPA feel) or real routes (`/projects/[slug]`, better for sharing + SEO) — real routes are recommended.
