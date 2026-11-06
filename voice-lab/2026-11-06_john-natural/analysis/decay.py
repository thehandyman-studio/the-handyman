"""Sentence-end decay: from the last 5 ms envelope peak in the final 250 ms of the sentence, time (ms) until the level is
10, 25 and 40 dB lower. Dry close-mic speech falls fast; a room adds a slow, smooth tail (long 25->40 dB part)."""
import json, sys, subprocess, numpy as np
def load(p, sr=48000):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32), sr
def run(p, words, scale):
    x, sr = load(p); W = json.load(open(words)); h = int(0.005 * sr)
    env = 10 * np.log10(np.convolve(x ** 2, np.ones(h) / h, "same")[::h] + 1e-14)
    res = {10: [], 25: [], 40: []}
    for i, w in enumerate(W[:-1]):
        if not w["w"].rstrip('"').endswith((".", "?", "!", ":", ",", "…")): continue
        e = int(w["e"] * scale / 0.005); nx = int(W[i + 1]["s"] * scale / 0.005)
        if nx - e < 30: continue
        seg = env[e - 50:e]; pk = e - 50 + int(np.argmax(seg)); top = env[pk]
        for d in res:
            k = next((j for j in range(pk, nx) if env[j] < top - d), None)
            if k is not None: res[d].append((k - pk) * 5)
    return {"file": p.split("/")[-1], **{f"to_-{d}dB_ms": round(float(np.median(v)), 0) for d, v in res.items()}, "n": len(res[40])}
for a in sys.argv[1:]:
    p, w, s = a.split("::"); print(json.dumps(run(p, w, float(s))))
