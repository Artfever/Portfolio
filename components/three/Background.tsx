"use client";

import dynamic from "next/dynamic";

// WebGL can't run server-side — lazy-load the Canvas, client only.
const BackgroundCanvas = dynamic(() => import("./BackgroundCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * Fixed, full-viewport backdrop layer that sits behind every section.
 * pointer-events-none so it never blocks clicks/hovers on the content above.
 */
export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <BackgroundCanvas />
    </div>
  );
}
