"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, MathUtils, type Points } from "three";

/**
 * A drifting field of glowing particles used as the site-wide background.
 * Points are self-lit (additive blending) so they read as soft light specks on
 * the dark backdrop. The field slowly rotates, parallaxes to the pointer, and
 * drifts a touch with scroll. Because it lives in a pointer-events-none layer,
 * mouse tracking uses a window listener rather than R3F's canvas pointer.
 */
export default function Particles({
  count = 5000,
  reduced,
}: {
  count?: number;
  reduced?: boolean;
}) {
  const ref = useRef<Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Monochrome / off-white palette: white dust with warm off-white + soft grays.
    const palette = [
      new Color("#ffffff"),
      new Color("#ede9e1"),
      new Color("#b8b2a6"),
      new Color("#8a8478"),
    ];

    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c =
        Math.random() < 0.6
          ? palette[0]
          : palette[1 + Math.floor(Math.random() * 3)];
      const intensity = 0.35 + Math.random() * 0.6;

      colors[i * 3] = c.r * intensity;
      colors[i * 3 + 1] = c.g * intensity;
      colors[i * 3 + 2] = c.b * intensity;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (reduced || !p) return;

    p.rotation.y += delta * 0.025;
    p.rotation.x = MathUtils.lerp(
      p.rotation.x,
      -mouse.current.y * 0.12 + state.clock.elapsedTime * 0.008,
      0.04
    );
    p.rotation.z = MathUtils.lerp(p.rotation.z, mouse.current.x * 0.06, 0.04);

    // subtle scroll parallax
    const scroll = typeof window !== "undefined" ? window.scrollY : 0;
    p.position.y = MathUtils.lerp(p.position.y, scroll * -0.0009, 0.06);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
