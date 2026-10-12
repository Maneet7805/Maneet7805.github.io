"use client";

import { useRef, useState } from "react";
import { PROFILE, sectionTag } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import { ArrowDown, ArrowUpRight, GitHubMark, LinkedInMark, Mail } from "@/components/ui/Icons";

/* Each letter hops once, in sequence, when the heading enters view; any letter hops again on hover. */
function HopLine({ text, offset = 0, accent }: { text: string; offset?: number; accent?: string }) {
  const words = text.split(" ");
  let n = offset;
  return (
    <span className="hop-line" aria-hidden>
      {words.map((w, wi) => (
        <span key={wi}>
          <span className={`hop-word${accent && w === accent ? " hop-accent" : ""}`}>
            {[...w].map((ch, ci) => (
              <span key={ci} className="hop" style={{ ["--n" as string]: n++ }}>{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

export default function Contact() {
  const head = useRef<HTMLHeadingElement>(null);
  const seen = useInView(head, { threshold: 0.4 });
  const [copied, setCopied] = useState(false);
  const year = new Date().getFullYear();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked: the mailto link still works */ }
  };

  const l1 = "Let's build";
  const l2 = "something together.";

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <style>{CSS}</style>
      <div className="wrap contact-inner">
        <p className="tag rv"><b>{sectionTag("contact")}</b><span aria-hidden>—</span>Contact</p>
        <h2 className="contact-title" id="contact-title" ref={head} data-seen={seen || undefined}>
          <span className="sr-only">{l1} {l2}</span>
          <HopLine text={l1} />
          <HopLine text={l2} offset={l1.length} accent="together." />
        </h2>

        <div className="contact-row rv" style={{ ["--i" as string]: 2 }}>
          <a className="contact-email" href={`mailto:${PROFILE.email}`}>
            <Mail size={22} /> {PROFILE.email}
          </a>
          <button className="btn btn-ghost" onClick={copy} aria-live="polite">{copied ? "Copied ✓" : "Copy email"}</button>
        </div>

        <div className="contact-links rv" style={{ ["--i" as string]: 3 }}>
          <a className="btn btn-primary" href={`mailto:${PROFILE.email}`}>Say hello <ArrowUpRight /></a>
          <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noreferrer"><LinkedInMark /> LinkedIn</a>
          <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noreferrer"><GitHubMark /> GitHub</a>
          {PROFILE.resume && <a className="btn btn-ghost" href={PROFILE.resume} download>Résumé <ArrowDown /></a>}
        </div>
      </div>

      <footer className="foot">
        <div className="wrap foot-inner">
          <p className="mono">© {year} {PROFILE.name}</p>
          <p className="mono foot-loc">{PROFILE.location}</p>
          <a href="#top" className="mono foot-top" onClick={(e) => { e.preventDefault(); scrollToTarget("top"); }}>Back to top ↑</a>
        </div>
      </footer>
    </section>
  );
}

const CSS = `
.contact { padding-top: var(--sec-pad); }
.contact-inner { padding-bottom: clamp(72px, 12vh, 140px); }
.contact-title { margin: 22px 0 0; font-weight: 700; letter-spacing: -.055em; line-height: .95; font-size: clamp(48px, 10vw, 168px); }
.hop-line { display: block; }
.hop-word { display: inline-block; white-space: nowrap; }
.hop-accent { font-family: var(--font-serif); font-style: italic; font-weight: 400; color: var(--mute); letter-spacing: -.02em; }
.hop { display: inline-block; transition: transform .5s var(--ease); }
.contact-title[data-seen] .hop { animation: hop .9s var(--ease) both; animation-delay: calc(var(--n) * 35ms); }
@keyframes hop { 0% { transform: translateY(0); } 35% { transform: translateY(-.18em); } 70% { transform: translateY(.03em); } 100% { transform: none; } }
.hop:hover { animation: hop .7s var(--ease) both !important; animation-delay: 0s !important; }
.contact-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 20px; margin-top: clamp(40px, 6vh, 64px); }
.contact-email { display: inline-flex; align-items: center; gap: 12px; font-size: clamp(20px, 2.6vw, 34px); font-weight: 600; letter-spacing: -.03em;
  border-bottom: 2px solid var(--line); padding-bottom: 4px; transition: border-color .5s var(--ease); overflow-wrap: anywhere; }
.contact-email:hover { border-color: var(--ink); }
.contact-links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
.foot { border-top: 1px solid var(--line); }
.foot-inner { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding-block: 26px; font-size: 12px; color: var(--mute); flex-wrap: wrap; }
.foot-inner p { margin: 0; }
.foot-top { color: var(--ink); }
.foot-top:hover { text-decoration: underline; text-underline-offset: 4px; }
`;
