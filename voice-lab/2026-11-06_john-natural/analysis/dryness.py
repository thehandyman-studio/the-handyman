"""Reverb INSIDE speech (fills the dips between syllables, smears consonants):
  depth  = median over sentences of (p90 - p10) of the 10 ms envelope inside speech (dB; higher = drier, crisper)
  flux   = mean positive spectral change between 10 ms frames (higher = sharper onsets/consonants)
  lowmid = share of energy 200-500 Hz vs 100-8000 Hz (dB; boxy/roomy colour)
  air    = share 4-8 kHz (dB; presence/clarity)"""
import json, sys, subprocess, numpy as np
def load(p, sr=48000):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32), sr
def run(p, words, scale):
    x, sr = load(p); W = json.load(open(words)); h = int(0.01 * sr); n = 2048
    fr = np.lib.stride_tricks.sliding_window_view(x, n)[::h] * np.hanning(n)
    S = np.abs(np.fft.rfft(fr, axis=1)) ** 2; f = np.fft.rfftfreq(n, 1 / sr)
    env = 10 * np.log10(S[:, (f > 100) & (f < 8000)].sum(1) + 1e-12)
    band = lambda a, b: S[:, (f > a) & (f < b)].sum(1)
    sp = np.zeros(len(env), bool)
    for w in W: sp[int(w["s"] * scale / 0.01):int(w["e"] * scale / 0.01)] = True
    depth = []; a = 0
    for i, w in enumerate(W):
        if w["w"].rstrip('"').endswith((".", "?", "!", ":")):
            seg = env[int(W[a]["s"] * scale / 0.01):int(w["e"] * scale / 0.01)]
            if len(seg) > 20: depth.append(np.percentile(seg, 90) - np.percentile(seg, 10))
            a = i + 1
    L = np.log(S[:, (f > 100) & (f < 8000)] + 1e-12); flux = np.maximum(np.diff(L, axis=0), 0).mean(1)[sp[1:]].mean()
    tot = band(100, 8000)[sp].sum()
    return {"file": p.split("/")[-1], "depth_dB": round(float(np.median(depth)), 2), "flux": round(float(flux), 3),
            "lowmid_dB": round(float(10 * np.log10(band(200, 500)[sp].sum() / tot)), 2), "air_dB": round(float(10 * np.log10(band(4000, 8000)[sp].sum() / tot)), 2)}
for a in sys.argv[1:]:
    p, w, s = a.split("::"); print(json.dumps(run(p, w, float(s))))
