"""Designed silent beats in a narration (new, used from Episode 7 on; changes nothing for older episodes).

    python3 scripts/voice/insert_beats.py <beats.json> <words_in.json> <words_out.json> [--wav <voice_in.wav> <voice_out.wav>]

beats.json: {"beats": [{"after": "<word as in narration.txt>", "nth": 0, "s": <seconds>}, ...]}
Inserts `s` seconds of silence right after the end of that word (nth occurrence, matched case/punctuation-insensitive):
every later word moves by the inserted time. With --wav the same silence is cut into the voice file at the same
places (the cut sits halfway between the word end and the next word start, so no breath or tail is clipped).
The free estimate (estimate_words.py) and the real John take (natural_master.py) both go through this tool, so the
picture and the mix always read the same timing (words_timed.json).
"""
import json, re, sys

norm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())


def plan(beats, words):
    out = []
    for b in beats["beats"]:
        hits = [i for i, w in enumerate(words) if norm(w["w"]) == norm(b["after"])]
        n = b.get("nth", 0)
        if len(hits) <= n:
            sys.exit(f"beat word not found: {b['after']} #{n}")
        i = hits[n]
        nxt = words[i + 1]["s"] if i + 1 < len(words) else words[i]["e"] + 0.2
        out.append((words[i]["e"] + (nxt - words[i]["e"]) / 2, float(b["s"]), i))
    return sorted(out)


def main():
    a = sys.argv[1:]
    beats = json.load(open(a[0], encoding="utf-8"))
    words = json.load(open(a[1], encoding="utf-8"))
    cuts = plan(beats, words)
    shift = lambda t: t + sum(s for c, s, _ in cuts if c < t)
    new = [{"w": w["w"], "s": round(shift(w["s"]), 3), "e": round(shift(w["e"]), 3)} for w in words]
    json.dump(new, open(a[2], "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    if "--wav" in a:
        import numpy as np
        from scipy.io import wavfile
        src, dst = a[a.index("--wav") + 1], a[a.index("--wav") + 2]
        sr, x = wavfile.read(src)
        parts, pos = [], 0
        for c, s, _ in cuts:
            k = int(round(c * sr))
            parts += [x[pos:k], np.zeros((int(round(s * sr)),) + x.shape[1:], dtype=x.dtype)]
            pos = k
        parts.append(x[pos:])
        wavfile.write(dst, sr, np.concatenate(parts))
    print(f"{len(cuts)} beats, +{sum(s for _, s, _ in cuts):.2f} s, last word ends at {new[-1]['e']:.2f} s -> {a[2]}")


if __name__ == "__main__":
    main()
