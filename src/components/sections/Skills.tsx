"use client";

import { useMemo, useState } from "react";
import { SKILLS, SKILL_GROUPS, projectsUsing, type Family } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo, { isBrand } from "@/components/ui/TechLogo";

export default function Skills() {
  const [filter, setFilter] = useState<Family | "All">("All");
  const [sel, setSel] = useState(0);
  const families = useMemo(() => SKILL_GROUPS.filter((g) => SKILLS.some((s) => s.family === g)), []);
  const skill = SKILLS[sel];
  const used = projectsUsing(skill.name);

  return (
    <section id="skills" className="sec skills" aria-labelledby="skills-title">
      <style>{CSS}</style>
      <div className="wrap">
        <SectionHead id="skills" label="Skills" lead="The periodic table of my" accent="stack." />

        <div className="chips rv" role="group" aria-label="Filter skills by family">
          {(["All", ...families] as const).map((f) => (
            <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="pt-layout">
          <ul className="pt-grid rv" aria-label="Skills">
            {SKILLS.map((s, i) => {
              const dim = filter !== "All" && s.family !== filter;
              return (
                <li
                  key={s.name}
                  style={{
                    ["--d8" as string]: `${(Math.floor(i / 8) + (i % 8)) * 40}ms`,
                    ["--d4" as string]: `${(Math.floor(i / 4) + (i % 4)) * 40}ms`,
                  }}
                >
                  <button
                    className="tile"
                    data-dim={dim || undefined}
                    data-sel={sel === i || undefined}
                    onMouseEnter={() => setSel(i)}
                    onFocus={() => setSel(i)}
                    onClick={() => setSel(i)}
                    aria-label={`${s.name}, ${s.family}`}
                    aria-describedby="pt-inspector"
                  >
                    <span className="mono t-num">{i + 1}</span>
                    <span className="t-sym">{s.symbol}</span>
                    <span className="t-name">{s.name}</span>
                    <span className="mono t-fam">{s.family}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="inspector card" id="pt-inspector" aria-live="polite">
            <div className="ins-logo" key={skill.name} data-brand={isBrand(skill.logo) || undefined}>
              <span className="ins-glow" aria-hidden />
              <TechLogo k={skill.logo} size={150} alt={`${skill.name} logo`} />
            </div>
            <p className="mono ins-meta">
              <span>{String(sel + 1).padStart(2, "0")}</span>
              <span>{skill.family}</span>
            </p>
            <p className="ins-name">{skill.name}</p>
            <p className="mono ins-used-label">Used in</p>
            {used.length ? (
              <ul className="ins-used">{used.map((p) => <li key={p}>{p}</li>)}</ul>
            ) : (
              <p className="ins-none">Not tied to a featured project</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
.chip { height: 36px; padding: 0 16px; border-radius: 999px; font-size: 13px; font-weight: 500; box-shadow: inset 0 0 0 1px rgba(13,13,13,.15); color: var(--ink-2);
  transition: background .4s var(--ease), color .4s var(--ease), box-shadow .4s var(--ease); }
.chip:hover { box-shadow: inset 0 0 0 1px var(--ink); }
.chip[aria-pressed="true"] { background: var(--ink); color: #fff; box-shadow: none; }

.pt-layout { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 28px; margin-top: 28px; align-items: start; }
.pt-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(8, minmax(0,1fr)); gap: 8px; }
.pt-grid.rv { opacity: 1; transform: none; }
.pt-grid li { opacity: 0; transform: translateY(14px) scale(.96); transition: opacity .7s var(--ease), transform .8s var(--ease); transition-delay: var(--d8); }
.pt-grid.is-in li { opacity: 1; transform: none; }
.tile { position: relative; width: 100%; aspect-ratio: 1 / 1.08; display: flex; flex-direction: column; justify-content: space-between; text-align: left;
  padding: 9px 10px; border-radius: 14px; background: #fff; box-shadow: inset 0 0 0 1px var(--line);
  transition: background .35s var(--ease), color .35s var(--ease), transform .45s var(--ease), opacity .45s var(--ease), box-shadow .45s var(--ease); }
.tile:hover, .tile[data-sel] { background: var(--ink); color: #fff; transform: translateY(-3px); box-shadow: 0 16px 28px -18px rgba(13,13,13,.7); }
.tile[data-dim] { opacity: .2; }
.t-num { font-size: 10px; color: var(--faint); }
.t-sym { font-size: clamp(22px, 2.3vw, 32px); font-weight: 700; letter-spacing: -.05em; line-height: 1; }
.t-name { font-size: 11px; font-weight: 500; line-height: 1.2; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.t-fam { font-size: 8.5px; letter-spacing: .04em; text-transform: uppercase; color: var(--faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tile:hover .t-num, .tile[data-sel] .t-num, .tile:hover .t-fam, .tile[data-sel] .t-fam { color: rgba(255,255,255,.55); }

.inspector { position: sticky; top: 96px; padding: 26px; display: flex; flex-direction: column; }
.ins-logo { position: relative; height: 190px; display: grid; place-items: center; animation: pop .7s var(--ease) both; }
@keyframes pop { 0% { transform: scale(.7); opacity: 0; } 60% { transform: scale(1.04); opacity: 1; } 100% { transform: none; } }
.ins-glow { position: absolute; width: 170px; height: 170px; border-radius: 50%; background: radial-gradient(closest-side, rgba(13,13,13,.07), transparent); }
.ins-logo[data-brand] .ins-glow { background: radial-gradient(closest-side, rgba(13,13,13,.06), transparent 75%); filter: blur(4px); }
.ins-logo svg, .ins-logo img { position: relative; }
.ins-meta { display: flex; justify-content: space-between; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); margin: 18px 0 6px; }
.ins-name { font-size: 26px; font-weight: 700; letter-spacing: -.04em; margin: 0; line-height: 1.1; }
.ins-used-label { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); margin: 20px 0 8px; }
.ins-used { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.ins-used li { font-size: 12.5px; padding: 6px 11px; border-radius: 999px; background: var(--paper); box-shadow: inset 0 0 0 1px var(--line); }
.ins-none { margin: 0; color: var(--mute); font-size: 14px; }

@media (max-width: 1080px) { .pt-layout { grid-template-columns: minmax(0,1fr); } .inspector { position: relative; top: 0; } }
@media (max-width: 760px) {
  .pt-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .pt-grid li { transition-delay: var(--d4); }
}
`;
