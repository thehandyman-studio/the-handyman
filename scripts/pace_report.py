"""Pace + loop report for a mrABSURDLY short (local, free).

  .venv/bin/python scripts/pace_report.py <story.ts> <words.json> <video.mp4> <outdir> [--total N] [--tail 0.45]

Reads the shot list of the short's story.ts (name / start word / nth / lead / in-transition, as written by the shot
system in src/engine/shots.ts: a shot starts `lead` (default 2) frames before its word), computes every shot's frames,
writes
  shots.json        input for scripts/short_qa.py (shots, xfades, flashes, whips as planned motion)
  pace.md           shot lengths, average, longest/shortest, cuts per 10 s, words per second
  overview.jpg      one labelled frame from the middle of every shot (the scene overview)
  loop.md           loop seam check: last frame vs first frame compared with the video's normal frame-to-frame change
"""
import json, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

story, words_p, vid, out = sys.argv[1:5]
total = int(sys.argv[sys.argv.index("--total") + 1]) if "--total" in sys.argv else None
os.makedirs(out, exist_ok=True)
W = json.load(open(words_p, encoding="utf-8"))
norm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())


def idx(phrase, nth=0):
    p = [norm(x) for x in phrase.split()]
    hit = 0
    for i in range(len(W) - len(p) + 1):
        if all(norm(W[i + k]["w"]) == q for k, q in enumerate(p)):
            if hit == nth:
                return i
            hit += 1
    raise SystemExit(f"phrase not found: {phrase} #{nth}")


src = open(story, encoding="utf-8").read()
defs = src[src.index("const DEFS"):src.index("export const SHOTS")]
shots = []
for m in re.finditer(r'\{ name: "([^"]+)", place: "(\w+)", start: (null|"[^"]+")(.*?)\n', defs):
    name, place, start, rest = m.group(1), m.group(2), m.group(3), m.group(4)
    lead = int(re.search(r"lead: (\d+)", rest).group(1)) if re.search(r"lead: (\d+)", rest) else 2
    nth = int(re.search(r"nth: (\d+)", rest).group(1)) if re.search(r"nth: (\d+)", rest) else 0
    tr = re.search(r'in: \{ type: "(\w+)"(?:, frames: (\d+))?', rest)
    a = 0 if start == "null" else max(0, round(W[idx(start.strip('"'), nth)]["s"] * 30) - lead)
    shots.append({"name": name, "place": place, "a": a, "in": tr.group(1) if tr else "cut", "n": int(tr.group(2)) if tr and tr.group(2) else 8})
if total is None:
    total = int(np.ceil((W[-1]["e"] + float(sys.argv[sys.argv.index("--tail") + 1] if "--tail" in sys.argv else 0.45)) * 30))
for i, s in enumerate(shots):
    s["b"] = shots[i + 1]["a"] if i + 1 < len(shots) else total
    s["id"] = i + 1

meta = {"shots": [{"id": s["id"], "a": s["a"], "b": s["b"]} for s in shots],
        "xfade": [[s["a"] - s["n"] // 2, s["a"] + s["n"] // 2] for s in shots if s["in"] == "xfade"],
        "planned": [[s["a"] - s["n"] // 2, s["a"] + s["n"] // 2] for s in shots if s["in"] in ("whip", "glide", "flash")]
                   + [[0, 12], [total - 45, total]]}  # loop breach (debris, flash of light) is planned motion
json.dump(meta, open(os.path.join(out, "shots.json"), "w"), indent=1)

L = np.array([(s["b"] - s["a"]) / 30 for s in shots])
words_s = W[-1]["e"] - W[0]["s"]
lines = ["# Pace report", "", f"- video: `{vid}` · {total} frames = {total / 30:.2f} s",
         f"- shots: **{len(shots)}** · mean **{L.mean():.2f} s** · median {np.median(L):.2f} s · shortest {L.min():.2f} s · longest {L.max():.2f} s",
         f"- picture changes per 10 s: {len(shots) / (total / 300):.1f}",
         f"- speech: {len(W)} words in {words_s:.1f} s = **{len(W) / words_s:.2f} words/s** (estimated timings until the take exists)",
         f"- transitions: " + ", ".join(f"{k} {sum(1 for s in shots if s['in'] == k)}" for k in ("cut", "whip", "glide", "flash", "xfade")),
         "", "| # | shot | place | in | frames | s |", "|---|---|---|---|---|---|"]
lines += [f"| {s['id']} | {s['name']} | {s['place']} | {s['in']} | {s['a']}–{s['b'] - 1} | {(s['b'] - s['a']) / 30:.2f} |" for s in shots]
over5 = [s["name"] for s in shots if (s["b"] - s["a"]) / 30 > 5]
lines += ["", f"- longer than 5 s: {', '.join(over5) if over5 else 'none'}"]
open(os.path.join(out, "pace.md"), "w").write("\n".join(lines) + "\n")


def frame(n, w=270):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", vid, "-vf", f"select=eq(n\\,{n}),scale={w}:-2", "-vframes", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True).stdout
    h = len(raw) // (w * 3)
    return np.frombuffer(raw, np.uint8).reshape(h, w, 3)


# overview: middle frame of every shot, labelled
tiles = []
for s in shots:
    im = Image.fromarray(frame((s["a"] + s["b"]) // 2))
    d = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype("public/fonts/Nunito-Variable.ttf", 22)
    except OSError:
        font = ImageFont.load_default()
    d.rectangle([0, 0, im.width, 30], fill=(20, 16, 24))
    d.text((6, 3), f"{s['name']}  ({(s['b'] - s['a']) / 30:.1f}s)", fill=(255, 230, 160), font=font)
    tiles.append(im)
cols = 8
rows = (len(tiles) + cols - 1) // cols
tw, th = tiles[0].size
sheet = Image.new("RGB", (cols * tw, rows * th), (30, 30, 30))
for i, t in enumerate(tiles):
    sheet.paste(t, ((i % cols) * tw, (i // cols) * th))
sheet.save(os.path.join(out, "overview.jpg"), quality=88)

# loop seam: |last - first| against the normal frame-to-frame change (same scale, luminance)
lum = lambda a: a.astype(np.float32).mean(axis=2)
seq = [lum(frame(n, 180)) for n in list(range(0, 12)) + list(range(total - 12, total))]
first, last = seq[0], seq[-1]
seam = float(np.abs(last - first).mean())
inner = [float(np.abs(seq[i + 1] - seq[i]).mean()) for i in range(len(seq) - 1) if i != 11]
lines = ["# Loop seam check", "", f"- last frame {total - 1} -> first frame 0: mean luminance change **{seam:.2f}** (0-255)",
         f"- normal change between neighbouring frames around the seam: median {np.median(inner):.2f}, max {max(inner):.2f}",
         f"- verdict: {'SEAMLESS (within the normal frame-to-frame change)' if seam <= max(inner) * 1.05 else 'VISIBLE JUMP'}"]
open(os.path.join(out, "loop.md"), "w").write("\n".join(lines) + "\n")
Image.fromarray(np.concatenate([frame(total - 2), frame(total - 1), frame(0), frame(1), frame(3)], axis=1)).save(os.path.join(out, "loop_seam.jpg"), quality=90)
print("\n".join(open(os.path.join(out, "pace.md")).read().splitlines()[:8]))
print(open(os.path.join(out, "loop.md")).read())
