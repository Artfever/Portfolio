import FlakeArt from "./FlakeArt";

export type ArtVariant = "flake" | "sdrmis" | "cdiem" | "ocean";

const STREAKS = [
  { l: "10%", w: 2, h: "55%", d: 6, dl: 0 },
  { l: "22%", w: 3, h: "45%", d: 8, dl: 1.2 },
  { l: "34%", w: 2, h: "60%", d: 7, dl: 2 },
  { l: "46%", w: 4, h: "50%", d: 9, dl: 0.6 },
  { l: "58%", w: 2, h: "65%", d: 6.5, dl: 1.8 },
  { l: "70%", w: 3, h: "48%", d: 8.5, dl: 0.3 },
  { l: "82%", w: 2, h: "58%", d: 7.5, dl: 2.4 },
  { l: "90%", w: 3, h: "52%", d: 6, dl: 1 },
  { l: "16%", w: 2, h: "40%", d: 10, dl: 3 },
  { l: "64%", w: 2, h: "42%", d: 9.5, dl: 2.7 },
];

/** SDRMIS — shield mark + wordmark over rising light streaks. */
function Sdrmis() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1420] via-[#0a1017] to-[#07090d]" />
      <div className="absolute inset-0">
        {STREAKS.map((s, i) => (
          <span
            key={i}
            className="psa-streak"
            style={{
              left: s.l,
              width: s.w,
              height: s.h,
              animationDuration: `${s.d}s`,
              animationDelay: `${s.dl}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="flake-float flex flex-col items-center gap-2 text-center">
          <svg viewBox="0 0 100 110" className="h-14 w-14 md:h-16 md:w-16">
            <defs>
              <linearGradient id="sdrmisGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#7cc9f7" />
                <stop offset="1" stopColor="#2b7fd0" />
              </linearGradient>
            </defs>
            <path
              d="M50 6 L88 20 L88 54 C88 82 70 98 50 104 C30 98 12 82 12 54 L12 20 Z"
              fill="url(#sdrmisGrad)"
            />
            <path
              d="M50 18 L76 28 L76 53 C76 73 63 85 50 90 C37 85 24 73 24 53 L24 28 Z"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2.5"
            />
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-[0.15em] text-[#e6f3ff] md:text-3xl">
              SDRMIS
            </span>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#6fb8e6] md:text-xs">
              Smart Disaster Response
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/** CDIEM — wordmark over a forensic scan line + grid. */
function Cdiem() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1418] via-[#0a0f12] to-[#07090b]" />
      <div className="psa-grid absolute inset-0" />
      <div className="psa-scan" />
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <div className="flake-float flex flex-col items-center leading-none">
          <span className="text-4xl font-extrabold tracking-[0.12em] text-[#cfeaf3] md:text-5xl">
            CDIEM
          </span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6fbfd6] md:text-xs">
            Criminal Digital Investigation
          </span>
        </div>
      </div>
    </>
  );
}

/** Ocean Route — wordmark over expanding sonar rings. */
function Ocean() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#08171c] via-[#071013] to-[#06090b]" />
      <div className="absolute inset-0">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="psa-ring" style={{ animationDelay: `${i}s` }} />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <div className="flake-float flex flex-col items-center leading-none">
          <span className="text-3xl font-extrabold tracking-tight text-[#c6f0f2] md:text-4xl">
            Ocean Route
          </span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#57c9d6] md:text-xs">
            Navigation System
          </span>
        </div>
      </div>
    </>
  );
}

/**
 * Animated poster for a project card / detail view. Flake delegates to its
 * dedicated snow scene; the others render a themed mark/wordmark over a
 * background animation unique to each project.
 */
export default function ProjectArt({
  variant,
  className,
}: {
  variant: ArtVariant;
  className?: string;
}) {
  if (variant === "flake") return <FlakeArt className={className} />;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {variant === "sdrmis" && <Sdrmis />}
      {variant === "cdiem" && <Cdiem />}
      {variant === "ocean" && <Ocean />}
    </div>
  );
}
