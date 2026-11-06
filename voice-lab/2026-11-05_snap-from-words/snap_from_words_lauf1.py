"""Pause correction starting from an existing words.json (no character alignment needed). Test folder only.

    .venv/bin/python -I voice-lab/2026-11-05_snap-from-words/snap_from_words.py <folder>
        <folder> contains voice.wav + words.json (+ narration.txt as caption reference)
        writes <folder>/words_snapped.json + <folder>/snap_report.json (never overwrites; inputs are only read)

Same core as voice-lab/2026-11-05_v3-test/snap_words.py (pause detection, monotonic pause->boundary assignment,
spreading the words of each spoken stretch), plus one step because words.json has no character times:
 0. words whose duration is implausible for their number of letters (eleven_v3 puts pauses on "…" / "." and
    sometimes stretches a word into a pause) are capped to CAP_FACTOR x the median time per letter.
    Words with digits are never capped (numbers like "1872," are spoken much longer than their letter count).
"""
import json
import os
import re
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(PROJECT, "shorts", "bridge", "audio"))
from dsp import read_wav  # noqa: E402

HOP = 0.01
MIN_PAUSE = 0.15
BLIP = 0.06
PUNCT_BONUS = 0.35
UNMATCHED = 0.9
CAP_FACTOR = 2.5      # max seconds per letter = CAP_FACTOR x median of the recording
CAP_MIN = 0.12        # never cap below this


def pauses_from_audio(x, sr):
    h = int(sr * HOP)
    env = 20 * np.log10(np.sqrt((x[: len(x) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-9)
    floor, loud = np.percentile(env, 5), np.percentile(env, 95)
    thr = max(floor + 20.0, loud - 45.0)
    quiet = env < thr
    i = 0
    while i < len(quiet):                      # tiny blips are not speech
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


def cap_durations(words):
    n = [max(1, sum(c.isalnum() for c in w["w"])) for w in words]
    per = np.median([(w["e"] - w["s"]) / k for w, k in zip(words, n)])
    out, capped = [], []
    for w, k in zip(words, n):
        w = dict(w)
        lim = max(CAP_MIN, k * per * CAP_FACTOR)
        if not re.search(r"\d", w["w"]) and w["e"] - w["s"] > lim:
            capped.append({"w": w["w"], "from_s": round(w["e"] - w["s"], 3), "to_s": round(lim, 3)})
            w["e"] = w["s"] + lim
        out.append(w)
    return out, capped, per


def assign(pauses, words):
    K, J = len(words) - 1, len(pauses)
    g = [(words[k]["e"] + words[k + 1]["s"]) / 2 for k in range(K)]
    bonus = [PUNCT_BONUS if re.search(r"[….?!,:;—]$", words[k]["w"]) else 0.0 for k in range(K)]
    INF = 1e9
    dp = np.full((J + 1, K + 1), INF)
    dp[0, :] = 0.0
    for j in range(1, J + 1):
        dp[j, 0] = dp[j - 1, 0] + UNMATCHED
    back = {}
    for j in range(1, J + 1):
        m = (pauses[j - 1][0] + pauses[j - 1][1]) / 2
        for k in range(1, K + 1):
            opts = [(dp[j, k - 1], "skip_boundary"),
                    (dp[j - 1, k - 1] + abs(m - g[k - 1]) - bonus[k - 1], "take"),
                    (dp[j - 1, k] + UNMATCHED, "drop_pause")]
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
    folder = os.path.abspath(sys.argv[1])
    out = os.path.join(folder, "words_snapped.json")
    if os.path.exists(out):
        sys.exit(f"{out} existiert schon - nichts ueberschrieben.")
    words_in = json.load(open(os.path.join(folder, "words.json"), encoding="utf-8"))
    words, capped, per = cap_durations(words_in)
    x, sr = read_wav(os.path.join(folder, "voice.wav"))
    pauses, first, last, thr = pauses_from_audio(x[0], sr)
    placed, dropped = assign(pauses, words)
    cuts = sorted(placed)
    groups, start = [], 0
    for k in cuts:
        groups.append((start, k))
        start = k + 1
    groups.append((start, len(words) - 1))
    bounds = [first] + [b for k in cuts for b in placed[k]] + [last]
    snapped = []
    for gi, (i0, i1) in enumerate(groups):
        S, E = bounds[2 * gi], bounds[2 * gi + 1]
        v0, v1 = words[i0]["s"], words[i1]["e"]
        n = i1 - i0 + 1
        for i in range(i0, i1 + 1):
            w = words[i]
            if v1 > v0:
                s, e = S + (w["s"] - v0) / (v1 - v0) * (E - S), S + (w["e"] - v0) / (v1 - v0) * (E - S)
            else:
                s, e = S + (i - i0) * (E - S) / n, S + (i - i0 + 1) * (E - S) / n
            snapped.append({"w": w["w"], "s": round(s, 3), "e": round(max(e, s + 0.02), 3)})
    assert [w["w"] for w in snapped] == [w["w"] for w in words_in]
    with open(out, "x", encoding="utf-8") as fh:
        json.dump(snapped, fh, indent=1, ensure_ascii=False)
    report = {"input": "words.json", "threshold_dbfs": round(float(thr), 1), "min_pause_s": MIN_PAUSE,
              "median_s_per_letter": round(float(per), 4), "capped_words": capped,
              "speech_start_s": round(first, 3), "speech_end_s": round(last, 3),
              "pauses": [[round(a, 3), round(b, 3)] for a, b in pauses],
              "pause_after_word": {words[k]["w"] + f" (#{k + 1})": [round(a, 3), round(b, 3)]
                                   for k, (a, b) in sorted(placed.items())},
              "pauses_not_placed": [[round(a, 3), round(b, 3)] for a, b in dropped]}
    json.dump(report, open(os.path.join(folder, "snap_report.json"), "x", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"{os.path.basename(folder)}: {len(snapped)} Woerter | Pausen {len(pauses)} gefunden, {len(placed)} zugeordnet, "
          f"{len(dropped)} nicht zugeordnet | gekappt: {[c['w'] for c in capped]} | Sprache {first:.2f}-{last:.2f} s")


if __name__ == "__main__":
    main()
