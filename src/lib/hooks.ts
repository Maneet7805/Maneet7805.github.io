"use client";

import { useEffect, useState, type RefObject } from "react";

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once the element has entered the viewport (or while it is in view, when once=false). */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, threshold = 0.2, rootMargin = "0px" }: { once?: boolean; threshold?: number; rootMargin?: string } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, threshold, rootMargin]);
  return inView;
}

/**
 * 0 → 1 progress of scrolling through an element.
 * mode "through": 0 when the element's top reaches `start` (fraction of viewport), 1 when its bottom reaches `end`.
 * mode "pinned": 0 when the top hits the viewport top, 1 when the bottom hits the viewport bottom.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  mode: "through" | "pinned" = "through",
  start = 0.75,
  end = 0.6,
) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let v: number;
      if (mode === "pinned") {
        const travel = r.height - vh;
        v = travel > 0 ? -r.top / travel : 0;
      } else {
        const from = vh * start; // progress starts when the top reaches this line
        const to = vh * end; // and ends when the bottom reaches this line
        v = (from - r.top) / Math.max(1, r.height + from - to);
      }
      setP(Math.min(1, Math.max(0, v)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, mode, start, end]);
  return p;
}

/** Media query hook (SSR-safe; false until mounted). */
export function useMedia(query: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return m;
}
