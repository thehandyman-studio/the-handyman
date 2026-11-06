"""Shorts voice master (local, free): shorten long pauses + clarity/loudness chain. Inputs are only read.

    .venv/bin/python scripts/voice/shorts_master.py <short> --take=<take> [--spoken=<file>]
                     [--max-pause=0.18] [--target-lufs=-15]

In : <work dir>/voice.wav (unprocessed take) + words_snapped.json (method 1; else words.json) + snap_report.json
Out: <work dir>/voice_master.wav + words_master.json + master_report.json  (earlier versions -> _previous/<time>/)

Settings = the approved John Shorts test (voice-lab/2026-11-05_v3-test/fast_john_shorts.py, 2026-11-05):
 1. every measured pause longer than --max-pause is shortened to it (cut in the middle of the silence, 10 ms fades);
    speech itself is not touched: no time stretch, no pitch, no formants
 2. word times moved by the same cuts (exact) and validated against the caption reference
 3. pre-level to -24 LUFS, high-pass 70 Hz, +1.5 dB @ 3 kHz, de-esser 0.35, compressor 2:1 from -28 dBFS (soft knee),
    gain to --target-lufs, limiter (4x oversampled, -1.3 dBFS) only if the true peak would exceed -1 dBTP
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import wave

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import die, load_caption_rules, unique_dir, voice_dir, work_dir  # noqa: E402
from snap_timing import reference_tokens  # noqa: E402
from timing import read_wav_mono, validate_words  # noqa: E402

FADE = 0.010
PRE_LUFS, TP_MAX = -24.0, -1.0
CHAIN = ",".join(["highpass=f=70:poles=2", "equalizer=f=3000:t=q:w=1.0:g=1.5", "deesser=i=0.35:m=0.5:f=0.5:s=o",
                  "acompressor=threshold=0.0398:ratio=2:attack=15:release=150:knee=6:makeup=1"])
LIMIT = "aresample=192000,alimiter=limit=0.861:attack=2:release=60:level=disabled,aresample=48000"
OUTS = ("voice_master.wav", "words_master.json", "master_report.json")


def ff(args):
    r = subprocess.run(["ffmpeg", "-hide_banner"] + args, capture_output=True, text=True)
    if r.returncode != 0:
        die(r.stderr[-800:])
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


def shorten_pauses(x, sr, pauses, max_pause):
    nf = int(FADE * sr)
    x = x.copy()
    out, cuts, pos = [], [], 0
    for a, b in pauses:
        if b - a <= max_pause:
            continue
        keep = max_pause / 2
        c0, c1 = int((a + keep) * sr), int((b - keep) * sr)
        left = x[pos:c0].copy()
        left[-nf:] *= np.linspace(1, 0, nf)
        out.append(left)
        cuts.append(((a + b) / 2, (c1 - c0) / sr))
        pos = c1
        x[pos:pos + nf] = x[pos:pos + nf] * np.linspace(0, 1, nf)
    out.append(x[pos:])
    return np.concatenate(out), cuts


def main(argv=None):
    ap = argparse.ArgumentParser(description="Shorts voice master: pause shortening + loudness (no API, no cost).")
    ap.add_argument("short")
    ap.add_argument("--take", required=True)
    ap.add_argument("--spoken", help="spoken file of the take (for its caption reference)")
    ap.add_argument("--max-pause", type=float, default=0.18)
    ap.add_argument("--target-lufs", type=float, default=-15.0)
    a = ap.parse_args(argv)
    vdir = voice_dir(a.short)
    T = work_dir(vdir, a.take)
    src = os.path.join(T, "voice.wav")
    wfile = "words_snapped.json" if os.path.exists(os.path.join(T, "words_snapped.json")) else "words.json"
    for p in (src, os.path.join(T, wfile), os.path.join(T, "snap_report.json")):
        if not os.path.exists(p):
            die(f"fehlt: {p}")
    x, sr = read_wav_mono(src)
    words = json.load(open(os.path.join(T, wfile), encoding="utf-8"))
    pauses = json.load(open(os.path.join(T, "snap_report.json"), encoding="utf-8"))["pauses"]
    y, cuts = shorten_pauses(x, sr, pauses, a.max_pause)
    shift = lambda t: t - sum(d for c, d in cuts if c < t)
    new_words = [{"w": w["w"], "s": round(shift(w["s"]), 3), "e": round(shift(w["e"]), 3)} for w in words]
    ref, ref_name = reference_tokens(vdir, load_caption_rules(vdir, a.spoken))
    problems = validate_words(new_words, ref, len(y) / sr)
    if problems:
        die("Pruefung fehlgeschlagen - nichts geschrieben:\n  - " + "\n  - ".join(problems))

    old = [os.path.join(T, n) for n in OUTS if os.path.exists(os.path.join(T, n))]
    if old:
        bk = unique_dir(os.path.join(T, "_previous"))
        os.makedirs(bk)
        for p in old:
            shutil.move(p, bk)
        print(f"Fruehere Master-Fassung gesichert: {bk}")
    out_wav, out_words, out_rep = (os.path.join(T, n) for n in OUTS)
    tmp = [out_wav + f".s{i}.wav" for i in range(4)]
    write_mono(tmp[0], y, sr)
    pre = PRE_LUFS - measure(tmp[0])["lufs"]
    ff(["-y", "-i", tmp[0], "-af", f"volume={pre:.3f}dB", "-ac", "1", "-c:a", "pcm_s24le", tmp[1]])
    ff(["-y", "-i", tmp[1], "-af", CHAIN, "-ac", "1", "-c:a", "pcm_s24le", tmp[2]])
    gain = a.target_lufs - measure(tmp[2])["lufs"]
    ff(["-y", "-i", tmp[2], "-af", f"volume={gain:.3f}dB", "-ac", "1", "-c:a", "pcm_s24le", tmp[3]])
    m3 = measure(tmp[3])
    if m3["true_peak_dbtp"] > TP_MAX:
        ff(["-y", "-i", tmp[3], "-af", LIMIT, "-ac", "1", "-c:a", "pcm_s24le", "-bitexact", out_wav])
    else:
        os.replace(tmp[3], out_wav)
    for p in tmp:
        if os.path.exists(p):
            os.remove(p)
    with open(out_words, "x", encoding="utf-8") as f:
        json.dump(new_words, f, indent=1, ensure_ascii=False)
    rep = {"source": f"voice.wav + {wfile}", "reference": ref_name, "max_pause_s": a.max_pause,
           "target_lufs": a.target_lufs, "pauses_before_s": [round(b - q, 3) for q, b in pauses],
           "pauses_shortened": len(cuts), "removed_s": round(sum(d for _, d in cuts), 3),
           "duration_before_s": round(len(x) / sr, 3), "duration_after_s": round(len(y) / sr, 3),
           "chain": CHAIN, "pre_gain_db": round(pre, 2), "gain_db": round(gain, 2),
           "limiter_needed_db": round(max(0.0, m3["true_peak_dbtp"] - TP_MAX), 2),
           "before": measure(src), "final": measure(out_wav), "words": len(new_words), "validation_problems": problems}
    with open(out_rep, "x", encoding="utf-8") as f:
        json.dump(rep, f, indent=2)
    print(f"OK - {out_wav}: {rep['duration_before_s']} s -> {rep['duration_after_s']} s ({len(cuts)} Pausen gekuerzt), "
          f"{rep['final']['lufs']} LUFS, True Peak {rep['final']['true_peak_dbtp']} dBTP")
    return 0


if __name__ == "__main__":
    sys.exit(main())
