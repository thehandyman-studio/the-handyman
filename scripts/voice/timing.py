"""Word-timing correction + validation for captions (offline, free). Needs numpy (.venv).

Two separate methods - they never write the same file:

  1. from the character alignment (FIRST CHOICE, new ElevenLabs takes)    -> words_snapped.json / snap_report.json
     snap_from_alignment(): word times from letters/digits only (punctuation and audio tags get no time - eleven_v3
     puts pauses on "…" / "."), real pauses measured in the audio, each pause assigned to one word boundary
     (monotonic dynamic programming, boundaries with pause punctuation preferred), the words of each spoken stretch
     spread over the actually spoken time. Tested: voice-lab/2026-11-05_v3-test, voice-lab/2026-11-05_snap-mary-celeste.

  2. from an existing words.json (already edited / cut takes)              -> words_snapped_from_words.json /
     snap_from_words():  same pause detection and assignment; words that are implausibly     snap_report_from_words.json
     long for their letters are capped first (stricter with pause punctuation, numbers never); stretches whose edges
     already fit (<= MISFIT) keep their inner times. Tested: voice-lab/2026-11-05_snap-from-words (run 2).

validate_words() checks missing / extra / duplicate words against a reference text, order, overlaps, empty or
negative durations, times outside the audio and implausibly long words. words.json itself is never changed here.
"""
import difflib
import re
import wave

import numpy as np

HOP = 0.01          # envelope frame (s)
MIN_PAUSE = 0.15    # shorter silences are articulation, not pauses
BLIP = 0.06         # non-silent runs shorter than this count as silence (clicks, fade remnants)
PUNCT_BONUS = 0.35  # pauses are more likely at boundaries with pause punctuation
UNMATCHED = 0.9     # cost of leaving a detected pause unplaced
CAP_FACTOR = 2.5
CAP_FACTOR_PUNCT = 1.3
CAP_MIN = 0.12
MISFIT = 0.15
MAX_WORD_S = 2.5        # validation: longest plausible spoken word without digits
MAX_WORD_DIGITS_S = 4.0  # ... with digits (numbers are spoken long)

_norm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())


# ---------------------------------------------------------------- audio
def read_wav_mono(path):
    """float mono samples (-1..1) and sample rate; 16/24/32-bit PCM, channels averaged."""
    with wave.open(path, "rb") as w:
        n, ch, sw, sr = w.getnframes(), w.getnchannels(), w.getsampwidth(), w.getframerate()
        raw = w.readframes(n)
    if sw == 2:
        x = np.frombuffer(raw, "<i2").astype(np.float64) / 32768.0
    elif sw == 3:
        b = np.frombuffer(raw, np.uint8).reshape(-1, 3).astype(np.int32)
        v = b[:, 0] | (b[:, 1] << 8) | (b[:, 2] << 16)
        x = np.where(v >= 1 << 23, v - (1 << 24), v).astype(np.float64) / float(1 << 23)
    elif sw == 4:
        x = np.frombuffer(raw, "<i4").astype(np.float64) / float(1 << 31)
    else:
        raise ValueError(f"unsupported sample width {sw}")
    return x.reshape(-1, ch).mean(1), sr


def pauses_from_audio(x, sr):
    """(inner pauses [(start, end)], speech start, speech end, threshold dBFS)."""
    h = int(sr * HOP)
    env = 20 * np.log10(np.sqrt((x[: len(x) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-9)
    floor, loud = np.percentile(env, 5), np.percentile(env, 95)
    thr = max(floor + 20.0, loud - 45.0)
    quiet = env < thr
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
    if not len(speech):
        raise ValueError("keine Sprache im Audio gefunden")
    first, last = speech[0] * HOP, (speech[-1] + 1) * HOP
    inner = [(a, b) for a, b in runs if b - a >= MIN_PAUSE and a > first and b < last]
    return inner, first, last, float(thr)


# ---------------------------------------------------------------- shared assignment
def assign(pauses, words):
    """Monotonic DP: each pause -> one distinct boundary k (between word k and k+1) or left unplaced."""
    K, J = len(words) - 1, len(pauses)
    g = [(words[k]["e"] + words[k + 1]["s"]) / 2 for k in range(K)]
    bonus = [PUNCT_BONUS if re.search(r"[….?!,:;—]$", words[k]["w"]) else 0.0 for k in range(K)]
    dp = np.full((J + 1, K + 1), 1e9)
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


def _groups(placed, n_words, first, last):
    cuts = sorted(placed)
    groups, start = [], 0
    for k in cuts:
        groups.append((start, k))
        start = k + 1
    groups.append((start, n_words - 1))
    bounds = [first] + [b for k in cuts for b in placed[k]] + [last]
    return [(i0, i1, bounds[2 * gi], bounds[2 * gi + 1]) for gi, (i0, i1) in enumerate(groups)]


def _report(method, words, placed, dropped, pauses, first, last, thr, extra=None):
    r = {"method": method, "threshold_dbfs": round(thr, 1), "min_pause_s": MIN_PAUSE,
         "speech_start_s": round(first, 3), "speech_end_s": round(last, 3),
         "pauses": [[round(a, 3), round(b, 3)] for a, b in pauses],
         "pause_after_word": {words[k]["w"] + f" (#{k + 1})": [round(a, 3), round(b, 3)]
                              for k, (a, b) in sorted(placed.items())},
         "pauses_not_placed": [[round(a, 3), round(b, 3)] for a, b in dropped]}
    r.update(extra or {})
    return r


# ---------------------------------------------------------------- method 1: character alignment
def alnum_only(al):
    """Copy of an alignment where every non-letter/digit character has zero duration (at the previous letter's end)."""
    ch, s, e = al["characters"], list(al["character_start_times_seconds"]), list(al["character_end_times_seconds"])
    last = s[0] if s else 0.0
    for i, c in enumerate(ch):
        if c.isalnum():
            last = e[i]
        else:
            s[i] = e[i] = last
    return {"characters": ch, "character_start_times_seconds": s, "character_end_times_seconds": e}


def snap_from_alignment(words_v3, x, sr):
    """words_v3 = caption words built from alnum_only(alignment) (same tokens as words.json). Returns (words, report)."""
    pauses, first, last, thr = pauses_from_audio(x, sr)
    placed, dropped = assign(pauses, words_v3)
    out = []
    for i0, i1, S, E in _groups(placed, len(words_v3), first, last):
        v0, v1 = words_v3[i0]["s"], words_v3[i1]["e"]
        n = i1 - i0 + 1
        for i in range(i0, i1 + 1):
            w = words_v3[i]
            if v1 > v0:
                s, e = S + (w["s"] - v0) / (v1 - v0) * (E - S), S + (w["e"] - v0) / (v1 - v0) * (E - S)
            else:
                s, e = S + (i - i0) * (E - S) / n, S + (i - i0 + 1) * (E - S) / n
            out.append({"w": w["w"], "s": round(s, 3), "e": round(max(e, s + 0.02), 3)})
    return out, _report("alignment", words_v3, placed, dropped, pauses, first, last, thr)


# ---------------------------------------------------------------- method 2: existing words.json
def cap_durations(words):
    n = [max(1, sum(c.isalnum() for c in w["w"])) for w in words]
    per = float(np.median([(w["e"] - w["s"]) / k for w, k in zip(words, n)]))
    out, capped = [], []
    for w, k in zip(words, n):
        w = dict(w)
        fac = CAP_FACTOR_PUNCT if re.search(r"[….?!]$", w["w"]) else CAP_FACTOR
        lim = max(CAP_MIN, k * per * fac)
        if not re.search(r"\d", w["w"]) and w["e"] - w["s"] > lim:
            capped.append({"w": w["w"], "from_s": round(w["e"] - w["s"], 3), "to_s": round(lim, 3)})
            w["e"] = w["s"] + lim
        out.append(w)
    return out, capped, per


def snap_from_words(words_in, x, sr):
    """Correction starting from an existing words list. Returns (words, report)."""
    words, capped, per = cap_durations(words_in)
    pauses, first, last, thr = pauses_from_audio(x, sr)
    placed, dropped = assign(pauses, words)
    out, modes = [], []
    for i0, i1, S, E in _groups(placed, len(words), first, last):
        v0, v1 = words[i0]["s"], words[i1]["e"]
        n = i1 - i0 + 1
        keep = abs(S - v0) <= MISFIT and abs(E - v1) <= MISFIT and v1 > v0
        modes.append("kept" if keep else "spread")
        for i in range(i0, i1 + 1):
            w = words[i]
            if keep:
                s = S if i == i0 else min(max(words_in[i]["s"], S), E)
                e = E if i == i1 else min(max(words_in[i]["e"], S), E)
            elif v1 > v0:
                s, e = S + (w["s"] - v0) / (v1 - v0) * (E - S), S + (w["e"] - v0) / (v1 - v0) * (E - S)
            else:
                s, e = S + (i - i0) * (E - S) / n, S + (i - i0 + 1) * (E - S) / n
            out.append({"w": w["w"], "s": round(s, 3), "e": round(max(e, s + 0.02), 3)})
    for a, b in zip(out, out[1:]):
        if b["s"] < a["e"]:
            a["e"] = b["s"]
        if a["e"] <= a["s"]:
            a["e"] = round(a["s"] + 0.01, 3)
            b["s"] = max(b["s"], a["e"])
    return out, _report("words", words, placed, dropped, pauses, first, last, thr,
                        {"median_s_per_letter": round(per, 4), "capped_words": capped,
                         "stretches": {"kept_inner_times": modes.count("kept"), "re_spread": modes.count("spread")}})


# ---------------------------------------------------------------- validation
def validate_words(words, ref_tokens=None, audio_s=None):
    """List of problems (empty = OK): missing/extra/duplicate words vs the reference, order, overlaps,
    empty or negative durations, times outside the audio, implausibly long words."""
    p = []
    if not words:
        return ["keine Woerter"]
    if ref_tokens is not None:
        a, b = [_norm(w["w"]) for w in words], [_norm(t) for t in ref_tokens]
        if a != b:
            for op, i1, i2, j1, j2 in difflib.SequenceMatcher(a=b, b=a, autojunk=False).get_opcodes():
                if op == "delete":
                    p.append(f"fehlt: {' '.join(ref_tokens[i1:i2])} (Referenz-Wort {i1 + 1})")
                elif op == "insert":
                    p.append(f"zusaetzlich/doppelt: {' '.join(w['w'] for w in words[j1:j2])} (Wort {j1 + 1})")
                elif op == "replace":
                    p.append(f"abweichend: '{' '.join(w['w'] for w in words[j1:j2])}' statt "
                             f"'{' '.join(ref_tokens[i1:i2])}' (Wort {j1 + 1})")
    for i, w in enumerate(words):
        if w["s"] < 0:
            p.append(f"negative Zeit: {w['w']} (#{i + 1}) {w['s']}")
        if w["e"] <= w["s"]:
            p.append(f"leere/negative Dauer: {w['w']} (#{i + 1}) {w['s']}-{w['e']}")
        lim = MAX_WORD_DIGITS_S if re.search(r"\d", w["w"]) else MAX_WORD_S
        if w["e"] - w["s"] > lim:
            p.append(f"unplausibel lang: {w['w']} (#{i + 1}) {w['e'] - w['s']:.2f} s")
        if audio_s is not None and w["e"] > audio_s + 0.05:
            p.append(f"nach Audio-Ende: {w['w']} (#{i + 1}) endet {w['e']} s, Audio {audio_s:.2f} s")
    for i, (a, b) in enumerate(zip(words, words[1:])):
        if b["s"] < a["s"]:
            p.append(f"Reihenfolge: {b['w']} (#{i + 2}) beginnt vor {a['w']} (#{i + 1})")
        elif b["s"] < a["e"] - 1e-6:
            p.append(f"Ueberlappung: {a['w']} (#{i + 1}) endet {a['e']} > {b['w']} (#{i + 2}) beginnt {b['s']}")
    return p


def silence_inside_words(words, x, sr, thr):
    """Seconds during which a word is 'running' while the audio is silent (quality figure for reports)."""
    h = int(sr * HOP)
    env = 20 * np.log10(np.sqrt((x[: len(x) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-9)
    sil = env < thr
    f = lambda t: int(round(t / HOP))
    return round(float(sum(sil[f(w["s"]):f(w["e"])].sum() * HOP for w in words)), 3)
