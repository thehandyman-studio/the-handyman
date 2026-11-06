"""Estimated word timings from the script text (local, free) - lets the picture be built BEFORE any paid recording.

    python3 scripts/estimate_words.py shorts/<name>/voice/narration.txt shorts/<name>/voice/estimate/words_estimated.json [--wps 3.3]

Word length ~ letters (min 0.12 s), pause after , ; : 0.12 s and after . ! ? … 0.22 s, scaled so the whole text runs at
--wps words per second (3.3 = John V3 in the pilot: 151 words in 45.4 s). Same format as words_master.json.
After the real recording the picture switches to words_master.json; cuts then move by up to ~1 s.
"""
import json, re, sys

src, dst = sys.argv[1], sys.argv[2]
wps = float(sys.argv[sys.argv.index("--wps") + 1]) if "--wps" in sys.argv else 3.3
words = [w for w in open(src, encoding="utf-8").read().split() if re.search(r"[A-Za-z0-9]", w)]
dur = [max(0.12, 0.055 * len(re.sub(r"[^A-Za-z0-9]", "", w))) for w in words]
gap = [0.22 if re.search(r"[.!?…]\W*$", w) else 0.12 if re.search(r"[,;:]\W*$", w) else 0.02 for w in words]
k = (len(words) / wps) / (sum(dur) + sum(gap[:-1]))
t, out = 0.03, []
for w, d, g in zip(words, dur, gap):
    out.append({"w": w, "s": round(t, 3), "e": round(t + d * k, 3)})
    t += (d + g) * k
json.dump(out, open(dst, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"{len(words)} words, ends at {out[-1]['e']:.2f} s ({wps} words/s) -> {dst}")
