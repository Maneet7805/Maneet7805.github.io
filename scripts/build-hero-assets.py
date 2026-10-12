#!/usr/bin/env python3
"""
Turn the raw intro video into the site's seamless-looping hero clip.

    python3 scripts/build-hero-assets.py intro.mp4
    python3 scripts/build-hero-assets.py intro.mov --crop 800:1000:560:80 --photo me.jpg

What it does (spec §3):
  1. Finds the person against the light backdrop (or uses --crop W:H:X:Y), crops head-to-toe
     with the person centred, and scales to 768 px wide (768×960).
  2. Whitens the backdrop: colorlevels=rimax=0.98:gimax=0.98:bimax=0.98.
  3. Takes about the first 10 s and cross-fades the last 0.5 s into the first 0.5 s, for the
     picture (ffmpeg xfade) and the audio (sample-accurate, in numpy). Nothing is stretched or
     retimed, so lips stay in sync.
  4. Exports public/hero/hero.mp4 (H.264 CRF 24, AAC 96k, +faststart) and
     public/hero/hero.webm (VP9 CRF 36, Opus 80k), plus public/hero/poster.jpg.
  5. Saves public/portrait-bust.webp (480×600, head-to-shirt) from the sharpest frame or --photo,
     and public/og.jpg (1200×630).

Afterwards set PROFILE.hero.videoReady = true and PROFILE.portrait = "/portrait-bust.webp"
in src/lib/data.ts.

Needs: ffmpeg + ffprobe on PATH, numpy, Pillow.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT_W, OUT_H = 768, 960
SR = 48000


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, **kw)


def probe(path: Path) -> dict:
    out = run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)],
              capture_output=True, text=True).stdout
    info = json.loads(out)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    num, den = (int(x) for x in v.get("r_frame_rate", "30/1").split("/"))
    return {
        "w": int(v["width"]), "h": int(v["height"]),
        "fps": num / den if den else 30.0,
        "duration": float(info["format"]["duration"]),
        "has_audio": a is not None,
    }


def sample_frames(path: Path, duration: float, n: int, tmp: Path) -> list[Image.Image]:
    frames = []
    for i in range(n):
        t = duration * (i + 0.5) / n
        f = tmp / f"s{i:02d}.png"
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(path), "-frames:v", "1", str(f)])
        frames.append(Image.open(f).convert("RGB"))
    return frames


def person_bbox(frames: list[Image.Image]) -> tuple[int, int, int, int]:
    """Union bounding box of everything that differs from the light backdrop."""
    union = None
    for im in frames:
        a = np.asarray(im).astype(np.int16)
        border = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
        bg = np.median(border, axis=0)
        diff = np.abs(a - bg).max(axis=2)
        mask = diff > 28
        # ignore the soft floor shadow: require a few pixels per row/column
        rows = np.where(mask.sum(axis=1) > max(3, mask.shape[1] * 0.004))[0]
        cols = np.where(mask.sum(axis=0) > max(3, mask.shape[0] * 0.004))[0]
        if len(rows) == 0 or len(cols) == 0:
            continue
        box = (cols[0], rows[0], cols[-1], rows[-1])
        union = box if union is None else (min(union[0], box[0]), min(union[1], box[1]), max(union[2], box[2]), max(union[3], box[3]))
    if union is None:
        sys.exit("Could not find the person against the background. Pass --crop W:H:X:Y.")
    return tuple(int(v) for v in union)  # type: ignore[return-value]


def crop_for(box, W, H) -> tuple[int, int, int, int]:
    """768:960-shaped crop, person centred, head to toe with a little air."""
    x0, y0, x1, y1 = box
    ph = y1 - y0
    pad = int(ph * 0.06)
    ch = min(H, ph + 2 * pad)
    cw = int(round(ch * OUT_W / OUT_H))
    if cw < (x1 - x0) + 2 * pad:  # very wide pose: widen and grow height to keep the ratio
        cw = min(W, (x1 - x0) + 2 * pad)
        ch = min(H, int(round(cw * OUT_H / OUT_W)))
    cw -= cw % 2
    ch -= ch % 2
    cx = (x0 + x1) // 2
    x = max(0, min(W - cw, cx - cw // 2))
    y = max(0, min(H - ch, y0 - pad))
    return cw, ch, x, y


def sharpest(frames: list[Image.Image]) -> Image.Image:
    def score(im):
        g = np.asarray(im.convert("L"), dtype=np.float32)
        lap = g[1:-1, 1:-1] * 4 - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]
        return lap.var()
    return max(frames, key=score)


def read_audio(path: Path, start: float, dur: float) -> np.ndarray:
    raw = run(["ffmpeg", "-v", "error", "-ss", f"{start:.6f}", "-t", f"{dur:.6f}", "-i", str(path),
               "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def write_wav(path: Path, data: np.ndarray):
    run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", str(path)],
        input=np.clip(data, -1, 1).astype(np.float32).tobytes())


def loop_audio(src: Path, L: float, X: float) -> np.ndarray:
    """Same arithmetic as the video xfade: [X..L] with its last X seconds faded into [0..X]."""
    full = read_audio(src, 0, L)
    n_total = int(round(L * SR))
    if len(full) < n_total:
        full = np.pad(full, ((0, n_total - len(full)), (0, 0)))
    n = int(round(X * SR))
    body = full[n:n_total]            # source X..L
    head = full[:n]                   # source 0..X
    t = np.linspace(0, np.pi / 2, n, dtype=np.float32)[:, None]
    fade_out, fade_in = np.cos(t), np.sin(t)  # equal-power
    tail = body[-n:] * fade_out + head * fade_in
    return np.concatenate([body[:-n], tail])  # length L - X


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video", type=Path)
    ap.add_argument("--crop", help="W:H:X:Y (skips person detection)")
    ap.add_argument("--photo", type=Path, help="front-facing photo for portrait-bust.webp")
    ap.add_argument("--seconds", type=float, default=10.0, help="length of the source span to use (default 10)")
    ap.add_argument("--xfade", type=float, default=0.5, help="loop cross-fade in seconds (default 0.5)")
    ap.add_argument("--out", type=Path, default=ROOT / "public")
    args = ap.parse_args()

    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(f"{tool} not found on PATH")
    src = args.video.resolve()
    info = probe(src)
    L = min(args.seconds, info["duration"])
    X = args.xfade
    if L <= 2 * X + 0.5:
        sys.exit("Video is too short for a seamless loop.")
    hero_dir = args.out / "hero"
    hero_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        frames = sample_frames(src, L, 10, tmp)

        if args.crop:
            cw, ch, x, y = (int(v) for v in args.crop.split(":"))
            box = (x, y, x + cw, y + ch)
        else:
            box = person_bbox(frames)
            cw, ch, x, y = crop_for(box, info["w"], info["h"])
        print(f"source {info['w']}x{info['h']} @ {info['fps']:.2f}fps, using {L:.2f}s")
        print(f"crop={cw}:{ch}:{x}:{y}  (pass --crop {cw}:{ch}:{x}:{y} to reuse)")

        vf = (f"crop={cw}:{ch}:{x}:{y},scale={OUT_W}:-2:flags=lanczos,"
              f"pad={OUT_W}:{OUT_H}:(ow-iw)/2:(oh-ih)/2:color=white,"
              f"colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,setsar=1,format=yuv420p")
        fps = round(info["fps"], 3)

        # 1) cropped + whitened, constant frame rate, first L seconds
        base = tmp / "base.mp4"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-t", f"{L:.6f}", "-an", "-vf", f"{vf},fps={fps}",
             "-c:v", "libx264", "-crf", "12", "-preset", "fast", str(base)])

        # 2) seamless loop: [X..L] cross-faded at its end into [0..X]  → length L − X
        looped = tmp / "loop.mp4"
        fc = (f"[0:v]split=2[a][b];"
              f"[a]trim=start={X}:end={L},setpts=PTS-STARTPTS[body];"
              f"[b]trim=start=0:end={X},setpts=PTS-STARTPTS[head];"
              f"[body][head]xfade=transition=fade:duration={X}:offset={L - 2 * X:.6f},format=yuv420p[v]")
        run(["ffmpeg", "-v", "error", "-y", "-i", str(base), "-filter_complex", fc, "-map", "[v]",
             "-c:v", "libx264", "-crf", "12", "-preset", "fast", str(looped)])

        audio = None
        if info["has_audio"]:
            audio = tmp / "loop.wav"
            write_wav(audio, loop_audio(src, L, X))
        else:
            print("note: source has no audio track; exporting silent video")

        a_in = ["-i", str(audio)] if audio else []
        mp4 = hero_dir / "hero.mp4"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(looped), *a_in, "-map", "0:v", *(["-map", "1:a"] if audio else []),
             "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
             *(["-c:a", "aac", "-b:a", "96k"] if audio else []), "-movflags", "+faststart", "-shortest", str(mp4)])
        webm = hero_dir / "hero.webm"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(looped), *a_in, "-map", "0:v", *(["-map", "1:a"] if audio else []),
             "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p",
             *(["-c:a", "libopus", "-b:a", "80k"] if audio else []), "-shortest", str(webm)])
        run(["ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-frames:v", "1", "-q:v", "3", str(hero_dir / "poster.jpg")])

        # 3) portrait bust (480×600, head to shirt)
        if args.photo:
            bust_src = Image.open(args.photo).convert("RGB")
            bw, bh = bust_src.size
            side_h = min(bh, int(bw * 1.25))
            bust = bust_src.crop(((bw - int(side_h * 0.8)) // 2, 0, (bw + int(side_h * 0.8)) // 2, side_h))
        else:
            sharp = sharpest(frames)
            x0, y0, x1, y1 = person_bbox([sharp])
            ph = y1 - y0
            bh = int(ph * 0.40)
            bw = int(bh * 0.8)
            cx = (x0 + x1) // 2
            top = max(0, y0 - int(ph * 0.03))
            bust = sharp.crop((cx - bw // 2, top, cx + bw // 2, top + bh))
        bust = bust.resize((480, 600), Image.LANCZOS)
        bust.save(args.out / "portrait-bust.webp", "WEBP", quality=86)

        # 4) og.jpg: paper background, name on the left, person on the right
        og = Image.new("RGB", (1200, 630), "#f4f2ee")
        person = sharpest(frames).crop((x, y, x + cw, y + ch)).resize((504, 630), Image.LANCZOS)
        mask = person.convert("L").point(lambda v: 255 if v < 238 else 0).filter(ImageFilter.GaussianBlur(1.2))
        og.paste(person, (640, 0), mask)
        d = ImageDraw.Draw(og)
        try:
            big = ImageFont.truetype(str(ROOT / "src/fonts/InterTight-Variable.woff2"), 74)
        except Exception:
            big = ImageFont.load_default()
        d.text((72, 236), "Maneet Arvind\nMehta", font=big, fill="#0d0d0d", spacing=6)
        og.save(args.out / "og.jpg", quality=88)

    print("done:")
    for p in [mp4, webm, hero_dir / "poster.jpg", args.out / "portrait-bust.webp", args.out / "og.jpg"]:
        print(f"  {p.relative_to(ROOT) if p.is_relative_to(ROOT) else p}  {p.stat().st_size / 1024:.0f} KB")
    print('next: in src/lib/data.ts set hero.videoReady = true and portrait = "/portrait-bust.webp"')


if __name__ == "__main__":
    main()
