import { CERTIFICATIONS, sectionTag } from "@/lib/data";
import { ArrowUpRight } from "@/components/ui/Icons";

export default function Certifications() {
  const n = CERTIFICATIONS.length;
  return (
    <section id="certifications" className="sec certs" aria-labelledby="certifications-title">
      <style>{CSS}</style>
      <div className="wrap certs-grid">
        <div className="certs-head">
          <p className="tag rv"><b>{sectionTag("certifications")}</b><span aria-hidden>—</span>Certifications</p>
          <h2 className="h2" id="certifications-title">
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span>Always <em>learning.</em></span></span>
          </h2>
          <p className="mono certs-count rv" style={{ ["--i" as string]: 2 }}>
            {String(n).padStart(2, "0")} {n === 1 ? "certification" : "certifications"} · verified on Credly
          </p>
        </div>
        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => {
            const inner = (
              <>
                <span className="mono c-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="c-main">
                  <span className="c-title">{c.title}</span>
                  <span className="c-issuer">{c.issuer} · {c.date}</span>
                </span>
                <span className="c-arrow" aria-hidden><ArrowUpRight size={18} /></span>
              </>
            );
            return (
              <li key={c.title} className="rv" style={{ ["--i" as string]: i }}>
                {c.href ? (
                  <a className="c-row" href={c.href} target="_blank" rel="noreferrer" aria-label={`${c.title}, ${c.issuer}, ${c.date}. Opens credential.`}>{inner}</a>
                ) : (
                  <div className="c-row" tabIndex={0}>{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const CSS = `
.certs { background: #fff; border-block: 1px solid var(--line); }
.certs-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 5vw, 80px); align-items: start; }
.certs-head { position: sticky; top: 110px; }
.certs-count { font-size: 12px; color: var(--mute); margin: 22px 0 0; letter-spacing: .04em; }
.certs-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.certs-list li { border-bottom: 1px solid var(--line); }
.c-row { position: relative; display: grid; grid-template-columns: 48px minmax(0,1fr) 28px; align-items: center; gap: 12px; padding: 24px 18px; overflow: hidden; isolation: isolate; border-radius: 0; }
.c-row::before { content: ""; position: absolute; inset: 0; background: var(--ink); transform: scaleX(0); transform-origin: 0 50%; transition: transform .7s var(--ease); z-index: -1; }
.c-row:hover::before, .c-row:focus-visible::before { transform: scaleX(1); }
.c-row:hover, .c-row:focus-visible { color: #fff; }
.c-num { font-size: 12px; color: var(--faint); transition: color .5s var(--ease); }
.c-main { display: grid; gap: 4px; }
.c-title { font-size: clamp(17px, 1.6vw, 22px); font-weight: 600; letter-spacing: -.025em; line-height: 1.25; }
.c-issuer { font-size: 13px; color: var(--mute); transition: color .5s var(--ease); }
.c-row:hover .c-num, .c-row:hover .c-issuer, .c-row:focus-visible .c-num, .c-row:focus-visible .c-issuer { color: rgba(255,255,255,.6); }
.c-arrow { opacity: 0; transform: translate(-10px, 10px); transition: opacity .5s var(--ease), transform .6s var(--ease); }
.c-row:hover .c-arrow, .c-row:focus-visible .c-arrow { opacity: 1; transform: none; }
.c-row:focus-visible { outline: none; }
@media (max-width: 860px) { .certs-grid { grid-template-columns: minmax(0,1fr); } .certs-head { position: relative; top: 0; } }
`;
