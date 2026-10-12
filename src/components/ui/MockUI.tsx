import type { Mock } from "@/lib/data";

/* Grayscale, illustrative mini-UIs built from plain JSX + CSS. They hint at what each
   product does and are always labelled "Illustrative UI" so they aren't mistaken for screenshots. */

const Bar = ({ w, h = 6, o = 1 }: { w: string; h?: number; o?: number }) => (
  <span className="mk-bar" style={{ width: w, height: h, opacity: o }} />
);

function Crm() {
  const cols = [
    { t: "Lead", n: 3 },
    { t: "Opportunity", n: 2 },
    { t: "Quotation", n: 2 },
    { t: "Sales order", n: 1 },
  ];
  return (
    <div className="mk-crm">
      <div className="mk-top"><Bar w="30%" h={8} /><span className="mk-pill">AI agent</span></div>
      <div className="mk-kanban">
        {cols.map((c, ci) => (
          <div key={c.t} className="mk-col">
            <span className="mk-col-t mono">{c.t}</span>
            {Array.from({ length: c.n }).map((_, i) => (
              <div key={i} className="mk-card" style={{ ["--k" as string]: ci * 3 + i }}>
                <Bar w="70%" /><Bar w="45%" o={0.45} />
                {ci === 2 && i === 0 && <span className="mk-tag mono">PO · 12h</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mk-chat"><span className="mk-dot" /><Bar w="62%" o={0.6} /></div>
    </div>
  );
}

function Game() {
  return (
    <div className="mk-game">
      <div className="mk-sky">
        <span className="mk-boss" />
        {Array.from({ length: 6 }).map((_, i) => <span key={i} className="mk-orb" style={{ ["--a" as string]: `${i * 60}deg` }} />)}
      </div>
      <span className="mk-player" />
      <div className="mk-plat" style={{ left: "8%", bottom: "26%", width: "26%" }} />
      <div className="mk-plat" style={{ left: "52%", bottom: "42%", width: "20%" }} />
      <div className="mk-ground">{Array.from({ length: 14 }).map((_, i) => <i key={i} />)}</div>
      <span className="mk-hud mono">HP ▮▮▮▮▯ · FPS 60</span>
    </div>
  );
}

function Lms() {
  return (
    <div className="mk-lms">
      <aside>{["Modules", "Quizzes", "Feedback", "Announcements"].map((t, i) => <span key={t} data-on={i === 1 || undefined}>{t}</span>)}</aside>
      <div className="mk-lms-main">
        <div className="mk-q"><span className="mono mk-q-t">Q3 · 02:41</span><Bar w="80%" h={8} /><Bar w="55%" o={0.5} /></div>
        {["A", "B", "C", "D"].map((o, i) => (
          <div key={o} className="mk-opt" data-on={i === 2 || undefined}><span className="mono">{o}</span><Bar w={`${40 + i * 9}%`} o={0.5} /></div>
        ))}
        <div className="mk-progress"><i /></div>
      </div>
    </div>
  );
}

function Terminal() {
  const lines = [
    "$ systemctl status named",
    "● named.service · active (running)",
    "$ firewall-cmd --list-services",
    "dhcp dns ftp http nfs ssh",
    "$ tail -f /var/log/messages",
    "rsyslogd: restarted ✓",
  ];
  return (
    <div className="mk-term mono">
      <div className="mk-term-top"><i /><i /><i /><span>rocky@lab</span></div>
      {lines.map((l, i) => <p key={i} style={{ ["--k" as string]: i }} data-cmd={l.startsWith("$") || undefined}>{l}</p>)}
      <p className="mk-caret">$ <span /></p>
    </div>
  );
}

function Medical() {
  return (
    <div className="mk-med">
      <div className="mk-win-top mono"><span>APU Medical Center</span><span>— ▢ ×</span></div>
      <div className="mk-med-body">
        <div className="mk-tabs mono">{["Patients", "Appointments", "Prescriptions"].map((t, i) => <span key={t} data-on={i === 1 || undefined}>{t}</span>)}</div>
        <div className="mk-table">
          {Array.from({ length: 5 }).map((_, r) => (
            <div key={r} className="mk-row" style={{ ["--k" as string]: r }}><Bar w="22%" o={0.7} /><Bar w="30%" o={0.4} /><Bar w="16%" o={0.4} /></div>
          ))}
        </div>
        <div className="mk-btns"><span>Add</span><span>Edit</span><span data-on>Save</span></div>
      </div>
    </div>
  );
}

function Chart() {
  const pts = [[10, 78], [18, 70], [24, 72], [31, 61], [38, 64], [45, 52], [52, 55], [58, 44], [66, 40], [72, 42], [80, 30], [88, 26]];
  return (
    <div className="mk-chart">
      <span className="mono mk-ax">delay (min) vs distance</span>
      <svg viewBox="0 0 100 90" preserveAspectRatio="none" aria-hidden>
        <path d="M6 4V84H98" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth=".6" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="currentColor" style={{ ["--k" as string]: i }} />)}
        <path className="mk-reg" d="M8 80 L94 24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
      <span className="mono mk-r2">regression fit</span>
    </div>
  );
}

function Db() {
  const t = [
    { n: "Guest", c: ["guest_id", "name", "email"] },
    { n: "Booking", c: ["booking_id", "guest_id", "room_id"] },
    { n: "Room", c: ["room_id", "type", "rate"] },
  ];
  return (
    <div className="mk-db">
      {t.map((tb, i) => (
        <div key={tb.n} className="mk-tbl" style={{ ["--k" as string]: i }}>
          <span className="mono mk-tbl-n">{tb.n}</span>
          {tb.c.map((c, j) => <span key={c} className="mono" data-pk={j === 0 || undefined}>{c}</span>)}
        </div>
      ))}
      <svg className="mk-links" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
        <path d="M30 18 C 36 18, 36 22, 40 22" /><path d="M60 26 C 64 26, 64 18, 70 18" />
      </svg>
      <span className="mono mk-sp">EXEC sp_CheckIn @booking_id</span>
    </div>
  );
}

const MAP: Record<Mock, () => React.ReactElement> = { crm: Crm, game: Game, lms: Lms, terminal: Terminal, medical: Medical, chart: Chart, db: Db };

export default function MockUI({ kind }: { kind: Mock }) {
  const C = MAP[kind];
  return (
    <figure className="mock" aria-label="Illustrative UI, not a screenshot">
      <span className="mono mock-label">Illustrative UI</span>
      <div className="mock-stage"><C /></div>
    </figure>
  );
}

export const MOCK_CSS = `
.mock { position: relative; margin: 0; height: 100%; min-height: 260px; border-radius: 20px; background: var(--paper); box-shadow: inset 0 0 0 1px var(--line); overflow: hidden; color: var(--ink); }
.mock-label { position: absolute; right: 14px; top: 12px; z-index: 2; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--mute);
  background: rgba(255,255,255,.8); padding: 4px 9px; border-radius: 999px; box-shadow: inset 0 0 0 1px var(--line); }
.mock-stage { position: absolute; inset: 0; padding: 40px 18px 18px; }
.mk-bar { display: block; border-radius: 99px; background: var(--ink); opacity: .85; }
.mk-pill { font-size: 10px; padding: 3px 8px; border-radius: 99px; background: var(--ink); color: #fff; }

.mk-crm { height: 100%; display: flex; flex-direction: column; gap: 10px; }
.mk-top { display: flex; justify-content: space-between; align-items: center; }
.mk-kanban { flex: 1; display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
.mk-col { background: rgba(13,13,13,.035); border-radius: 12px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
.mk-col-t { font-size: 8.5px; text-transform: uppercase; letter-spacing: .04em; color: var(--mute); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mk-card { background: #fff; border-radius: 9px; padding: 8px; display: grid; gap: 5px; box-shadow: 0 1px 0 rgba(13,13,13,.06), inset 0 0 0 1px var(--line);
  animation: mkIn .7s var(--ease) both; animation-delay: calc(var(--k) * 70ms + .2s); }
.mk-tag { font-size: 8.5px; white-space: nowrap; justify-self: start; padding: 2px 6px; border-radius: 99px; background: var(--ink); color: #fff; }
.mk-chat { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: 99px; padding: 8px 12px; box-shadow: inset 0 0 0 1px var(--line); }
.mk-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ink); animation: blink 1.4s steps(2) infinite; }
@keyframes blink { 50% { opacity: .2; } }
@keyframes mkIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.mk-game { position: relative; height: 100%; border-radius: 12px; overflow: hidden; background: linear-gradient(#e7e5e1, #f7f6f3); }
.mk-sky { position: absolute; right: 18%; top: 18%; width: 64px; height: 64px; }
.mk-boss { position: absolute; inset: 18px; border-radius: 10px; background: var(--ink); }
.mk-orb { position: absolute; left: 50%; top: 50%; width: 9px; height: 9px; margin: -4.5px; border-radius: 50%; background: var(--ink-2);
  transform: rotate(var(--a)) translateX(34px); animation: orbit 3.2s linear infinite; }
@keyframes orbit { to { transform: rotate(calc(var(--a) + 360deg)) translateX(34px); } }
.mk-player { position: absolute; left: 16%; bottom: calc(26% + 6px); width: 16px; height: 22px; border-radius: 4px; background: var(--ink); animation: jump 1.6s var(--ease) infinite; }
@keyframes jump { 0%,100% { transform: none; } 40% { transform: translateY(-38px); } }
.mk-plat { position: absolute; height: 6px; border-radius: 3px; background: var(--ink-2); }
.mk-ground { position: absolute; left: 0; right: 0; bottom: 0; height: 22%; display: grid; grid-template-columns: repeat(14, 1fr); gap: 2px; }
.mk-ground i { background: rgba(13,13,13,.18); }
.mk-ground i:nth-child(3n) { background: rgba(13,13,13,.28); }
.mk-hud { position: absolute; left: 10px; top: 10px; font-size: 9px; color: var(--ink-2); }

.mk-lms { height: 100%; display: grid; grid-template-columns: 30% 1fr; gap: 10px; }
.mk-lms aside { background: #fff; border-radius: 12px; padding: 10px; display: grid; align-content: start; gap: 6px; box-shadow: inset 0 0 0 1px var(--line); }
.mk-lms aside span { font-size: 10px; padding: 6px 8px; border-radius: 7px; color: var(--mute); }
.mk-lms aside span[data-on] { background: var(--ink); color: #fff; }
.mk-lms-main { display: grid; align-content: start; gap: 7px; }
.mk-q { background: #fff; border-radius: 12px; padding: 10px; display: grid; gap: 6px; box-shadow: inset 0 0 0 1px var(--line); }
.mk-q-t { font-size: 9px; color: var(--mute); }
.mk-opt { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: 10px; padding: 7px 9px; box-shadow: inset 0 0 0 1px var(--line); }
.mk-opt span { font-size: 9px; width: 16px; height: 16px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1px var(--line); }
.mk-opt[data-on] { box-shadow: inset 0 0 0 1.5px var(--ink); } .mk-opt[data-on] span { background: var(--ink); color: #fff; }
.mk-progress { height: 5px; border-radius: 99px; background: rgba(13,13,13,.1); overflow: hidden; } .mk-progress i { display: block; height: 100%; width: 62%; background: var(--ink); animation: grow 1.6s var(--ease) both .3s; }
@keyframes grow { from { width: 0; } }

.mk-term { height: 100%; background: #111; color: #d6d6d6; border-radius: 12px; padding: 0 14px 12px; font-size: 11px; overflow: hidden; }
.mk-term-top { display: flex; align-items: center; gap: 5px; padding: 10px 0; color: #777; font-size: 10px; }
.mk-term-top i { width: 8px; height: 8px; border-radius: 50%; background: #444; } .mk-term-top span { margin-left: 8px; }
.mk-term p { margin: 0 0 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: mkIn .5s var(--ease) both; animation-delay: calc(var(--k) * 160ms + .2s); }
.mk-term p[data-cmd] { color: #fff; }
.mk-caret span { display: inline-block; width: 7px; height: 12px; background: #d6d6d6; vertical-align: -2px; animation: blink 1s steps(2) infinite; }

.mk-med { height: 100%; border-radius: 12px; background: #fff; box-shadow: inset 0 0 0 1px var(--line); overflow: hidden; display: flex; flex-direction: column; }
.mk-win-top { display: flex; justify-content: space-between; font-size: 10px; padding: 8px 10px; background: #e9e7e3; color: var(--ink-2); }
.mk-med-body { padding: 10px; display: grid; gap: 9px; flex: 1; align-content: start; }
.mk-tabs { display: flex; gap: 4px; font-size: 9.5px; } .mk-tabs span { padding: 5px 9px; border-radius: 7px; color: var(--mute); box-shadow: inset 0 0 0 1px var(--line); }
.mk-tabs span[data-on] { background: var(--ink); color: #fff; box-shadow: none; }
.mk-table { display: grid; gap: 4px; } .mk-row { display: flex; gap: 12px; padding: 7px 8px; border-radius: 6px; background: var(--paper); animation: mkIn .5s var(--ease) both; animation-delay: calc(var(--k) * 90ms + .2s); }
.mk-btns { display: flex; gap: 6px; justify-content: flex-end; } .mk-btns span { font-size: 9.5px; padding: 5px 10px; border-radius: 6px; box-shadow: inset 0 0 0 1px var(--line); }
.mk-btns span[data-on] { background: var(--ink); color: #fff; box-shadow: none; }

.mk-chart { position: relative; height: 100%; background: #fff; border-radius: 12px; box-shadow: inset 0 0 0 1px var(--line); padding: 26px 12px 26px; }
.mk-chart svg { width: 100%; height: 100%; overflow: visible; }
.mk-chart circle { opacity: 0; animation: mkFade .4s var(--ease) both; animation-delay: calc(var(--k) * 60ms + .2s); }
@keyframes mkFade { to { opacity: .8; } }
.mk-reg { stroke-dashoffset: 120; animation: draw 1.4s var(--ease) both .9s; } @keyframes draw { from { stroke-dasharray: 0 200; } to { stroke-dasharray: 3 2; } }
.mk-ax { position: absolute; left: 12px; top: 8px; font-size: 9px; color: var(--mute); } .mk-r2 { position: absolute; right: 12px; bottom: 8px; font-size: 9px; color: var(--mute); }

.mk-db { position: relative; height: 100%; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; align-content: center; }
.mk-tbl { background: #fff; border-radius: 10px; box-shadow: inset 0 0 0 1px var(--line); display: grid; overflow: hidden; animation: mkIn .6s var(--ease) both; animation-delay: calc(var(--k) * 120ms + .2s); }
.mk-tbl span { font-size: 9.5px; padding: 6px 8px; border-top: 1px solid var(--line); color: var(--ink-2); }
.mk-tbl .mk-tbl-n { background: var(--ink); color: #fff; border: 0; }
.mk-tbl span[data-pk]::before { content: "◆ "; font-size: 7px; }
.mk-links { position: absolute; inset: 30% 0 auto; height: 40%; width: 100%; pointer-events: none; }
.mk-links path { fill: none; stroke: var(--ink); stroke-width: .5; stroke-dasharray: 2 1.5; }
.mk-sp { position: absolute; left: 0; right: 0; bottom: 4px; text-align: center; font-size: 9.5px; color: var(--mute); }
@media (prefers-reduced-motion: reduce) { .mock * { animation: none !important; opacity: 1 !important; } }
`;
