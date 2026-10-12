# maneet7805.github.io

Personal portfolio of **Maneet Arvind Mehta**: a quiet, white/black/gray single-page site whose hero is a looping, talking intro video.

Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · Lenis. No GSAP, no three.js, no external scripts at runtime. First-load JS ≈ 133 kB.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Deploy (GitHub Pages)

1. Create a public repo named **`Maneet7805.github.io`** and push this folder to `main`.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and publishes on every push. The site goes live at **https://maneet7805.github.io**.

## Editing content

Everything on the page comes from **`src/lib/data.ts`**. Components only read from it.

- The résumé is the source of truth; nothing is invented. Where the CV hasn't caught up yet (the Cloudify Asia internship, Spark CRM, AWS badges), content comes from LinkedIn.
- An empty array (e.g. `CERTIFICATIONS = []`) removes that section *and* its nav link.
- **Résumé download:** put an updated PDF at `public/resume.pdf` and set `PROFILE.resume = "/resume.pdf"`. The "Résumé ↓" buttons then appear in the hero, About and Contact. (The current CV lists referees' emails and a phone number, so it isn't published as-is.)

## Rebuilding the hero video

Requires `ffmpeg`, `ffprobe`, Python 3 with `numpy` and `Pillow`.

```bash
python3 scripts/build-hero-assets.py path/to/intro.mp4
# optional: --crop W:H:X:Y   (skip auto-detection)  --photo me.jpg  (portrait for the ID card)
```

The script crops tightly around the person (head to toe, centred), scales to 768×960, whitens the backdrop, and makes a seamless loop by cross-fading the last 0.5 s into the first 0.5 s, for both picture (ffmpeg `xfade`) and audio (sample-accurate, numpy). It writes:

| File | What |
|---|---|
| `public/hero/hero.webm` | VP9 CRF 36 + Opus 80 kbps |
| `public/hero/hero.mp4` | H.264 CRF 24 + AAC 96 kbps, `+faststart` |
| `public/hero/poster.jpg` | first frame |
| `public/portrait-bust.webp` | 480×600 head-to-shirt crop for the ID card |
| `public/og.jpg` | 1200×630 share image |

Then in `src/lib/data.ts` set `PROFILE.hero.videoReady = true` and `PROFILE.portrait = "/portrait-bust.webp"`.

## Sections

| # | Section | Component | Motion |
|---|---|---|---|
| — | Navigation | `Navigation.tsx` | Glass pill after 40 px, sliding ink indicator, 2 px scroll-progress bar, clip-path mobile menu |
| — | Hero | `hero/Hero.tsx` | Video (sound if allowed, else muted until first interaction), pauses below 35 % visibility, ghost first name |
| 01 | About | `sections/About.tsx` | Lanyard ID card: damped pendulum on pointer velocity, idle sway, 3D flip (hover / tap / Enter) |
| 02 | Skills | `sections/Skills.tsx` | Periodic table, diagonal wave reveal, family filters, sticky logo inspector |
| 03 | Work | `sections/Work.tsx` | Expanding accordion gallery with clip-path-wiped illustrative mini-UIs |
| 04 | Certifications | `sections/Certifications.tsx` | Ink-flood rows linking to Credly |
| 05 | Experience | `sections/Experience.tsx` | Timeline spine drawn by scroll; stops light up as it reaches them |
| 06 | Achievements | `sections/Achievements.tsx` | Pinned horizontal gallery, count-up numbers, centre card lifts |
| 07 | Contact | `sections/Contact.tsx` | Letter-hop heading, copy-email, footer |

`prefers-reduced-motion` turns off Lenis, the pendulum and decorative animation.

## Credits & licences

- **Fonts** (self-hosted, `src/fonts`): Inter Tight, Instrument Serif, JetBrains Mono, all SIL Open Font License 1.1 (licence files alongside).
- **Brand logos** (`public/logos`): [devicon](https://devicon.dev) "original" SVGs (MIT, `public/logos/devicon/LICENSE`) and [Simple Icons](https://simpleicons.org) paths (CC0, `public/logos/simple-icons/LICENSE.md`; see `DISCLAIMER.md`). All trademarks belong to their owners.
- Concept icons are original line drawings in `src/components/ui/TechLogo.tsx`.
