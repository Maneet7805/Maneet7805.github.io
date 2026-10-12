"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PROFILE, sectionTag } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { ArrowDown, GitHubMark, LinkedInMark } from "@/components/ui/Icons";

export default function About() {
  const section = useRef<HTMLElement>(null);
  const hanger = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef<string>("mouse");

  // Damped pendulum: pointer velocity → angular impulse, spring back, idle sway.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const sec = section.current;
    const el = hanger.current;
    if (!sec || !el) return;
    let theta = 0, omega = 0, lastX: number | null = null, lastMove = 0, raf = 0, prev = performance.now();
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null) {
        const v = (e.clientX - lastX) / Math.max(8, now - lastMove); // px per ms
        omega += Math.max(-0.6, Math.min(0.6, v * 0.35));
      }
      lastX = e.clientX;
      lastMove = now;
    };
    const onLeave = () => { lastX = null; };
    const loop = (now: number) => {
      const dt = Math.min(3, (now - prev) / 16.67);
      prev = now;
      const idle = now - lastMove > 1400;
      const target = idle ? Math.sin(now / 1300) * 1.6 : 0; // degrees
      const k = 0.012, c = 0.075;
      omega += (-k * (theta - target) - c * omega) * dt;
      theta += omega * dt;
      theta = Math.max(-28, Math.min(28, theta));
      el.style.transform = `rotate(${theta.toFixed(3)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); sec.removeEventListener("pointermove", onMove); sec.removeEventListener("pointerleave", onLeave); };
  }, []);

  const bars = useMemo(() => {
    const out: number[] = [];
    for (const ch of (PROFILE.idCard.idNo + PROFILE.name).toUpperCase()) {
      const c = ch.charCodeAt(0);
      out.push((c % 3) + 1, ((c >> 2) % 2) + 1);
    }
    return out.slice(0, 44);
  }, []);

  const strapText = `${PROFILE.name.toUpperCase()} · ${PROFILE.role.toUpperCase()} · `;

  return (
    <section id="about" ref={section} className="sec about" aria-labelledby="about-title">
      <style>{CSS}</style>
      <div className="wrap about-grid">
        {/* Left */}
        <div className="about-left">
          <div>
            <p className="tag rv"><b>{sectionTag("about")}</b><span aria-hidden>—</span>About</p>
            <h2 className="h2" id="about-title">
              <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span>Hi, I&apos;m <em>{PROFILE.firstName}.</em></span></span>
            </h2>
            <p className="lede rv" style={{ ["--i" as string]: 2, marginTop: 28 }}>{PROFILE.summary}</p>
            <p className="lede rv about-second" style={{ ["--i" as string]: 3 }}>{PROFILE.secondLine}</p>
          </div>
          <div className="about-btns rv" style={{ ["--i" as string]: 4 }}>
            {PROFILE.resume && <a className="btn btn-primary" href={PROFILE.resume} download>Résumé <ArrowDown /></a>}
            <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noreferrer"><GitHubMark /> GitHub</a>
            <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noreferrer"><LinkedInMark /> LinkedIn</a>
          </div>
        </div>

        {/* Centre: lanyard + ID card */}
        <div className="about-centre">
          <div className="hanger" ref={hanger}>
            <span className="cord" aria-hidden />
            <span className="strap" aria-hidden>
              <span className="strap-track mono">{strapText}{strapText}</span>
            </span>
            <span className="clip" aria-hidden><span /></span>
            <div
              className="idcard"
              data-flipped={flipped || undefined}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={`Developer ID card for ${PROFILE.name}. Press to flip.`}
              onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") setFlipped(true); }}
              onPointerLeave={(e) => { if (e.pointerType === "mouse") setFlipped(false); }}
              onClick={() => { if (lastPointer.current !== "mouse") setFlipped((f) => !f); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped((f) => !f); } }}
            >
              <div className="idcard-inner">
                {/* Front */}
                <div className="face front">
                  <div className="band mono">DEVELOPER ID</div>
                  <div className="photo">
                    <span className="halo" aria-hidden />
                    <span className="ring">
                      {PROFILE.portrait ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={PROFILE.portrait} alt={`Portrait of ${PROFILE.name}`} />
                      ) : (
                        <span className="mono initials" aria-hidden>{PROFILE.initials}</span>
                      )}
                    </span>
                  </div>
                  <p className="id-name">{PROFILE.name}</p>
                  <p className="id-role">{PROFILE.role}</p>
                  <dl className="id-rows mono">
                    <div><dt>ID No.</dt><dd>{PROFILE.idCard.idNo}</dd></div>
                    <div><dt>Dept.</dt><dd>{PROFILE.idCard.dept}</dd></div>
                    {PROFILE.idCard.validTill && <div><dt>Valid till</dt><dd>{PROFILE.idCard.validTill}</dd></div>}
                  </dl>
                  <div className="id-foot" aria-hidden>
                    <span className="barcode">{bars.map((w, i) => <i key={i} style={{ width: w, opacity: i % 2 ? 0 : 1 }} />)}</span>
                    <span className="holo" />
                  </div>
                </div>
                {/* Back */}
                <div className="face back">
                  <p className="mono back-kicker">WHAT I AM</p>
                  <ul>
                    {PROFILE.idCard.back.map((l) => <li key={l}>{l}</li>)}
                  </ul>
                  <div className="sig">
                    <span className="serif">{PROFILE.name}</span>
                    <span className="sig-line" />
                  </div>
                  <p className="mono found">If found, say hello · {PROFILE.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="about-right">
          <div>
            <p className="mono facts-title rv">Quick facts</p>
            <dl className="facts">
              {PROFILE.quickFacts.map((f, i) => (
                <div key={f.label} className="rv" style={{ ["--i" as string]: i + 1 }}>
                  <dt className="mono">{f.label}</dt>
                  <dd>{f.label === "Email" ? <a href={`mailto:${f.value}`}>{f.value}</a> : f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <blockquote className="quote serif rv" style={{ ["--i" as string]: 6 }}>&ldquo;{PROFILE.quote}&rdquo;</blockquote>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.about-grid { display: grid; grid-template-columns: minmax(0,1fr) 320px minmax(0,1fr); gap: clamp(28px, 4vw, 64px); align-items: stretch; }
.about-left, .about-right { display: flex; flex-direction: column; justify-content: space-between; gap: 40px; }
.about-second { margin-top: 16px; color: var(--mute); }
.about-btns { display: flex; flex-wrap: wrap; gap: 10px; }

.about-centre { position: relative; margin-top: calc(-1 * var(--sec-pad)); display: flex; justify-content: center; z-index: 1; }
.hanger { display: flex; flex-direction: column; align-items: center; transform-origin: 50% 0; will-change: transform; }
.cord { width: 2px; height: calc(var(--sec-pad) - 8px); background: linear-gradient(var(--ink-2), var(--ink)); opacity: .55; }
.strap { width: 30px; height: 56px; background: var(--ink); border-radius: 3px 3px 0 0; overflow: hidden; position: relative; }
.strap-track { position: absolute; left: 50%; top: 0; writing-mode: vertical-rl; transform: translateX(-50%); font-size: 9px; letter-spacing: .18em; color: rgba(255,255,255,.75); white-space: nowrap; animation: strapScroll 14s linear infinite; }
@keyframes strapScroll { from { transform: translate(-50%, 0); } to { transform: translate(-50%, -50%); } }
.clip { width: 34px; height: 22px; border-radius: 4px 4px 8px 8px; background: linear-gradient(180deg,#d9d9d9,#8f8f8f 55%,#bdbdbd); box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 2px 4px rgba(0,0,0,.25); position: relative; margin-bottom: -6px; z-index: 2; }
.clip span { position: absolute; left: 50%; bottom: -10px; width: 12px; height: 14px; transform: translateX(-50%); border: 2.5px solid #9a9a9a; border-top: 0; border-radius: 0 0 8px 8px; }

.idcard { width: 300px; height: 404px; perspective: 1400px; cursor: pointer; outline-offset: 6px; border-radius: 22px; }
.idcard-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 1s var(--ease); }
.idcard[data-flipped] .idcard-inner { transform: rotateY(180deg); }
.face { position: absolute; inset: 0; border-radius: 22px; background: #fff; backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--line), 0 40px 70px -40px rgba(13,13,13,.45), 0 12px 24px -16px rgba(13,13,13,.25); }
.face::before { content: ""; position: absolute; top: 10px; left: 50%; width: 46px; height: 7px; transform: translateX(-50%); border-radius: 99px; background: var(--paper); box-shadow: inset 0 1px 2px rgba(0,0,0,.15); z-index: 3; }
.front { display: flex; flex-direction: column; align-items: center; text-align: center; }
.band { width: 100%; background: var(--ink); color: #fff; font-size: 11px; letter-spacing: .32em; padding: 24px 0 10px; }
.photo { position: relative; margin-top: 14px; }
.halo { position: absolute; inset: -18px; border-radius: 30px; background: radial-gradient(closest-side, rgba(13,13,13,.10), transparent); }
.ring { position: relative; display: grid; place-items: center; width: 128px; height: 156px; border-radius: 18px; padding: 3px; overflow: hidden;
  background: linear-gradient(160deg, #e8e6e2, #8b8983 60%, #d4d2cd); }
.ring img, .ring .initials { width: 100%; height: 100%; border-radius: 15px; object-fit: cover; background: var(--soft); transition: transform .8s var(--ease); }
.ring .initials { display: grid; place-items: center; font-size: 34px; font-weight: 600; color: var(--mute); }
.idcard:hover .ring img, .idcard:hover .ring .initials { transform: scale(1.06); }
.id-name { margin: 12px 0 0; font-weight: 700; font-size: 19px; letter-spacing: -.03em; }
.id-role { margin: 2px 0 0; color: var(--mute); font-size: 13px; }
.id-rows { margin: 10px 0 0; width: 100%; padding: 0 26px; font-size: 10.5px; display: grid; gap: 4px; }
.id-rows div { display: flex; justify-content: space-between; border-bottom: 1px dashed var(--line); padding-bottom: 3px; }
.id-rows dt { color: var(--faint); } .id-rows dd { margin: 0; color: var(--ink-2); }
.id-foot { margin-top: auto; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 8px 22px 16px; }
.barcode { display: flex; height: 26px; gap: 0; } .barcode i { display: block; height: 100%; background: var(--ink); margin-right: 1px; }
.holo { width: 34px; height: 34px; border-radius: 50%; background: conic-gradient(from 0deg, #f2f2f2, #9b9b9b, #e6e6e6, #6e6e6e, #f5f5f5, #a8a8a8, #f2f2f2);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); animation: holo 6s linear infinite; }
@keyframes holo { to { transform: rotate(360deg); } }

.back { transform: rotateY(180deg); padding: 40px 28px 22px; display: flex; flex-direction: column; }
.back-kicker { font-size: 11px; letter-spacing: .3em; color: var(--mute); margin: 0 0 14px; }
.back ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.back li { font-size: 14px; line-height: 1.35; padding-left: 16px; position: relative; color: var(--ink-2); }
.back li::before { content: ""; position: absolute; left: 0; top: .55em; width: 6px; height: 6px; border-radius: 50%; background: var(--ink); }
.sig { margin-top: auto; } .sig .serif { font-style: italic; font-size: 26px; color: var(--ink-2); }
.sig-line { display: block; height: 1px; background: var(--line); margin-top: 4px; }
.found { font-size: 10px; color: var(--faint); margin: 10px 0 0; word-break: break-all; }

.facts-title { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); margin: 4px 0 18px; }
.facts { margin: 0; display: grid; }
.facts div { display: grid; gap: 4px; padding: 14px 0; border-top: 1px solid var(--line); }
.facts div:last-child { border-bottom: 1px solid var(--line); }
.facts dt { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); }
.facts dd { margin: 0; font-size: 15px; line-height: 1.4; overflow-wrap: anywhere; }
.facts a { border-bottom: 1px solid var(--line); transition: border-color .4s var(--ease); } .facts a:hover { border-color: var(--ink); }
.quote { margin: 0; font-style: italic; font-size: clamp(24px, 2.2vw, 32px); line-height: 1.2; color: var(--ink-2); }

@media (max-width: 1100px) {
  .about-grid { grid-template-columns: minmax(0,1fr) 320px; }
  .about-right { grid-column: 1 / -1; }
}
@media (max-width: 760px) {
  .about-grid { grid-template-columns: minmax(0,1fr); }
  .about-centre { margin-top: 0; }
  .cord { height: 48px; }
  .about-right { grid-column: auto; }
}
`;
