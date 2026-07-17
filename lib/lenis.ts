import type Lenis from "@studio-freight/lenis";

/**
 * Module-level bridge so sibling components (Preloader, NavDots, ...) can talk
 * to the single Lenis instance created inside <SmoothScroll> without prop
 * drilling or a shared React tree.
 */

let instance: Lenis | null = null;
let preloadComplete = false;
const preloadListeners = new Set<() => void>();

export function registerLenis(l: Lenis | null): void {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** True once the preloader has finished revealing the page. */
export function isPreloadComplete(): boolean {
  return preloadComplete;
}

/** Called by the Preloader when the reveal animation completes. */
export function markPreloadComplete(): void {
  if (preloadComplete) return;
  preloadComplete = true;
  preloadListeners.forEach((fn) => fn());
  preloadListeners.clear();
}

/**
 * Subscribe to the "preload finished" moment. Fires immediately if it already
 * happened (closes the race where a listener registers after completion).
 * Returns an unsubscribe function.
 */
export function onPreloadComplete(fn: () => void): () => void {
  if (preloadComplete) {
    fn();
    return () => {};
  }
  preloadListeners.add(fn);
  return () => preloadListeners.delete(fn);
}

type ScrollTarget = string | HTMLElement | number;

/** Smoothly scroll to a section, falling back to native scroll if Lenis isn't ready. */
export function scrollToSection(
  target: ScrollTarget,
  opts: { duration?: number; offset?: number } = {}
): void {
  const { duration = 1.2, offset = 0 } = opts;

  if (instance) {
    instance.scrollTo(target, { duration, offset });
    return;
  }

  if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}
