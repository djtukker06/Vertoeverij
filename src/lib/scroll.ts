const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Rustig op gang, rustig uitlopen
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let cancelCurrent: (() => void) | null = null;

/**
 * Vloeiend naar een scrollpositie. Duur schaalt met de afstand (600-1400 ms).
 * Stopt direct als de bezoeker zelf scrollt, swipet of een toets gebruikt.
 * Geen scroll-listener: alleen requestAnimationFrame tijdens de animatie.
 */
export function smoothScrollTo(targetY: number): Promise<void> {
  cancelCurrent?.();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const to = Math.max(0, Math.min(targetY, max));
  const from = window.scrollY;
  const distance = to - from;

  if (prefersReducedMotion() || document.hidden || Math.abs(distance) < 2) {
    window.scrollTo(0, to);
    return Promise.resolve();
  }

  const duration = Math.max(600, Math.min(1400, Math.abs(distance) * 0.45));

  return new Promise((resolve) => {
    let raf = 0;
    const start = performance.now();
    const stop = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      cancelCurrent = null;
      resolve();
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, from + distance * easeInOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else stop();
    };
    raf = requestAnimationFrame(step);
    cancelCurrent = stop;
  });
}

/** Vloeiend naar een element; offset = ruimte boven het element. */
export function scrollToElement(el: Element | null, offset = 0) {
  if (!el) return Promise.resolve();
  return smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - offset);
}

/** Naar een anker; ruimte erboven = scroll-margin-top van het element (CSS), net als bij gewone ankers. */
export function scrollToId(id: string, offset?: number) {
  const el = document.getElementById(id);
  return scrollToElement(el, offset ?? (el ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0));
}
