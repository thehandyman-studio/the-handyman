"""Free, local listening test 2 (2026-11-06): dry, close studio voice + natural rhythm, SAME tempo x1.10 and SAME
pause layout for every variant (the P1 proportional pauses). Reads the existing take (read only), writes only to out/v2/.
  V1  P1 as before: Rubber Band R3 (-3 -F), light chain
  V2  Rubber Band R2 'crisp' (-2 -F -c 6): word ends decay like the raw voice (R3 smears them = adds 'room')
  V3  ffmpeg atempo (WSOLA) instead of Rubber Band
  V4  V2 + 'dry' treatment, gentle: expander (-30 dBFS at -24 LUFS, max -12 dB) on tails BEFORE the compressor, -2 dB at 300 Hz (boxy room
      colour), +1 dB at 4.5 kHz (presence, not dull), compressor 1.5:1
  V5  V4 a bit stronger: expander threshold -27 dBFS, max -18 dB, -3 dB at 300 Hz"""
import json, os, sys, subprocess
import numpy as np
R = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, os.path.join(R, "scripts/voice"))
import shorts_master as SM  # noqa: E402
from timing import read_wav_mono  # noqa: E402
T = os.path.join(R, "shorts/city-in-the-wall/voice/takes/john_mrab_v1")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out", "v2"); os.makedirs(OUT, exist_ok=True)
TMP = os.path.join(OUT, "_tmp"); os.makedirs(TMP, exist_ok=True)
pauses = json.load(open(os.path.join(T, "snap_report.json")))["pauses"]
words = json.load(open(os.path.join(T, "words_snapped.json")))
long_ = [(a, b) for a, b in pauses if b - a > 0.18]
tot = sum(b - a for a, b in long_); k = (tot - sum((b - a) - 0.18 for a, b in long_)) / tot
raw48 = os.path.join(TMP, "raw48.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(T, "raw/elevenlabs.mp3"), "-ar", "48000", "-ac", "1", raw48], check=True)
dur = 48.654542  # length of the take's voice.wav (tempo x1.10): every stretch is trimmed/padded to it
def stretch(kind):
    o = os.path.join(TMP, kind + ".wav")
    if kind == "rb3": subprocess.run(["rubberband", "-q", "-3", "-F", "-T", "1.1", raw48, o], check=True)
    if kind == "rb2": subprocess.run(["rubberband", "-q", "-2", "-F", "-c", "6", "-T", "1.1", raw48, o], check=True)
    if kind == "atempo": subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw48, "-af", f"atempo=1.1,apad,atrim=0:{dur}", o], check=True)
    return o
def cut(x, sr):
    nf = int(SM.FADE * sr); y = x.copy(); out, pos, cuts = [], 0, []
    for a, b in long_:
        keep = (b - a) * k / 2; c0, c1 = int((a + keep) * sr), int((b - keep) * sr)
        left = y[pos:c0].copy(); left[-nf:] *= np.linspace(1, 0, nf); out.append(left)
        cuts.append(((a + b) / 2, (c1 - c0) / sr)); pos = c1; y[pos:pos + nf] *= np.linspace(0, 1, nf)
    out.append(y[pos:]); return np.concatenate(out), cuts
LIGHT = "highpass=f=70:poles=2,deesser=i=0.2:m=0.5:f=0.5:s=o,acompressor=threshold=0.0398:ratio=1.5:attack=25:release=200:knee=6:makeup=1"
DRY = lambda th, rng, low: ("highpass=f=70:poles=2,"
    f"agate=threshold={th}:ratio=2.5:range={rng}:attack=4:release=60:knee=3:detection=rms,"
    f"equalizer=f=300:t=q:w=1.2:g={low},equalizer=f=4500:t=q:w=1.5:g=1,"
    "deesser=i=0.2:m=0.5:f=0.5:s=o,acompressor=threshold=0.0398:ratio=1.5:attack=25:release=200:knee=6:makeup=1")
V = {"V1_P1_RubberbandR3": ("rb3", LIGHT), "V2_RubberbandR2-crisp": ("rb2", LIGHT), "V3_atempo": ("atempo", LIGHT),
     "V4_R2-crisp_trocken-sanft": ("rb2", DRY(0.03, 0.25, -2)), "V5_R2-crisp_trocken-mittel": ("rb2", DRY(0.045, 0.125, -3))}
rep = {}; srcs = {}
for name, (kind, chain) in V.items():
    if kind not in srcs: srcs[kind] = stretch(kind)
    x, sr = read_wav_mono(srcs[kind]); x = x[:int(dur * sr)]
    y, cuts = cut(x, sr)
    t0, t1, t2 = (os.path.join(TMP, f"{name}_{i}.wav") for i in range(3))
    SM.write_mono(t0, y, sr)
    SM.ff(["-y", "-i", t0, "-af", f"volume={SM.PRE_LUFS - SM.measure(t0)['lufs']:.3f}dB,{chain}", "-c:a", "pcm_s24le", t1])
    SM.ff(["-y", "-i", t1, "-af", f"volume={-15.0 - SM.measure(t1)['lufs']:.3f}dB", "-c:a", "pcm_s24le", t2])
    dst = os.path.join(OUT, name + ".wav")
    if SM.measure(t2)["true_peak_dbtp"] > SM.TP_MAX: SM.ff(["-y", "-i", t2, "-af", SM.LIMIT, "-c:a", "pcm_s24le", dst])
    else: os.replace(t2, dst)
    rep[name] = {"duration_s": round(len(y) / sr, 3), **SM.measure(dst)}
shift = lambda t: t - sum(d for c, d in cuts if c < t)
json.dump([{"w": w["w"], "s": round(shift(w["s"]), 3), "e": round(shift(w["e"]), 3)} for w in words],
          open(os.path.join(OUT, "words_P1-pausen.json"), "w"), indent=1, ensure_ascii=False)
json.dump(rep, open(os.path.join(OUT, "report.json"), "w"), indent=1)
print(json.dumps(rep, indent=1))
