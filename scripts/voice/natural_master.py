"""THE HANDYMAN voice master "V3" (approved 2026-11-06, local and free): natural, dry John from a processed take.

    .venv/bin/python scripts/voice/natural_master.py <short> --take <take> --out <new take folder name>

Reads   shorts/<short>/voice/takes/<take>/raw/elevenlabs.mp3, words_snapped.json, snap_report.json (from process_voice.py)
        and shorts/<short>/voice/narration.txt (caption spelling)
Writes  shorts/<short>/voice/takes/<out>/voice_master.wav + words_master.json + master_report.json (folder must not exist)
Steps (= voice-lab/2026-11-06_john-natural/make_variants_v2.py, variant V3, which Adrian chose):
  1. tempo x1.10 with ffmpeg atempo (WSOLA; Rubber Band R3 smeared word ends = 'room')
  2. sentence pauses > 0.18 s shortened PROPORTIONALLY (same total length as capping them at 0.18 s, natural variation)
  3. light chain: highpass 70 Hz, gentle de-esser, compressor 1.5:1; -15 LUFS; true-peak limiter only if needed
  4. word timings shifted with the cuts; spelling taken from narration.txt (emphasis capitals -> normal captions)
"""
import argparse, json, os, re, subprocess, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shorts_master as SM  # noqa: E402
from timing import read_wav_mono  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
LIGHT = "highpass=f=70:poles=2,deesser=i=0.2:m=0.5:f=0.5:s=o,acompressor=threshold=0.0398:ratio=1.5:attack=25:release=200:knee=6:makeup=1"
norm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("short"); ap.add_argument("--take", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--tempo", type=float, default=1.1); ap.add_argument("--cap", type=float, default=0.18)
    a = ap.parse_args()
    V = os.path.join(ROOT, "shorts", a.short, "voice")
    T, O = os.path.join(V, "takes", a.take), os.path.join(V, "takes", a.out)
    if os.path.exists(O):
        sys.exit(f"exists, nothing written: {O}")
    pauses = json.load(open(os.path.join(T, "snap_report.json")))["pauses"]
    words = json.load(open(os.path.join(T, "words_snapped.json"), encoding="utf-8"))
    ref = open(os.path.join(V, "narration.txt"), encoding="utf-8").read().split()
    if [norm(w["w"]) for w in words] != [norm(r) for r in ref if norm(r)]:
        sys.exit("words_snapped.json does not match narration.txt word for word - nothing written")
    os.makedirs(O)
    tmp = os.path.join(O, "_tmp"); os.makedirs(tmp)
    raw48, st = os.path.join(tmp, "raw48.wav"), os.path.join(tmp, "stretch.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(T, "raw/elevenlabs.mp3"), "-ar", "48000", "-ac", "1", raw48], check=True)
    x0, sr = read_wav_mono(raw48)
    length = len(x0) / sr / a.tempo
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw48, "-af", f"atempo={a.tempo},apad,atrim=0:{length}", st], check=True)
    x, sr = read_wav_mono(st)
    long_ = [(p, q) for p, q in pauses if q - p > a.cap]
    tot = sum(q - p for p, q in long_)
    k = (tot - sum((q - p) - a.cap for p, q in long_)) / tot if tot else 1.0
    nf = int(SM.FADE * sr); y = x.copy(); out, pos, cuts = [], 0, []
    for p, q in long_:
        keep = (q - p) * k / 2
        c0, c1 = int((p + keep) * sr), int((q - keep) * sr)
        left = y[pos:c0].copy(); left[-nf:] *= np.linspace(1, 0, nf); out.append(left)
        cuts.append(((p + q) / 2, (c1 - c0) / sr)); pos = c1; y[pos:pos + nf] *= np.linspace(0, 1, nf)
    out.append(y[pos:]); y = np.concatenate(out)
    t0, t1, t2 = (os.path.join(tmp, f"s{i}.wav") for i in range(3))
    SM.write_mono(t0, y, sr)
    SM.ff(["-y", "-i", t0, "-af", f"volume={SM.PRE_LUFS - SM.measure(t0)['lufs']:.3f}dB,{LIGHT}", "-c:a", "pcm_s24le", t1])
    SM.ff(["-y", "-i", t1, "-af", f"volume={-15.0 - SM.measure(t1)['lufs']:.3f}dB", "-c:a", "pcm_s24le", t2])
    dst = os.path.join(O, "voice_master.wav")
    if SM.measure(t2)["true_peak_dbtp"] > SM.TP_MAX:
        SM.ff(["-y", "-i", t2, "-af", SM.LIMIT, "-c:a", "pcm_s24le", dst])
    else:
        os.replace(t2, dst)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    shift = lambda t: t - sum(d for c, d in cuts if c < t)
    refw = [r for r in ref if norm(r)]
    new = [{"w": r, "s": round(shift(w["s"]), 3), "e": round(shift(w["e"]), 3)} for w, r in zip(words, refw)]
    json.dump(new, open(os.path.join(O, "words_master.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    rep = {"source_take": a.take, "tempo": a.tempo, "engine": "ffmpeg atempo", "pause_keep_share": round(k, 3),
           "pauses_after_s": [round((q - p) * k, 3) for p, q in long_], "chain": LIGHT, "duration_s": round(len(y) / sr, 3),
           "final": SM.measure(dst), "words": len(new)}
    json.dump(rep, open(os.path.join(O, "master_report.json"), "w"), indent=1)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
