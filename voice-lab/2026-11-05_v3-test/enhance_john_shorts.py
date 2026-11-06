"""Shorts loudness/clarity edit of the John Shorts test take (local, no API, no credits). The original is only read.

    .venv/bin/python -I voice-lab/2026-11-05_v3-test/enhance_john_shorts.py

In : voice/takes/john_shorts_test/voice.wav (48 kHz mono, unprocessed)
Out: voice/takes/john_shorts_test/voice_shorts.wav + shorts_report.json (never overwritten)

Chain (no pitch, formant or tempo processing; no heavy compression):
 0. level to -24 LUFS first, so the compressor threshold means the same for every recording
 1. high-pass 70 Hz (2nd order)                - rumble only
 2. +1.5 dB bell at 3 kHz, Q 1.0               - presence, gentle
 3. de-esser 0.35                              - a bit stronger than in the Buster test (s-sounds rose there)
 4. compressor 2:1 from -28 dBFS, soft knee    - light; attack 15 ms keeps consonant punch
 5. gain to -15 LUFS integrated (target range -14 ... -16)
 6. only if needed: limiter at -1.3 dBFS on 4x oversampled audio -> true peak <= -1 dBTP
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, "voice", "takes", "john_shorts_test")
SRC, OUT, REP = (os.path.join(T, n) for n in ("voice.wav", "voice_shorts.wav", "shorts_report.json"))
PRE_LUFS, TARGET_LUFS, TP_MAX = -24.0, -15.0, -1.0
CHAIN = ",".join([
    "highpass=f=70:poles=2",
    "equalizer=f=3000:t=q:w=1.0:g=1.5",
    "deesser=i=0.35:m=0.5:f=0.5:s=o",
    "acompressor=threshold=0.0398:ratio=2:attack=15:release=150:knee=6:makeup=1",
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
        sys.exit("voice_shorts.wav / shorts_report.json existieren schon - nichts ueberschrieben.")
    tmp = [OUT + f".step{i}.wav" for i in (0, 1, 2)]
    m_src = measure(SRC)
    pre = PRE_LUFS - m_src["lufs"]
    ff(["-y", "-i", SRC, "-af", f"volume={pre:.3f}dB", "-ac", "1", "-c:a", "pcm_s24le", tmp[0]])
    m0 = measure(tmp[0])
    ff(["-y", "-i", tmp[0], "-af", CHAIN, "-ac", "1", "-c:a", "pcm_s24le", tmp[1]])
    m1 = measure(tmp[1])
    gain = TARGET_LUFS - m1["lufs"]
    ff(["-y", "-i", tmp[1], "-af", f"volume={gain:.3f}dB", "-ac", "1", "-c:a", "pcm_s24le", tmp[2]])
    m2 = measure(tmp[2])
    limited = m2["true_peak_dbtp"] > TP_MAX
    if limited:
        ff(["-y", "-i", tmp[2], "-af", LIMIT, "-ac", "1", "-c:a", "pcm_s24le", "-bitexact", OUT])
    else:
        os.replace(tmp[2], OUT)
    for p in tmp:
        if os.path.exists(p):
            os.remove(p)
    rep = {"source": "voice.wav", "output": "voice_shorts.wav", "pre_gain_db": round(pre, 2), "chain": CHAIN,
           "level_change_by_chain_lu": round(m1["lufs"] - m0["lufs"], 2), "gain_db": round(gain, 2),
           "limiter": LIMIT if limited else None, "limiter_needed_db": round(max(0.0, m2["true_peak_dbtp"] - TP_MAX), 2),
           "before": m_src, "final": measure(OUT)}
    with open(REP, "x", encoding="utf-8") as f:
        json.dump(rep, f, indent=2)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
