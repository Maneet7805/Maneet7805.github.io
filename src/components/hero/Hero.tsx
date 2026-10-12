"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE, has } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { ArrowDown, ArrowRight } from "@/components/ui/Icons";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const userMuted = useRef(false); // the visitor turned sound off on purpose
  const ready = PROFILE.hero.videoReady;

  // Try to play with sound; fall back to muted; unlock on the first interaction.
  useEffect(() => {
    const v = video.current;
    if (!v) return;

    const start = async () => {
      try {
        v.muted = false;
        await v.play();
        setSoundOn(true);
        setBlocked(false);
      } catch {
        v.muted = true;
        setSoundOn(false);
        setBlocked(true);
        try { await v.play(); } catch { /* autoplay fully blocked: poster stays */ }
      }
    };
    start();

    const unlock = (ev: Event) => {
      // The sound button handles its own click; don't double-toggle.
      if (userMuted.current || (ev.target as Element | null)?.closest?.(".hero-sound")) return cleanup();
      v.muted = false;
      v.play().then(() => { setSoundOn(true); setBlocked(false); }).catch(() => {});
      cleanup();
    };
    const evts = ["pointerdown", "keydown", "touchend"] as const;
    const cleanup = () => evts.forEach((e) => window.removeEventListener(e, unlock));
    evts.forEach((e) => window.addEventListener(e, unlock, { passive: true }));

    // Pause (and silence) when less than 35% of the hero is visible; resume on return.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 0.35) v.pause();
        else v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    if (ref.current) io.observe(ref.current);

    return () => { cleanup(); io.disconnect(); };
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = video.current;
    if (!v) return;
    if (soundOn) {
      v.muted = true;
      userMuted.current = true;
      setSoundOn(false);
    } else {
      userMuted.current = false;
      v.muted = false;
      v.play().then(() => { setSoundOn(true); setBlocked(false); }).catch(() => {});
    }
  };

  return (
    <section id="top" ref={ref} className="hero" aria-label="Introduction">
      <style>{CSS}</style>

      <p className="hero-ghost" aria-hidden>{PROFILE.firstName.toUpperCase()}</p>

      <div className="hero-figure">
        {ready ? (
          <video
            ref={video}
            className="hero-video"
            muted
            loop
            playsInline
            preload="auto"
            poster={PROFILE.hero.poster}
            aria-label={`${PROFILE.name} introducing himself`}
          >
            <source src={PROFILE.hero.webm} type="video/webm" />
            <source src={PROFILE.hero.mp4} type="video/mp4" />
          </video>
        ) : (
          <div className="hero-placeholder" role="img" aria-label="Intro video placeholder">
            <span className="mono">INTRO VIDEO</span>
            <span className="mono hero-placeholder-sub">run scripts/build-hero-assets.py</span>
          </div>
        )}
      </div>

      {ready && (
        <button
          className="hero-sound"
          data-blocked={blocked || undefined}
          onClick={toggleSound}
          aria-label={soundOn ? "Mute intro" : "Play intro with sound"}
          aria-pressed={soundOn}
        >
          {soundOn ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" /><rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="M4.5 2.8v10.4a.8.8 0 001.2.7l8.4-5.2a.8.8 0 000-1.4L5.7 2.1a.8.8 0 00-1.2.7z" fill="currentColor" /></svg>
          )}
        </button>
      )}

      <div className="hero-copy">
        <p className="mono hero-kicker rv">{PROFILE.name.toUpperCase()}</p>
        <h1 className="hero-title">
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span>{PROFILE.role.split(" ").slice(0, -1).join(" ")}</span></span>
          <span className="rv-mask" style={{ ["--i" as string]: 2 }}><span>{PROFILE.role.split(" ").slice(-1)}<i className="hero-dot">.</i></span></span>
        </h1>
        <p className="hero-sub rv" style={{ ["--i" as string]: 3 }}>{PROFILE.roleLine}</p>
      </div>

      <div className="hero-ctas rv" style={{ ["--i" as string]: 4 }}>
        {has("work") && (
          <a href="#work" className="btn btn-primary" onClick={(e) => { e.preventDefault(); scrollToTarget("work"); }}>
            Explore work <ArrowRight />
          </a>
        )}
        <a href="#contact" className="btn btn-ghost" onClick={(e) => { e.preventDefault(); scrollToTarget("contact"); }}>
          Let&apos;s talk
        </a>
        {PROFILE.resume && (
          <a href={PROFILE.resume} download className="btn btn-ghost">
            Résumé <ArrowDown />
          </a>
        )}
      </div>
    </section>
  );
}

const CSS = `
.hero { position: relative; min-height: max(100svh, 680px); overflow: hidden; isolation: isolate; }
.hero-ghost { position: absolute; left: 50%; top: 44%; transform: translate(-50%, -50%); margin: 0; z-index: -1;
  font-weight: 800; font-size: clamp(110px, 25vw, 420px); letter-spacing: -.06em; line-height: .8; white-space: nowrap;
  color: transparent; -webkit-text-stroke: 1.5px rgba(13,13,13,.09); user-select: none;
  animation: ghostIn 1.6s var(--ease) both; }
@keyframes ghostIn { from { opacity: 0; transform: translate(-50%, -46%); } to { opacity: 1; transform: translate(-50%, -50%); } }

.hero-figure { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
  height: min(96svh, 1040px); aspect-ratio: 768 / 960; z-index: 0; mix-blend-mode: multiply; animation: figIn 1.4s var(--ease) .1s both; }
@keyframes figIn { from { opacity: 0; transform: translate(-50%, 24px); } to { opacity: 1; transform: translate(-50%, 0); } }
.hero-video { width: 100%; height: 100%; object-fit: cover; }
.hero-placeholder { position: absolute; inset: 12% 14% 0; border-radius: 28px 28px 0 0; border: 1.5px dashed rgba(13,13,13,.16); border-bottom: 0;
  display: grid; place-content: center; text-align: center; gap: 8px; color: var(--faint); font-size: 12px; letter-spacing: .1em; }
.hero-placeholder-sub { letter-spacing: 0; font-size: 11px; }

.hero-sound { position: absolute; right: var(--gutter); top: clamp(92px, 13vh, 132px); width: 46px; height: 46px; border-radius: 50%;
  background: var(--ink); color: #fff; display: grid; place-items: center; z-index: 3;
  transition: transform .5s var(--ease), background .4s var(--ease); }
.hero-sound:hover { transform: scale(1.06); background: #262626; }
.hero-sound[data-blocked]::after { content: ""; position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 0 rgba(13,13,13,.35); animation: ping 1.8s var(--ease) infinite; }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(13,13,13,.35); } 100% { box-shadow: 0 0 0 18px rgba(13,13,13,0); } }

.hero-copy { position: absolute; left: var(--gutter); bottom: clamp(36px, 8vh, 88px); z-index: 2; max-width: min(46vw, 640px); }
.hero-kicker { font-size: 12px; letter-spacing: .14em; color: var(--mute); margin: 0 0 16px; }
.hero-title { margin: 0; font-weight: 700; letter-spacing: -.055em; line-height: .94; font-size: clamp(52px, 7.4vw, 124px); }
.hero-dot { font-style: normal; color: var(--faint); }
.hero-sub { margin: 18px 0 0; color: var(--mute); font-size: clamp(15px, 1.15vw, 17px); }

.hero-ctas { position: absolute; right: var(--gutter); bottom: clamp(36px, 8vh, 88px); z-index: 2; display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; max-width: 44vw; }

@media (max-width: 860px) {
  .hero { min-height: auto; display: flex; flex-direction: column; padding: 92px var(--gutter) 48px; }
  .hero-ghost { top: 30%; }
  .hero-figure { position: relative; left: auto; transform: none; margin: 0 auto; height: 62svh; animation-name: figInM; }
  @keyframes figInM { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
  .hero-sound { top: 92px; }
  .hero-copy { position: relative; left: auto; bottom: auto; max-width: none; margin-top: 28px; }
  .hero-ctas { position: relative; right: auto; bottom: auto; max-width: none; justify-content: flex-start; margin-top: 24px; }
}
`;
