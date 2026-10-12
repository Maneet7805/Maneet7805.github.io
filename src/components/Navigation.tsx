"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE, SECTIONS } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [ind, setInd] = useState({ left: 0, width: 0, show: false });
  const pillRef = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Scroll state: glass pill after 40px + top progress bar.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  // Active section.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const hero = document.getElementById("top");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          // Certifications isn't in the nav: keep "Work" lit while it's on screen.
          setActive(id === "top" ? null : id === "certifications" ? "work" : id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    if (hero) io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Sliding indicator under the active link.
  useIso(() => {
    const place = () => {
      const pill = pillRef.current;
      const link = pill?.querySelector<HTMLElement>(`a[data-id="${active}"]`);
      if (!pill || !link) return setInd((s) => ({ ...s, show: false }));
      setInd({ left: link.offsetLeft, width: link.offsetWidth, show: true });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // Mobile overlay: Esc closes, scroll locked while open.
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToTarget(id));
  };

  return (
    <header className="nav" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <style>{CSS}</style>
      <div className="nav-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      <div className="nav-row">
        <a href="#top" className="nav-brand" onClick={go("top")} aria-label={`${PROFILE.name}, back to top`}>
          <span className="nav-mark mono">{PROFILE.initials}</span>
          <span className="nav-name">{PROFILE.name}</span>
        </a>

        <nav aria-label="Primary" className="nav-pill" ref={pillRef}>
          <span className="nav-ind" aria-hidden style={{ transform: `translateX(${ind.left}px)`, width: ind.width, opacity: ind.show ? 1 : 0 }} />
          {NAV.map((l) => (
            <a key={l.id} href={`#${l.id}`} data-id={l.id} aria-current={active === l.id ? "true" : undefined} onClick={go(l.id)}>
              {l.label}
            </a>
          ))}
        </nav>

        <button ref={menuBtn} className="nav-menu-btn" aria-expanded={open} aria-controls="nav-overlay" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div id="nav-overlay" className="nav-overlay" aria-hidden={!open} inert={!open}>
        <ol>
          {NAV.map((l, i) => (
            <li key={l.id} style={{ ["--i" as string]: i }}>
              <a href={`#${l.id}`} onClick={go(l.id)}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ol>
        <p className="mono nav-overlay-foot">{PROFILE.email}</p>
      </div>
    </header>
  );
}

const CSS = `
.nav { position: fixed; inset: 0 0 auto 0; z-index: 50; pointer-events: none; }
.nav-progress { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--ink); transform-origin: 0 50%; z-index: 3; }
.nav-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px var(--gutter); max-width: calc(1320px + 2 * var(--gutter)); margin: 0 auto; }
.nav-row > * { pointer-events: auto; }
.nav-brand { display: inline-flex; align-items: center; gap: 12px; position: relative; z-index: 2; }
.nav-mark { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 600; letter-spacing: .04em;
  box-shadow: inset 0 0 0 1.5px var(--ink); background: transparent; color: var(--ink);
  transition: background .5s var(--ease), color .5s var(--ease), transform .9s var(--ease); }
.nav-brand:hover .nav-mark { transform: rotate(360deg); }
.nav[data-scrolled] .nav-mark { background: var(--ink); color: #fff; }
.nav-name { font-weight: 600; font-size: 15px; letter-spacing: -.01em; transition: opacity .5s var(--ease), transform .6s var(--ease); white-space: nowrap; }
.nav[data-scrolled] .nav-name { opacity: 0; transform: translateX(-8px); pointer-events: none; }

.nav-pill { position: relative; display: flex; align-items: center; gap: 2px; padding: 5px; border-radius: 999px;
  transition: background .5s var(--ease), box-shadow .5s var(--ease), backdrop-filter .5s var(--ease); }
.nav[data-scrolled] .nav-pill { background: rgba(255,255,255,.72); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 0 0 1px var(--line), 0 10px 30px -18px rgba(13,13,13,.35); }
.nav-pill a { position: relative; z-index: 1; padding: 9px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; color: var(--ink-2);
  transition: color .45s var(--ease); }
.nav-pill a:hover { color: var(--ink); }
.nav-pill a[aria-current] { color: #fff; }
.nav-ind { position: absolute; top: 5px; bottom: 5px; left: 0; border-radius: 999px; background: var(--ink);
  transition: transform .6s var(--ease), width .6s var(--ease), opacity .4s var(--ease); }

.nav-menu-btn { display: none; height: 42px; padding: 0 20px; border-radius: 999px; background: rgba(255,255,255,.75);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: inset 0 0 0 1px var(--line); font-size: 14px; font-weight: 500; position: relative; z-index: 2; }
.nav[data-open] .nav-menu-btn { background: var(--ink); color: #fff; }

.nav-overlay { position: fixed; inset: 0; background: var(--paper); z-index: 1; pointer-events: auto;
  clip-path: circle(0% at calc(100% - 52px) 38px); visibility: hidden;
  transition: clip-path .8s var(--ease), visibility 0s linear .8s;
  display: flex; flex-direction: column; justify-content: center; padding: 96px var(--gutter) 40px; }
.nav[data-open] .nav-overlay { clip-path: circle(150% at calc(100% - 52px) 38px); visibility: visible; transition: clip-path .8s var(--ease), visibility 0s; }
.nav-overlay ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.nav-overlay li { overflow: hidden; }
.nav-overlay a { display: flex; align-items: baseline; gap: 16px; font-size: clamp(40px, 11vw, 64px); font-weight: 700; letter-spacing: -.045em; line-height: 1.05;
  transform: translateY(110%); transition: transform .8s var(--ease); transition-delay: calc(.12s + var(--i) * 60ms); }
.nav-overlay a span { font-size: 12px; font-weight: 500; letter-spacing: .06em; color: var(--mute); }
.nav[data-open] .nav-overlay a { transform: none; }
.nav-overlay-foot { margin-top: auto; font-size: 12px; color: var(--mute); }

@media (max-width: 860px) {
  .nav-pill { display: none; }
  .nav-menu-btn { display: inline-flex; align-items: center; }
}
`;
