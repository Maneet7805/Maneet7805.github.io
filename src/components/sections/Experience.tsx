"use client";

import { useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHead from "@/components/ui/SectionHead";

const STOPS = [...EDUCATION, ...EXPERIENCE].sort((a, b) => a.start - b.start);

export default function Experience() {
  const track = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(track, "through", 0.7, 0.55);

  return (
    <section id="experience" className="sec exp" aria-labelledby="experience-title">
      <style>{CSS}</style>
      <div className="wrap">
        <SectionHead id="experience" label="Experience & education" lead="The path so" accent="far." />

        <div className="tl" ref={track}>
          <span className="tl-spine" aria-hidden><span style={{ transform: `scaleY(${p})` }} /></span>
          <ol>
            {STOPS.map((s, i) => {
              const at = STOPS.length > 1 ? i / STOPS.length : 0;
              const lit = p >= at + 0.02 || p >= 0.999;
              return (
                <li key={s.title} className="tl-stop" data-lit={lit || undefined}>
                  <span className="tl-dot" aria-hidden />
                  <p className="mono tl-year">{s.year}</p>
                  <div className="tl-card">
                    <p className="mono tl-kind">{s.kind === "experience" ? "Experience" : "Education"}</p>
                    <h3 className="tl-title">{s.title}</h3>
                    <p className="tl-place">{s.place}</p>
                    {s.detail && <p className="tl-detail">{s.detail}</p>}
                  </div>
                </li>
              );
            })}
            <li className="tl-stop tl-next" data-lit={p >= 0.98 || undefined}>
              <span className="tl-dot" aria-hidden />
              <p className="mono tl-year">Next</p>
              <div className="tl-card tl-dashed">
                <h3 className="tl-title">Next — <em className="serif">Your team?</em></h3>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.tl { position: relative; margin-top: clamp(48px, 7vh, 80px); padding-left: 0; }
.tl-spine { position: absolute; left: calc(180px + 11px); top: 8px; bottom: 8px; width: 2px; background: var(--soft); border-radius: 2px; overflow: hidden; }
.tl-spine span { position: absolute; inset: 0; background: var(--ink); transform-origin: 50% 0; transform: scaleY(0); }
.tl ol { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(28px, 5vh, 48px); }
.tl-stop { position: relative; display: grid; grid-template-columns: 180px 24px minmax(0,1fr); align-items: start; column-gap: 28px; }
.tl-stop > .tl-year { grid-column: 1; grid-row: 1; text-align: right; font-size: 13px; color: var(--faint); margin: 14px 0 0; transition: color .6s var(--ease); }
.tl-dot { grid-column: 2; grid-row: 1; justify-self: center; margin-top: 15px; width: 14px; height: 14px; border-radius: 50%; background: var(--paper); box-shadow: inset 0 0 0 2px var(--soft);
  transition: box-shadow .6s var(--ease), background .6s var(--ease), transform .6s var(--ease); position: relative; z-index: 1; }
.tl-card { grid-column: 3; grid-row: 1; background: #fff; border-radius: 24px; padding: 22px 26px; box-shadow: inset 0 0 0 1px var(--line);
  opacity: .45; transform: translateX(8px); transition: opacity .7s var(--ease), transform .8s var(--ease), box-shadow .7s var(--ease); }
.tl-stop[data-lit] .tl-year { color: var(--ink); }
.tl-stop[data-lit] .tl-dot { background: var(--ink); box-shadow: 0 0 0 5px rgba(13,13,13,.08); transform: scale(1.1); }
.tl-stop[data-lit] .tl-card { opacity: 1; transform: none; box-shadow: inset 0 0 0 1px var(--line), var(--shadow-soft); }
.tl-kind { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); margin: 0 0 8px; }
.tl-title { font-size: clamp(19px, 1.8vw, 24px); font-weight: 650; letter-spacing: -.03em; line-height: 1.2; margin: 0; }
.tl-title em { font-style: italic; font-weight: 400; color: var(--mute); }
.tl-place { color: var(--ink-2); margin: 6px 0 0; font-size: 15px; }
.tl-detail { color: var(--mute); margin: 10px 0 0; font-size: 14px; line-height: 1.55; }
.tl-dashed { background: transparent; box-shadow: none !important; border: 1.5px dashed rgba(13,13,13,.22); }
@media (max-width: 760px) {
  .tl-spine { left: 11px; }
  .tl-stop { grid-template-columns: 24px minmax(0,1fr); column-gap: 16px; }
  .tl-stop > .tl-year { grid-column: 2; grid-row: 1; text-align: left; margin: 12px 0 10px; }
  .tl-dot { grid-column: 1; grid-row: 1; margin-top: 12px; }
  .tl-card { grid-column: 2; grid-row: 2; padding: 18px 20px; }
}
`;
