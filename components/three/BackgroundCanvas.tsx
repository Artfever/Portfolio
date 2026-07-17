"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Particles from "./Particles";
import { isPreloadComplete, onPreloadComplete } from "@/lib/lenis";

/**
 * Site-wide WebGL backdrop. Opaque dark clear colour + matching fog so the
 * particle field fades into depth. Rendered inside a fixed, pointer-events-none
 * layer (see Background.tsx) so it sits behind all page content.
 *
 * Rendering stays paused (frameloop="never") until the preloader finishes, so
 * the GPU isn't split between the intro animation and the hidden backdrop.
 */
export default function BackgroundCanvas() {
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (isPreloadComplete()) {
      setActive(true);
      return;
    }
    return onPreloadComplete(() => setActive(true));
  }, []);

  return (
    <Canvas
      frameloop={active && !reduced ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 9, 20]} />

      <Suspense fallback={null}>
        <Particles reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
