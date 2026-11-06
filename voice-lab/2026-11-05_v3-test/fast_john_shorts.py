"""Faster Shorts version of the john_shorts_fast take (local, no API, no credits). Originals are only read.

    .venv/bin/python -I voice-lab/2026-11-05_v3-test/fast_john_shorts.py

In : voice/takes/john_shorts_fast/voice.wav + words_snapped.json + snap_report.json
Out: voice/takes/john_shorts_fast/voice_shorts_fast.wav + words_shorts_fast.json + shorts_fast_report.json

 1. every measured pause longer than MAX_PAUSE is shortened to MAX_PAUSE (cut in the middle of the silence,
    10 ms fades) - speech itself is not touched: no time stretch, no pitch, no formants
 2. word times moved by the same cuts (exact), result validated against narration.txt
 3. same Shorts chain as enhance_john_shorts.py: -24 LUFS pre-level, high-pass 70 Hz, +1.5 dB @ 3 kHz, de-esser 0.35,
    compressor 2:1 from -28 dBFS (soft), gain to -15 LUFS, limiter only if true peak > -1 dBTP
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(PROJECT, "scripts", "voice"))
from timing import read_wav_mono, validate_words  # noqa: E402

T = os.path.join(HERE, "voice", "takes", "john_shorts_fast")
OUT_WAV, OUT_WORDS, OUT_REP = (os.path.join(T, n) for n in
                               ("voice_shorts_fast.wav", "words_shorts_fast.json", "shorts_fast_report.json"))
MAX_PAUSE, FADE = 0.18, 0.010
PRE_LUFS, TARGET_LUFS, TP_MAX = -24.0, -15.0, -1.0
CHAIN = ",".join(["highpass=f=70:poles=2", "equalizer=f=3000:t=q:w=1.0:g=1.5", "deesser=i=0.35:m=0.5:f=0.5:s=o",
                  "acompressor=threshold=0.0398:ratio=2:attack=15:release=150:knee=6:makeup=1"])
LIMIT = "aresample=192000,alimiter=limit=0.861:attack=2:release=60:level=disabled,aresample=48000"


def ff(args):
    r = subprocess.run(["ffmpeg", "-hide_banner"] + args, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(r.stderr[-800:])
    return r.stderr


def measure(path):
    s = ff(["-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"])
    s = s[s.rfind("Summary:"):]
    g = lambda k: float(s.split(k)[1].split()[0])
    return {"lufs": g(" I:"), "lra": g("LRA:"), "true_peak_dbtp": g("Peak:")}


def write_mono(path, x, sr):
    q = np.clip(np.round(x * 8388607.0), -8388608, 8388607).astype("<i4")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(3)
        w.setframerate(sr)
        w.writeframes(q.view(np.uint8).reshape(-1, 4)[:, :3].tobytes())


def main():
    for p in (OUT_WAV, OUT_WORDS, OUT_REP):
        if os.path.exists(p):
            sys.exit(f"{p} existiert schon - nichts ueberschrieben.")
    x, sr = read_wav_mono(os.path.join(T, "voice.wav"))
    words = json.load(open(os.path.join(T, "words_snapped.json"), encoding="utf-8"))
    pauses = json.load(open(os.path.join(T, "snap_report.json"), encoding="utf-8"))["pauses"]
    nf = int(FADE * sr)
    out, cuts, pos = [], [], 0                      # cuts: (time in original, seconds removed)
    for a, b in pauses:
        if b - a <= MAX_PAUSE:
            continue
        keep = MAX_PAUSE / 2
        c0, c1 = int((a + keep) * sr), int((b - keep) * sr)
        left = x[pos:c0].copy()
        left[-nf:] *= np.linspace(1, 0, nf)
        out.append(left)
        cuts.append(((a + b) / 2, (c1 - c0) / sr))
        pos = c1
        x_r = x[pos:pos + nf].copy()
        x[pos:pos + nf] = x_r * np.linspace(0, 1, nf)
    out.append(x[pos:])
    y = np.concatenate(out)

    def shift(t):
        return t - sum(d for c, d in cuts if c < t)
    new_words = [{"w": w["w"], "s": round(shift(w["s"]), 3), "e": round(shift(w["e"]), 3)} for w in words]
    ref = open(os.path.join(HERE, "voice", "narration.txt"), encoding="utf-8").read().split()
    problems = validate_words(new_words, ref, len(y) / sr)
    if problems:
        sys.exit("Pruefung fehlgeschlagen - nichts geschrieben:\n  - " + "\n  - ".join(problems))

    tmp = [OUT_WAV + f".s{i}.wav" for i in range(4)]
    write_mono(tmp[0], y, sr)
    pre = PRE_LUFS - measure(tmp[0])["lufs"]
    ff(["-y", "-i", tmp[0], "-af", f"volume={pre:.3f}dB", "-ac", "1", "-c:a", "pcm_s24le", tmp[1]])
    ff(["-y", "-i", tmp[1], "-af", CHAIN, "-ac", "1", "-c:a", "pcm_s24le", tmp[2]])
    gain = TARGET_LUFS - measure(tmp[2])["lufs"]
    ff(["-y", "-i", tmp[2], "-af", f"volume={gain:.3f}dB", "-ac", "1", "-c:a", "pcm_s24le", tmp[3]])
    m3 = measure(tmp[3])
    if m3["true_peak_dbtp"] > TP_MAX:
        ff(["-y", "-i", tmp[3], "-af", LIMIT, "-ac", "1", "-c:a", "pcm_s24le", "-bitexact", OUT_WAV])
    else:
        os.replace(tmp[3], OUT_WAV)
    for p in tmp:
        if os.path.exists(p):
            os.remove(p)
    with open(OUT_WORDS, "x", encoding="utf-8") as f:
        json.dump(new_words, f, indent=1, ensure_ascii=False)
    rep = {"source": "voice.wav + words_snapped.json", "max_pause_s": MAX_PAUSE,
           "pauses_before_s": [round(b - a, 3) for a, b in pauses],
           "removed_s": round(sum(d for _, d in cuts), 3), "duration_before_s": round(len(x) / sr, 3),
           "duration_after_s": round(len(y) / sr, 3), "chain": CHAIN, "pre_gain_db": round(pre, 2), "gain_db": round(gain, 2),
           "limiter_needed_db": round(max(0.0, m3["true_peak_dbtp"] - TP_MAX), 2),
           "before": measure(os.path.join(T, "voice.wav")), "final": measure(OUT_WAV), "validation_problems": problems}
    with open(OUT_REP, "x", encoding="utf-8") as f:
        json.dump(rep, f, indent=2)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
