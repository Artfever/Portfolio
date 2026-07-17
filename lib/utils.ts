import clsx, { type ClassValue } from "clsx";

/** Conditional className join. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation between a and b by t (0..1). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Re-map a value from one range to another. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + clamp(t, 0, 1) * (outMax - outMin);
}
