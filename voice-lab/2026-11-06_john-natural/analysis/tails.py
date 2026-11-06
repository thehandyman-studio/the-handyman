"""Where does the 'room' come from? Measures, at every pause after a word (gap >= 0.2 s in that file's timeline):
  tail  = level 30-130 ms after the word end, relative to the last 100 ms of the word (dB; higher = more decay/reverb)
  floor = level in the middle of the pause (dBFS)
  t20   = time until the level has dropped 20 dB below the word's last 100 ms (ms; longer = more reverb)"""
import json, sys, subprocess, numpy as np
def load(p, sr=48000):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32), sr
def db(x): return 10 * np.log10(np.mean(x ** 2) + 1e-12)
def run(path, words, scale=1.0):
    x, sr = load(path); W = json.load(open(words)); tails, floors, t20 = [], [], []
    for i in range(len(W) - 1):
        e, n = W[i]["e"] * scale, W[i + 1]["s"] * scale
        if n - e < 0.2: continue
        ref = db(x[int((e - 0.1) * sr):int(e * sr)])
        tails.append(db(x[int((e + 0.03) * sr):int((e + 0.13) * sr)]) - ref)
        floors.append(db(x[int(((e + n) / 2 - 0.03) * sr):int(((e + n) / 2 + 0.03) * sr)]))
        env = [db(x[int((e + k * 0.005) * sr):int((e + k * 0.005 + 0.01) * sr)]) for k in range(int((n - e) / 0.005) - 2)]
        hit = next((k for k, v in enumerate(env) if v < ref - 20), None)
        if hit is not None: t20.append(hit * 5)
    return {"file": path.split("/")[-1], "pauses": len(tails), "tail_dB": round(float(np.median(tails)), 1),
            "t20_ms": round(float(np.median(t20)), 0) if t20 else None, "floor_dBFS": round(float(np.median(floors)), 1)}
for a in sys.argv[1:]:
    p, w, s = a.split("::"); print(json.dumps(run(p, w, float(s))))
