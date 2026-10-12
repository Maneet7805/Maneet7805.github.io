"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion, useInView } from "@/lib/hooks";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo, { isBrand } from "@/components/ui/TechLogo";
import { ArrowRight } from "@/components/ui/Icons";

function CountUp({ a }: { a: Achievement }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { threshold: 0.5 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) return setV(a.value);
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      const e = 1 - Math.pow(1 - k, 4); // easeOutQuart
      setV(a.value * e);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, a.value]);
  const shown = a.decimals ? v.toFixed(a.decimals) : Math.round(v).toLocaleString("en-US");
  return (
    <span ref={ref} className="ach-num" aria-label={`${a.prefix ?? ""}${a.value}${a.suffix ?? ""}`}>
      <span aria-hidden>{a.prefix}{shown}<small>{a.suffix}</small></span>
    </span>
  );
}

export default function Achievements() {
  const outer = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [p, setP] = useState(0);
  const [focus, setFocus] = useState(0);

  // Pinned horizontal scroll: section height = viewport + horizontal travel.
  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      setTravel(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => { window.removeEventListener("resize", measure); ro.disconnect(); };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = outer.current;
      const t = trackRef.current;
      if (!el || !t) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const prog = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      setP(prog);
      // Card nearest the viewport centre.
      const mid = window.innerWidth / 2;
      let best = 0, bestD = Infinity;
      t.querySelectorAll<HTMLElement>(".ach-card").forEach((c, i) => {
        const b = c.getBoundingClientRect();
        const d = Math.abs(b.left + b.width / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setFocus(best);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [travel]);

  const total = ACHIEVEMENTS.length;

  return (
    <section id="achievements" ref={outer} className="ach" style={{ height: `calc(100svh + ${travel}px)` }} aria-labelledby="achievements-title">
      <style>{CSS}</style>
      <div className="ach-pin">
        <div className="wrap ach-head">
          <SectionHead id="achievements" label="Achievements" lead="Numbers I'm proud" accent="of." />
          <div className="ach-bar" aria-hidden><span style={{ transform: `scaleX(${p})` }} /></div>
        </div>
        <div className="ach-track" ref={trackRef} style={{ transform: `translate3d(${-p * travel}px,0,0)` }}>
          {ACHIEVEMENTS.map((a, i) => (
            <article key={a.label + i} className="ach-card" data-focus={focus === i || undefined}>
              <div className="ach-top">
                <span className="ach-logo" data-brand={isBrand(a.logo) || undefined}>
                  <span className="ach-glow" aria-hidden />
                  <TechLogo k={a.logo} size={34} />
                </span>
                <span className="mono ach-idx">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
              </div>
              <div className="ach-bottom">
                <div className="ach-text">
                  <p className="ach-label">{a.label}</p>
                  <p className="ach-caption">{a.caption}</p>
                  {a.detail && <p className="mono ach-detail">{a.detail}</p>}
                </div>
                <CountUp a={a} />
              </div>
            </article>
          ))}
          <div className="ach-end" aria-hidden>
            <span className="serif">and counting</span> <ArrowRight size={28} />
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ach { position: relative; }
.ach-pin { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: clamp(28px, 5vh, 56px); }
.ach-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
.ach-head .h2 { font-size: clamp(36px, 5vw, 76px); }
.ach-bar { width: min(240px, 30vw); height: 2px; background: var(--soft); border-radius: 2px; overflow: hidden; margin-bottom: 14px; flex-shrink: 0; }
.ach-bar span { display: block; height: 100%; background: var(--ink); transform-origin: 0 50%; }
.ach-track { display: flex; gap: 20px; padding: 24px var(--gutter) 40px; width: max-content; will-change: transform; }
.ach-card { flex-shrink: 0; width: clamp(300px, 40vw, 540px); height: clamp(260px, 36vh, 310px); border-radius: 28px; background: #fff; padding: 24px 26px;
  display: flex; flex-direction: column; justify-content: space-between; box-shadow: inset 0 0 0 1px var(--line), 0 10px 30px -24px rgba(13,13,13,.3);
  transition: transform .8s var(--ease), box-shadow .8s var(--ease); }
.ach-card[data-focus] { transform: translateY(-12px); box-shadow: inset 0 0 0 1px var(--line), 0 50px 80px -40px rgba(13,13,13,.4), 0 18px 30px -20px rgba(13,13,13,.2); }
.ach-top { display: flex; justify-content: space-between; align-items: flex-start; }
.ach-logo { position: relative; width: 72px; height: 72px; border-radius: 20px; display: grid; place-items: center; background: var(--paper); box-shadow: inset 0 0 0 1px var(--line); }
.ach-glow { position: absolute; inset: -14px; border-radius: 30px; background: radial-gradient(closest-side, rgba(238,0,0,.10), transparent); opacity: 0; transition: opacity .8s var(--ease); }
.ach-logo:not([data-brand]) .ach-glow { background: radial-gradient(closest-side, rgba(13,13,13,.10), transparent); }
.ach-card[data-focus] .ach-glow { opacity: 1; }
.ach-logo > svg, .ach-logo > img { position: relative; }
.ach-idx { font-size: 12px; color: var(--faint); }
.ach-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
.ach-text { min-width: 0; }
.ach-label { margin: 0; font-weight: 650; font-size: 17px; letter-spacing: -.02em; }
.ach-caption { margin: 4px 0 0; color: var(--ink-2); font-size: 14px; }
.ach-detail { margin: 8px 0 0; color: var(--faint); font-size: 11px; line-height: 1.45; }
.ach-num { font-weight: 700; font-size: clamp(64px, 7.2vw, 112px); letter-spacing: -.06em; line-height: .85; white-space: nowrap; }
.ach-num small { font-size: .42em; letter-spacing: -.02em; margin-left: 2px; color: var(--mute); }
.ach-end { flex-shrink: 0; align-self: center; display: flex; align-items: center; gap: 14px; padding: 0 8vw 0 24px; font-size: clamp(30px, 3.4vw, 48px); color: var(--mute); }
.ach-end .serif { font-style: italic; }
@media (max-width: 760px) {
  .ach-head { flex-direction: column; align-items: flex-start; }
  .ach-card { width: 82vw; }
  .ach-num { font-size: 64px; }
}
`;
