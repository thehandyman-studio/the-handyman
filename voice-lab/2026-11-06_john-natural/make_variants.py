"""Free, local listening test (2026-11-06): does our post-processing make John sound smoother/more artificial?
Reads the existing take shorts/city-in-the-wall/voice/takes/john_mrab_v1 (read only) and writes ONLY into out/.
  P1 = same take, same tempo x1.10, same total length, but pauses shortened PROPORTIONALLY (natural variation kept)
       instead of all set to 0.18 s, and a lighter dynamics chain (ratio 1.5, no presence boost, gentler de-esser).
"""
import json, os, sys, subprocess
import numpy as np
R = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, os.path.join(R, "scripts/voice"))
import shorts_master as SM  # noqa: E402  (functions only, nothing is written by importing)
from timing import read_wav_mono  # noqa: E402
T = os.path.join(R, "shorts/city-in-the-wall/voice/takes/john_mrab_v1")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
x, sr = read_wav_mono(os.path.join(T, "voice.wav"))
pauses = json.load(open(os.path.join(T, "snap_report.json")))["pauses"]
long_ = [(a, b) for a, b in pauses if b - a > 0.18]
target_removed = sum((b - a) - 0.18 for a, b in long_)            # = what the current master removed (same length)
tot = sum(b - a for a, b in long_)
k = (tot - target_removed) / tot                                   # keep this share of every pause
nf = int(SM.FADE * sr); y = x.copy(); out, pos = [], 0
for a, b in long_:
    keep = (b - a) * k / 2
    c0, c1 = int((a + keep) * sr), int((b - keep) * sr)
    left = y[pos:c0].copy(); left[-nf:] *= np.linspace(1, 0, nf); out.append(left)
    pos = c1; y[pos:pos + nf] *= np.linspace(0, 1, nf)
out.append(y[pos:]); y = np.concatenate(out)
CHAIN = "highpass=f=70:poles=2,deesser=i=0.2:m=0.5:f=0.5:s=o,acompressor=threshold=0.0398:ratio=1.5:attack=25:release=200:knee=6:makeup=1"
tmp = [os.path.join(OUT, f"_t{i}.wav") for i in range(3)]
SM.write_mono(tmp[0], y, sr)
SM.ff(["-y", "-i", tmp[0], "-af", f"volume={SM.PRE_LUFS - SM.measure(tmp[0])['lufs']:.3f}dB,{CHAIN}", "-c:a", "pcm_s24le", tmp[1]])
SM.ff(["-y", "-i", tmp[1], "-af", f"volume={-15.0 - SM.measure(tmp[1])['lufs']:.3f}dB", "-c:a", "pcm_s24le", tmp[2]])
dst = os.path.join(OUT, "P1_pausen-proportional_leichte-kette.wav")
if SM.measure(tmp[2])["true_peak_dbtp"] > SM.TP_MAX: SM.ff(["-y", "-i", tmp[2], "-af", SM.LIMIT, "-c:a", "pcm_s24le", dst])
else: os.replace(tmp[2], dst)
for p in tmp:
    if os.path.exists(p): os.remove(p)
print(json.dumps({"keep_share": round(k, 3), "pauses_after": [round((b - a) * k, 3) for a, b in long_],
                  "duration_s": round(len(y) / sr, 3), "measure": SM.measure(dst)}))
