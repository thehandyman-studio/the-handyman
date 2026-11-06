"""Reusable sound for a mystery short: original synthesized score + ambience + SFX + mix (local, free).

    .venv/bin/python scripts/audio/shortmix.py shorts/<name>

Reads  shorts/<name>/story.json (scenes with ambience, music sections, events - all timed by WORDS of the voice take)
       + the voice master and its word timings named there.
Writes shorts/<name>/audio/mix.wav (48 kHz stereo 24-bit, exact video length) + stem_voice/music/amb/sfx.wav + mix_report.json

Levels: voice stays as mastered (-15 LUFS); music and ambience are ducked under speech (keyed by the word timings);
master to -14 LUFS integrated, true peak <= -1 dBTP (4x oversampled limiter via ffmpeg).
"""
import json
import math
import os
import re
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import (SR, TAU, ns, rng, lp, hp, bp, colored, smooth_noise, ramp, fades, st, place, widen, make_ir,  # noqa: E402
                 convolve_st, integrated, true_peak, read_wav, write_wav, dbg)
from instruments import pad, timpani, cymbal, pluck, musicbox  # noqa: E402
from sfx_gen import whoosh, creak, breeze, flag_flutter, water_bed  # noqa: E402

FPS = 30
BPM = 84.0
BEAT = 60.0 / BPM


# ---------------------------------------------------------------- timeline (same rules as src/engine/timeline.ts)
def norm(t):
    return re.sub(r"[^a-z0-9]", "", t.lower())


class TL:
    def __init__(self, words, tail):
        self.w = words
        self.total_f = math.ceil((words[-1]["e"] + tail) * FPS)
        self.dur = self.total_f / FPS

    def idx(self, phrase, nth=0):
        p = [norm(x) for x in phrase.split()]
        hit = 0
        for i in range(len(self.w) - len(p) + 1):
            if all(norm(self.w[i + k]["w"]) == q for k, q in enumerate(p)):
                if hit == nth:
                    return i
                hit += 1
        raise SystemExit(f"story.json: phrase '{phrase}' #{nth} not in the word timings")

    def at(self, phrase, nth=0):  # seconds
        return round(self.w[self.idx(phrase, nth)]["s"] * FPS) / FPS

    def cut(self, phrase):  # scene start (2 frames before the word, like the picture)
        return max(0, round(self.w[self.idx(phrase)]["s"] * FPS) - 2) / FPS


# ---------------------------------------------------------------- music
def m(f, k):  # f * 2^(k/12)
    return f * 2 ** (k / 12)


def chord(root, kind):
    iv = {"min": [0, 3, 7], "maj": [0, 4, 7], "sus": [0, 5, 7], "min7": [0, 3, 7, 10]}[kind]
    return [m(root, i) for i in iv]


def score(tl, story, r):
    """continuous score: sections by mood, 2-bar chord cycle Dm - Bb - Gm - A(sus)"""
    D2 = story["music"]["key_hz"]  # 73.42 = D2
    n = ns(tl.dur + 3)
    out = np.zeros((2, n))
    secs = []
    for s in story["music"]["sections"]:
        secs.append((0.0 if s["from"] is None else tl.at(s["from"]), s["mood"]))
    secs.append((tl.dur + 3, None))
    prog = [(m(D2, 12), "min"), (m(D2, 8), "maj"), (m(D2, 5), "min"), (m(D2, 7), "sus")]  # D3, Bb2, G2, A2
    bar = 4 * BEAT
    for (t0, mood), (t1, _) in zip(secs, secs[1:]):
        L = t1 - t0
        seg = np.zeros((2, ns(L + 2.5)))
        if mood == "dropout":
            drone = np.sin(TAU * D2 / 2 * np.arange(seg.shape[1]) / SR) * 0.05
            seg += st(lp(drone, 200))
        else:
            # drone under everything
            tt_ = np.arange(seg.shape[1]) / SR
            drone = (np.sin(TAU * D2 / 2 * tt_) + 0.5 * np.sin(TAU * D2 * tt_ + 0.4)) * (0.11 if mood != "memory" else 0.06)
            seg += st(lp(drone * (0.8 + 0.2 * smooth_noise(len(drone), r, 0.1)), 300))
            k = 0
            for tb in np.arange(0, L, 2 * bar):
                root, kind = prog[k % 4] if mood != "memory" else [(m(D2, 15), "maj"), (m(D2, 10), "maj"), (m(D2, 12), "min"), (m(D2, 7), "maj")][k % 4]
                if mood in ("hit_hold", "finale") and k >= 1:
                    root, kind = (m(D2, 8), "maj") if mood == "hit_hold" else (m(D2, 7), "sus")
                vel = {"dark_pulse": 0.22, "memory": 0.2, "tension": 0.26, "swell": 0.24 + 0.08 * min(1, tb / max(L, 1)),
                       "hit_hold": 0.28, "finale": 0.25}[mood]
                p = pad(chord(root, kind), min(2 * bar, L - tb + 1.5), vel, r, att=0.9, rel=1.6, warm=700 if mood != "memory" else 1100, detune=9)
                place(seg, p, tb)
                k += 1
            # pulse (low heartbeat timpani), ostinato, music box
            if mood in ("dark_pulse", "tension", "swell"):
                step = BEAT if mood != "swell" else BEAT / 2
                for i, tb in enumerate(np.arange(0, L, step)):
                    if mood == "dark_pulse" and i % 2:
                        continue
                    v = 0.3 + (0.25 * tb / max(L, 1) if mood == "swell" else 0.1 * (i % 4 == 0))
                    place(seg, st(timpani(D2 * 0.75, v, r, 1.4)), tb)
            if mood == "tension":
                notes = [0, 7, 3, 7, 12, 7, 3, 7]
                for i, tb in enumerate(np.arange(0, L, BEAT / 2)):
                    place(seg, widen(pluck(m(D2, 12 + notes[i % 8]), 0.32, r, 0.6, 0.45), r, 8, 0.4), tb)
            if mood == "memory":
                mel = [9, 5, 2, 4, 5, 9, 7, 5, 4, 2]
                for i, tb in enumerate(np.arange(0.2, L, BEAT)):
                    place(seg, st(musicbox(m(D2, 24 + mel[i % len(mel)]), 0.5, r, 1.8)), tb)
            if mood == "swell":
                sw = np.zeros(seg.shape[1])
                cy = cymbal(0.5, r, 4.0)[::-1]
                place(seg, st(cy), max(0, L - len(cy) / SR))
                del sw
            if mood == "hit_hold":
                place(seg, st(timpani(D2 * 0.75, 1.0, r, 3.0)), 0)
                place(seg, st(cymbal(0.55, r, 3.0)), 0)
        # section crossfade: 0.25 s in, 1.5 s release tail
        nI = ns(0.25)
        seg[:, :nI] *= ramp(nI)
        place(out, seg, t0)
    ir = make_ir(2.4, 7, hf=1.4)
    wet = convolve_st(out, ir)[:, :n]
    return (out * 0.8 + wet * 0.35)[:, : ns(tl.dur)]


# ---------------------------------------------------------------- ambience
def amb_bed(kind, dur, r):
    n = ns(dur)
    t = np.arange(n) / SR
    if kind in ("sea", "deck", "storm"):
        swell = 0.6 + 0.4 * np.sin(TAU * 0.11 * t + r.uniform(0, TAU)) * smooth_noise(n, r, 0.2)
        surf = lp(colored(n, r, 1.0), 700) * swell
        y = st(surf) * 0.7 + breeze(dur, r, 1.4 if kind == "storm" else 0.7, 0.25, 1300 if kind == "storm" else 800)
        if kind == "deck":
            for tc in np.arange(r.uniform(0.3, 1.0), dur, r.uniform(1.6, 2.6)):
                place(y, st(creak(0.7, r, 90, 150)), tc, 0.25)
        if kind == "storm":
            y += st(lp(colored(n, r, 1.5), 120)) * 0.8
        return y
    if kind == "harbor":
        y = st(water_bed(dur, r, 0.5, 0.5)) * 0.5 + breeze(dur, r, 0.4, 0.15, 900)
        for tc in np.arange(0.8, dur, 2.3):
            place(y, st(creak(0.6, r, 80, 120)), tc, 0.2)
        return y
    if kind == "interior":
        y = st(lp(colored(n, r, 1.2), 380)) * (0.7 + 0.3 * smooth_noise(n, r, 0.15))
        for tc in np.arange(0.4, dur, 1.4):
            place(y, st(creak(0.9, r, 60, 110)), tc, 0.4)
        return y
    return np.zeros((2, n))


# ---------------------------------------------------------------- sfx
def boom(r, gain=1.0, tail=False):
    d = 4.5 if tail else 2.6
    t = np.arange(ns(d)) / SR
    sub = np.sin(TAU * 41.0 * t - 6.0 * np.exp(-t / 0.08)) * np.exp(-t / (1.2 if tail else 0.7))
    y = st(sub * 0.9 + timpani(55.0, 1.0, r, d) * 0.7)
    y += st(lp(colored(len(t), r, 1.0), 1200) * np.exp(-t / 0.05)) * 0.4
    return convolve_st(y, make_ir(2.0, 3, hf=1.6))[:, : ns(d + 1.5)] * 0.6 * gain


def riser(r, dur):
    t = np.arange(ns(dur)) / SR
    u = t / dur
    y = bp(colored(len(t), r, 0.5), 400, 4000) * u ** 2 * 0.6
    tone = np.sin(TAU * (110 + 330 * u ** 2) * t) * u ** 3 * 0.25
    return widen(fades(y + tone, 0.05, 0.02), r, 10, 0.6)


def thunk(r):
    t = np.arange(ns(0.6)) / SR
    y = sum(a * np.sin(TAU * f * t) * np.exp(-t / tau) for f, a, tau in [(95, 1, 0.12), (190, 0.5, 0.07), (310, 0.3, 0.05)])
    y += lp(colored(len(t), r, 0.5), 900) * np.exp(-t / 0.01) * 0.5
    return st(fades(y, 0.001, 0.05)) * 0.6


# ---------------------------------------------------------------- mix
def speech_env(words, n, pre=0.08, post=0.25, merge=0.35, att=0.06, rel=0.5):
    spans = []
    for w in words:
        if spans and w["s"] - spans[-1][1] < merge:
            spans[-1][1] = max(spans[-1][1], w["e"])
        else:
            spans.append([w["s"], w["e"]])
    ctrl = 1000
    nc = int(n / SR * ctrl) + 2
    va = np.zeros(nc)
    for s, e in spans:
        va[max(0, int((s - pre) * ctrl)): int((e + post) * ctrl)] = 1.0
    env = np.zeros(nc)
    e = 0.0
    ka, kr = 1 - np.exp(-1 / (att * ctrl)), 1 - np.exp(-1 / (rel * ctrl))
    for i in range(nc):
        e += (va[i] - e) * (ka if va[i] > e else kr)
        env[i] = e
    return np.interp(np.arange(n) / SR, np.arange(nc) / ctrl, env)


def lufs(x):
    v = integrated(x)
    return v if np.isfinite(v) else -99.0


def to_lufs(x, target):
    return x * dbg(target - lufs(x))


def main():
    sdir = os.path.abspath(sys.argv[1])
    story = json.load(open(os.path.join(sdir, "story.json"), encoding="utf-8"))
    words = json.load(open(os.path.join(sdir, story["words"]), encoding="utf-8"))
    tl = TL(words, story.get("tail_s", 1.0))
    n = ns(tl.dur)
    r = rng(11)
    out_dir = os.path.join(sdir, "audio")
    os.makedirs(out_dir, exist_ok=True)

    v, sr = read_wav(os.path.join(sdir, story["voice"]))
    assert sr == SR, sr
    voice = np.zeros((2, n))
    vv = st(v[0] if v.shape[0] == 1 else v.mean(0))
    voice[:, : min(n, vv.shape[1])] = vv[:, :n]

    music = score(tl, story, r)
    music = np.pad(music, ((0, 0), (0, max(0, n - music.shape[1]))))[:, :n]

    # ambience: one bed per scene, 0.35 s crossfades
    amb = np.zeros((2, n))
    sc = story["scenes"]
    starts = [0.0 if s["start"] is None else tl.cut(s["start"]) for s in sc] + [tl.dur]
    xf = 0.35
    for i, s in enumerate(sc):
        a, b = starts[i], starts[i + 1]
        bed = amb_bed(s["amb"], b - a + xf * 2, rng(100 + i))
        k = ns(xf)
        bed[:, :k] *= ramp(k)
        bed[:, -k:] *= ramp(k)[::-1]
        place(amb, bed, max(0, a - xf))

    sfx = np.zeros((2, n))
    log = []
    for ev in story["events"]:
        typ = ev["type"]
        if typ == "riser":
            t1 = tl.at(ev["to"], ev.get("nth", 0))
            x = riser(r, ev.get("dur", 1.0))
            place(sfx, x, t1 - x.shape[1] / SR, 0.6)
            log.append((typ, ev["to"], round(t1, 2)))
            continue
        t = tl.at(ev["at"], ev.get("nth", 0))
        if typ == "whoosh":
            x = st(whoosh(0.7, r, 0.55, 300, 2600)); place(sfx, x, t - 0.38, 0.5)
        elif typ == "boom":
            place(sfx, boom(r, ev.get("gain", 1.0), ev.get("tail", False)), t - 0.02)
        elif typ == "creak":
            place(sfx, st(creak(1.0, r, 70, 130)), t, 0.6)
        elif typ == "flap":
            place(sfx, st(flag_flutter(ev.get("dur", 1.2), r)), t - 0.2, 0.6)
        elif typ == "thunk":
            place(sfx, thunk(r), t, 0.8)
        log.append((typ, ev.get("at"), round(t, 2)))

    # "silence": ambience and music drop away from the word "silence" until the next scene, then come back
    if any(s["mood"] == "dropout" for s in story["music"]["sections"]):
        t_sil = tl.at("silence")
        t_back = next(starts[i] for i in range(len(sc)) if starts[i] > t_sil)
        g = np.ones(n)
        a, b = ns(t_sil), ns(t_back)
        g[a:b] = np.interp(np.arange(a, b), [a, a + ns(0.4), b - ns(0.3), b], [1, 0.25, 0.25, 1])
        amb *= g

    # levels, ducking under speech, master
    duck = speech_env(words, n)
    music = to_lufs(music, -18.5) * dbg(-7.0 * duck)
    amb = to_lufs(amb, -26.0) * dbg(-5.0 * duck)
    sfx = to_lufs(sfx, -26.0) if np.abs(sfx).max() > 0 else sfx
    fade = np.ones(n)
    k = ns(0.8)
    fade[-k:] = ramp(k)[::-1]
    music *= fade; amb *= fade
    mix = voice + music + amb + sfx
    g = dbg(-14.0 - lufs(mix))
    mix *= g
    for x, name in ((voice * g, "voice"), (music * g, "music"), (amb * g, "amb"), (sfx * g, "sfx")):
        write_wav(os.path.join(out_dir, f"stem_{name}.wav"), x)
    pre = os.path.join(out_dir, "mix_prelimit.wav")
    write_wav(pre, mix)
    final = os.path.join(out_dir, "mix.wav")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", pre, "-af",
                    "aresample=192000,alimiter=limit=0.861:attack=2:release=60:level=disabled,aresample=48000",
                    "-c:a", "pcm_s24le", "-ac", "2", final], check=True)
    os.remove(pre)
    fx, _ = read_wav(final)
    fx = fx[:, :n] if fx.shape[1] >= n else np.pad(fx, ((0, 0), (0, n - fx.shape[1])))
    write_wav(final, fx)
    rep = {"duration_s": round(n / SR, 3), "frames": tl.total_f, "lufs": round(lufs(fx), 2), "true_peak_dbtp": round(float(true_peak(fx)), 2),
           "voice_lufs_in_mix": round(lufs(voice * g), 2), "music_lufs": round(lufs(music * g), 2), "amb_lufs": round(lufs(amb * g), 2),
           "sfx_lufs": round(lufs(sfx * g), 2), "events": log, "scene_starts_s": [round(x, 3) for x in starts[:-1]]}
    json.dump(rep, open(os.path.join(out_dir, "mix_report.json"), "w"), indent=2)
    print(json.dumps({k: rep[k] for k in rep if k != "events"}, indent=1))


if __name__ == "__main__":
    main()
