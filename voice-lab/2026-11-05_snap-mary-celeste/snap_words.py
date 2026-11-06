"""Word-timing correction prototype (test folder only; no API, no cost).

    .venv/bin/python voice-lab/2026-11-05_v3-test/snap_words.py [take]     # default take: v3_stab05

Reads  voice/takes/<take>/raw/alignment.json, voice/takes/<take>/voice.wav, voice/takes/<take>/processing.json,
       voice/test_spoken.captions.json
Writes voice/takes/<take>/words_snapped.json + snap_report.json   (words.json and all audio stay untouched)

Why: eleven_v3 puts the pause duration on punctuation characters ("…" 0.8 s, "." 1.1 s) and sometimes starts a word
inside a pause, so captions would show up early and hang during pauses.
Method:
 1. word times from letters/digits only (punctuation and audio tags get zero duration) - same caption words as before
 2. real pauses from the audio: 10 ms RMS envelope, threshold relative to the recording, pauses >= MIN_PAUSE
 3. monotonic assignment of each pause to one word boundary (dynamic programming): cost = distance between the pause
    and the boundary in the v3 timing, cheaper at boundaries with pause punctuation (… . ? , : ;)
 4. the words between two pauses are spread over the actually spoken stretch, keeping their v3 proportions
"""
import json
import os
import re
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(PROJECT, "scripts", "voice"))
sys.path.insert(0, os.path.join(PROJECT, "shorts", "bridge", "audio"))
from common import caption_words, check_caption_reference  # noqa: E402
from dsp import read_wav  # noqa: E402

HOP = 0.01          # envelope frame (s)
MIN_PAUSE = 0.15    # shorter gaps are normal articulation, not pauses
PUNCT_BONUS = 0.35  # a pause is more likely at a boundary with pause punctuation (s of cost)
UNMATCHED = 0.9     # cost of leaving a detected pause unplaced (a boundary without pause costs nothing)
BLIP = 0.06         # non-silent runs shorter than this are treated as silence (clicks, fade remnants)


def alnum_only(al):
    """Copy of the alignment where every non-letter/digit character has zero duration at the previous letter's end."""
    ch, s, e = al["characters"], list(al["character_start_times_seconds"]), list(al["character_end_times_seconds"])
    last = s[0] if s else 0.0
    for i, c in enumerate(ch):
        if c.isalnum():
            last = e[i]
        else:
            s[i] = e[i] = last
    return {"characters": ch, "character_start_times_seconds": s, "character_end_times_seconds": e}


def pauses_from_audio(x, sr):
    h = int(sr * HOP)
    env = 20 * np.log10(np.sqrt((x[: len(x) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-9)
    floor, loud = np.percentile(env, 5), np.percentile(env, 95)
    thr = max(floor + 20.0, loud - 45.0)
    quiet = env < thr
    # tiny sound blips (< BLIP s, e.g. a click at the very end of the file) are not speech
    i = 0
    while i < len(quiet):
        if not quiet[i]:
            j = i
            while j < len(quiet) and not quiet[j]:
                j += 1
            if (j - i) * HOP < BLIP:
                quiet[i:j] = True
            i = j
        else:
            i += 1
    runs, st = [], None
    for i, q in enumerate(np.append(quiet, False)):
        if q and st is None:
            st = i
        if not q and st is not None:
            runs.append((st * HOP, i * HOP))
            st = None
    speech = np.flatnonzero(~quiet)
    first, last = speech[0] * HOP, (speech[-1] + 1) * HOP
    inner = [(a, b) for a, b in runs if b - a >= MIN_PAUSE and a > first and b < last]
    return inner, first, last, thr


def assign(pauses, words):
    """Monotonic DP: each pause -> one distinct boundary k (between word k and k+1)."""
    K, J = len(words) - 1, len(pauses)
    g = [(words[k]["e"] + words[k + 1]["s"]) / 2 for k in range(K)]
    bonus = [PUNCT_BONUS if re.search(r"[….?!,:;—]$", words[k]["w"]) else 0.0 for k in range(K)]
    INF = 1e9
    dp = np.full((J + 1, K + 1), INF)          # dp[j][k]: first j pauses handled using boundaries < k
    dp[0, :] = 0.0
    for j in range(1, J + 1):
        dp[j, 0] = dp[j - 1, 0] + UNMATCHED
    back = {}
    for j in range(1, J + 1):
        m = (pauses[j - 1][0] + pauses[j - 1][1]) / 2
        for k in range(1, K + 1):
            opts = [(dp[j, k - 1], "skip_boundary"),                               # boundary k-1 gets no pause
                    (dp[j - 1, k - 1] + abs(m - g[k - 1]) - bonus[k - 1], "take"),  # pause j-1 -> boundary k-1
                    (dp[j - 1, k] + UNMATCHED, "drop_pause")]                       # pause j-1 left unplaced
            dp[j, k], back[(j, k)] = min(opts, key=lambda o: o[0])
    res, dropped, j, k = {}, [], J, K
    while j > 0 and k >= 0:
        step = back.get((j, k), "drop_pause")
        if step == "take":
            res[k - 1] = pauses[j - 1]
            j -= 1
            k -= 1
        elif step == "skip_boundary":
            k -= 1
        else:
            dropped.append(pauses[j - 1])
            j -= 1
    return res, dropped


def main():
    take = sys.argv[1] if len(sys.argv) > 1 else "v3_stab05"
    vdir = os.path.join(HERE, "voice")
    tdir = os.path.join(vdir, "takes", take)
    out = os.path.join(tdir, "words_snapped.json")
    if os.path.exists(out):
        sys.exit(f"{out} existiert schon - nichts ueberschrieben.")
    rules = json.load(open(os.path.join(vdir, "test_spoken.captions.json"), encoding="utf-8"))
    al = json.load(open(os.path.join(tdir, "raw", "alignment.json"), encoding="utf-8"))["alignment"]
    tempo = json.load(open(os.path.join(tdir, "processing.json"), encoding="utf-8"))["tempo_factor"]
    words_v3 = caption_words(alnum_only(al), tempo, rules)            # same caption words, punctuation time removed
    words_old = json.load(open(os.path.join(tdir, "words.json"), encoding="utf-8"))
    assert [w["w"] for w in words_v3] == [w["w"] for w in words_old], "Wortliste weicht ab"
    x, sr = read_wav(os.path.join(tdir, "voice.wav"))
    pauses, first, last, thr = pauses_from_audio(x[0], sr)
    placed, dropped = assign(pauses, words_v3)

    # spoken stretches between placed pauses -> spread the words of each stretch with their v3 proportions
    cuts = sorted(placed)                         # boundary indices with a pause
    groups, start = [], 0
    for k in cuts:
        groups.append((start, k))
        start = k + 1
    groups.append((start, len(words_v3) - 1))
    seg_bounds = [first] + [b for k in cuts for b in placed[k]] + [last]
    snapped = []
    for gi, (i0, i1) in enumerate(groups):
        S, E = seg_bounds[2 * gi], seg_bounds[2 * gi + 1]
        v0, v1 = words_v3[i0]["s"], words_v3[i1]["e"]
        f = (lambda t: S + (t - v0) / (v1 - v0) * (E - S)) if v1 > v0 else None
        n = i1 - i0 + 1
        for i in range(i0, i1 + 1):
            w = words_v3[i]
            if f:
                s, e = f(w["s"]), f(w["e"])
            else:
                s, e = S + (i - i0) * (E - S) / n, S + (i - i0 + 1) * (E - S) / n
            snapped.append({"w": w["w"], "s": round(s, 3), "e": round(max(e, s + 0.02), 3)})

    diff = check_caption_reference(snapped, vdir, rules)
    if diff:
        sys.exit(f"Untertitel-Woerter passen nicht zur Referenz: {diff}")
    with open(out, "x", encoding="utf-8") as fh:
        json.dump(snapped, fh, indent=1, ensure_ascii=False)
    report = {"take": take, "threshold_dbfs": round(float(thr), 1), "min_pause_s": MIN_PAUSE,
              "speech_start_s": round(first, 3), "speech_end_s": round(last, 3),
              "pauses": [[round(a, 3), round(b, 3)] for a, b in pauses],
              "pause_after_word": {words_v3[k]["w"] + f" (#{k + 1})": [round(a, 3), round(b, 3)]
                                   for k, (a, b) in sorted(placed.items())},
              "pauses_not_placed": [[round(a, 3), round(b, 3)] for a, b in dropped]}
    json.dump(report, open(os.path.join(tdir, "snap_report.json"), "x", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(json.dumps(report, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
