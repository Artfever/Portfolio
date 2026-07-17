/**
 * Custom animated poster for the Flake project — recreates the "FLAKE / All In
 * One Academic Portal" logo (a blue snowflake mark + wordmark) as a live
 * animation over a gentle falling-snow backdrop. The snow is deliberately
 * different from the site's drifting star-field so this card reads as its own
 * little scene. Pure CSS animation (no JS), deterministic so it's SSR-safe.
 */

// Deterministic snow particles (left %, size px, duration s, delay s).
const SNOW = [
  { l: "4%", s: 2, d: 8, dl: 0 },
  { l: "12%", s: 3, d: 6, dl: 1.5 },
  { l: "20%", s: 2, d: 9, dl: 0.5 },
  { l: "28%", s: 4, d: 7, dl: 2 },
  { l: "36%", s: 2, d: 10, dl: 1 },
  { l: "44%", s: 3, d: 6.5, dl: 3 },
  { l: "52%", s: 2, d: 8.5, dl: 0.8 },
  { l: "60%", s: 3, d: 7.5, dl: 2.4 },
  { l: "68%", s: 2, d: 9.5, dl: 1.2 },
  { l: "76%", s: 4, d: 6, dl: 0.3 },
  { l: "84%", s: 2, d: 8, dl: 2.8 },
  { l: "92%", s: 3, d: 7, dl: 1.7 },
  { l: "16%", s: 2, d: 11, dl: 3.5 },
  { l: "48%", s: 3, d: 10.5, dl: 4 },
  { l: "72%", s: 2, d: 9, dl: 3.2 },
  { l: "88%", s: 3, d: 8, dl: 4.5 },
];

export default function FlakeArt({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {/* wintery gradient (distinct from the site's flat dark) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1826] via-[#0a1017] to-[#07090d]" />

      {/* falling snow */}
      <div className="absolute inset-0">
        {SNOW.map((f, i) => (
          <span
            key={i}
            className="flake-dot"
            style={{
              left: f.l,
              width: f.s,
              height: f.s,
              animationDuration: `${f.d}s`,
              animationDelay: `${f.dl}s`,
            }}
          />
        ))}
      </div>

      {/* logo */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="flake-float flex items-center gap-3 md:gap-4">
          <svg
            viewBox="0 0 100 100"
            className="flake-spin h-14 w-14 shrink-0 md:h-16 md:w-16"
          >
            <defs>
              <linearGradient id="flakeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#63c7f5" />
                <stop offset="1" stopColor="#2b8fd4" />
              </linearGradient>
              <g
                id="flakeArm"
                stroke="url(#flakeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              >
                <line x1="50" y1="50" x2="50" y2="6" />
                <line x1="50" y1="16" x2="40" y2="7" />
                <line x1="50" y1="16" x2="60" y2="7" />
                <line x1="50" y1="30" x2="42" y2="22" />
                <line x1="50" y1="30" x2="58" y2="22" />
              </g>
            </defs>
            <use href="#flakeArm" />
            <use href="#flakeArm" transform="rotate(60 50 50)" />
            <use href="#flakeArm" transform="rotate(120 50 50)" />
            <use href="#flakeArm" transform="rotate(180 50 50)" />
            <use href="#flakeArm" transform="rotate(240 50 50)" />
            <use href="#flakeArm" transform="rotate(300 50 50)" />
            <rect
              x="43"
              y="43"
              width="14"
              height="14"
              rx="2"
              transform="rotate(45 50 50)"
              fill="url(#flakeGrad)"
            />
          </svg>

          <div className="flex flex-col leading-none">
            <span className="text-3xl font-extrabold tracking-tight text-[#2b8fd4] md:text-4xl">
              FLAKE
            </span>
            <span className="mt-1.5 text-[10px] font-semibold tracking-wide text-[#4a9fd8] md:text-xs">
              All In One Academic Portal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
