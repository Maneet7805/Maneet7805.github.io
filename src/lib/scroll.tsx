"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Mounts Lenis smooth scrolling once (skipped when the visitor prefers reduced motion). */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ autoRaf: true, duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

/** Smooth-scroll to "#id" (or "top"). Falls back to native scrolling. */
export function scrollToTarget(target: string, offset = 0) {
  const id = target.replace(/^#/, "");
  if (id === "top") {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.4 });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  // Move focus for keyboard and screen-reader users without a second jump.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function lockScroll(lock: boolean) {
  if (lenis) {
    if (lock) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
