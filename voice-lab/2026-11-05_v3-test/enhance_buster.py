"""Clarity/loudness edit of the Buster test take (local, no API, no credits). The original is only read.

    .venv/bin/python -I voice-lab/2026-11-05_v3-test/enhance_buster.py

In : voice/takes/buster_natural/voice.wav (48 kHz mono, unprocessed Buster)
Out: voice/takes/buster_natural/voice_enhanced.wav + enhance_report.json (never overwritten)

Chain (no pitch, formant or tempo processing):
 1. high-pass 70 Hz (2nd order)             - rumble only
 2. +2 dB bell at 3 kHz, Q 1.0              - presence / intelligibility, gentle
 3. de-esser, light                          - keeps the s-sounds from getting sharper after step 2
 4. compressor 2:1 from -28 dBFS, soft knee  - quiet words come up, transients stay natural
 5. gain to -16 LUFS integrated
 6. only if needed: limiter at -1.3 dBFS on 4x oversampled audio -> true peak <= -1 dBTP
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, "voice", "takes", "buster_natural")
SRC, OUT, REP = (os.path.join(T, n) for n in ("voice.wav", "voice_enhanced.wav", "enhance_report.json"))
TARGET_LUFS, TP_MAX = -16.0, -1.0
CHAIN = ",".join([
    "highpass=f=70:poles=2",
    "equalizer=f=3000:t=q:w=1.0:g=2.0",
    "deesser=i=0.2:m=0.5:f=0.5:s=o",
    "acompressor=threshold=0.0398:ratio=2:attack=10:release=120:knee=6:makeup=1",
])
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


def main():
    if os.path.exists(OUT) or os.path.exists(REP):
        sys.exit("voice_enhanced.wav / enhance_report.json existieren schon - nichts ueberschrieben.")
    tmp1, tmp2 = OUT + ".step1.wav", OUT + ".step2.wav"
    ff(["-y", "-i", SRC, "-af", CHAIN, "-ac", "1", "-c:a", "pcm_s24le", tmp1])
    m1 = measure(tmp1)
    gain = TARGET_LUFS - m1["lufs"]
    ff(["-y", "-i", tmp1, "-af", f"volume={gain:.3f}dB", "-ac", "1", "-c:a", "pcm_s24le", tmp2])
    m2 = measure(tmp2)
    limited = m2["true_peak_dbtp"] > TP_MAX
    if limited:
        ff(["-y", "-i", tmp2, "-af", LIMIT, "-ac", "1", "-c:a", "pcm_s24le", "-bitexact", OUT])
    else:
        os.replace(tmp2, OUT)
    for p in (tmp1, tmp2):
        if os.path.exists(p):
            os.remove(p)
    rep = {"source": "voice.wav", "output": "voice_enhanced.wav", "chain": CHAIN, "gain_db": round(gain, 2),
           "limiter": LIMIT if limited else None, "before": measure(SRC), "after_chain": m1,
           "after_gain_before_limiter": m2, "final": measure(OUT)}
    with open(REP, "x", encoding="utf-8") as f:
        json.dump(rep, f, indent=2)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
