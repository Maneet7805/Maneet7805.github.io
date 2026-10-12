"use client";

import { useState } from "react";
import { PROJECTS, skillByName } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo from "@/components/ui/TechLogo";
import MockUI, { MOCK_CSS } from "@/components/ui/MockUI";
import { ArrowUpRight, Plus } from "@/components/ui/Icons";

const MAX_CHIPS = 6;

export default function Work() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="sec work" aria-labelledby="work-title">
      <style>{CSS + MOCK_CSS}</style>
      <div className="wrap">
        <SectionHead id="work" label="Selected work" lead="Things I've" accent="built." />

        <div className="acc rv" role="list">
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            const num = String(i + 1).padStart(2, "0");
            return (
              <article
                key={p.slug}
                role="listitem"
                className="panel"
                data-open={isOpen || undefined}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
              >
                <button
                  className="spine"
                  aria-expanded={isOpen}
                  aria-controls={`panel-${p.slug}`}
                  onClick={() => setOpen(i)}
                  tabIndex={isOpen ? -1 : 0}
                >
                  <span className="mono spine-num">{num}</span>
                  <span className="spine-title">{p.title}</span>
                  <span className="spine-plus" aria-hidden><Plus /></span>
                </button>

                <div className="panel-body" id={`panel-${p.slug}`} aria-hidden={!isOpen} inert={!isOpen}>
                  <div className="pb-left">
                    <p className="mono pb-kicker"><b>{num}</b> · {p.kicker}</p>
                    <h3 className="pb-title">{p.title}</h3>
                    <p className="pb-desc">{p.description}</p>
                    <ul className="pb-feats">
                      {p.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                    <ul className="pb-tech" aria-label="Tech used">
                      {p.tech.slice(0, MAX_CHIPS).map((t) => {
                        const s = skillByName(t);
                        return (
                          <li key={t}>
                            {s && <TechLogo k={s.logo} size={14} />}
                            {t}
                          </li>
                        );
                      })}
                      {p.tech.length > MAX_CHIPS && (
                        <li className="pb-more" title={p.tech.slice(MAX_CHIPS).join(", ")}>+{p.tech.length - MAX_CHIPS} more</li>
                      )}
                    </ul>
                    {p.link && (
                      <a className="btn btn-primary pb-link" href={p.link} target="_blank" rel="noreferrer">
                        View on GitHub <ArrowUpRight />
                      </a>
                    )}
                  </div>
                  <div className="pb-right">
                    {isOpen && <MockUI kind={p.mock} />}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.acc { display: flex; gap: 10px; height: min(78svh, 600px); margin-top: clamp(40px, 6vh, 64px); }
.panel { position: relative; flex: 1 1 0; min-width: 0; border-radius: 26px; background: #fff; box-shadow: inset 0 0 0 1px var(--line);
  overflow: hidden; transition: flex 0.9s var(--ease), box-shadow .6s var(--ease); }
.panel[data-open] { flex: 8 1 0; box-shadow: inset 0 0 0 1px var(--line), var(--shadow-soft); }

.spine { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 20px 0; width: 100%;
  transition: opacity .4s var(--ease); z-index: 1; }
.panel[data-open] .spine { opacity: 0; pointer-events: none; }
.spine-num { font-size: 12px; color: var(--mute); }
.spine-title { writing-mode: vertical-rl; transform: rotate(180deg); font-weight: 600; font-size: 15px; letter-spacing: -.01em; white-space: nowrap; max-height: 70%; overflow: hidden; text-overflow: ellipsis; }
.spine-plus { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1px rgba(13,13,13,.18); transition: transform .6s var(--ease), background .4s var(--ease), color .4s var(--ease); }
.spine:hover .spine-plus { transform: rotate(90deg); background: var(--ink); color: #fff; }

.panel-body { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); gap: 24px; padding: clamp(22px, 2.6vw, 36px);
  opacity: 0; transition: opacity .35s var(--ease); min-width: 640px; }
.panel[data-open] .panel-body { opacity: 1; transition: opacity .6s var(--ease) .25s; }
.pb-left { display: flex; flex-direction: column; min-height: 0; overflow: auto; scrollbar-width: none; }
.pb-kicker { font-size: 12px; color: var(--mute); margin: 0; letter-spacing: .02em; } .pb-kicker b { color: var(--ink); }
.pb-title { font-size: clamp(30px, 3.2vw, 48px); font-weight: 700; letter-spacing: -.045em; line-height: 1; margin: 12px 0 0; }
.pb-desc { color: var(--ink-2); font-size: 15px; line-height: 1.6; margin: 16px 0 0; }
.pb-feats { list-style: none; padding: 0; margin: 18px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
.pb-feats li { font-size: 13px; line-height: 1.35; padding-left: 14px; position: relative; color: var(--ink-2); }
.pb-feats li::before { content: ""; position: absolute; left: 0; top: .5em; width: 5px; height: 5px; border-radius: 50%; background: var(--ink); }
.pb-tech { list-style: none; padding: 0; margin: 18px 0 0; display: flex; flex-wrap: wrap; gap: 6px; }
.pb-tech li { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 5px 10px 5px 8px; border-radius: 999px; background: var(--paper); box-shadow: inset 0 0 0 1px var(--line); }
.pb-more { color: var(--mute); }
.pb-link { align-self: flex-start; margin-top: auto; }
.pb-left > .pb-link { margin-top: 22px; }
.pb-right { min-height: 0; }
.pb-right .mock { animation: wipe 1s var(--ease) both .2s; }
@keyframes wipe { from { clip-path: inset(0 0 0 100% round 20px); } to { clip-path: inset(0 0 0 0 round 20px); } }

@media (max-width: 900px) {
  .acc { flex-direction: column; height: auto; }
  .panel, .panel[data-open] { flex: none; }
  .spine { position: relative; flex-direction: row; padding: 18px 20px; gap: 14px; justify-content: flex-start; }
  .spine-title { writing-mode: horizontal-tb; transform: none; flex: 1; text-align: left; max-height: none; }
  .panel[data-open] .spine { opacity: 1; pointer-events: auto; }
  .panel[data-open] .spine-plus { transform: rotate(45deg); background: var(--ink); color: #fff; }
  .panel-body { position: relative; inset: auto; grid-template-columns: minmax(0,1fr); min-width: 0; display: none; padding-top: 0; }
  .panel[data-open] .panel-body { display: grid; }
  .pb-feats { grid-template-columns: 1fr; }
  .pb-title { display: none; }
  .pb-right .mock { height: 280px; }
}
`;
