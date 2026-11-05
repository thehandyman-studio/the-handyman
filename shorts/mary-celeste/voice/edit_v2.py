"""Mary Celeste narration v2: local edits of voice.wav (no ElevenLabs, no credits).

Reads  voice.wav + words.json  (never modified)
Writes voice_v2.wav, words_v2.json, processing_v2.json, v2_tests/ (pitch comparison clips)

Run from the project root:  .venv/bin/python shorts/mary-celeste/voice/edit_v2.py
All times below are positions in the ORIGINAL voice.wav (seconds), chosen inside measured silences
(< -45 dB, noise floor ~ -91 dB), so every cut lands in silence.
"""
import json
import os
import subprocess
import sys
import tempfile

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "shorts", "bridge", "audio"))
from dsp import read_wav  # noqa: E402  (48 kHz)

SR = 48000
FADE = 0.010  # 10 ms fades at every splice (all inside silence)

# 1) "Its sails damaged. Its deck empty. Not a single person aboard." -> shorter pauses
# 2) before "And the strangest part?" -> longer pause
# (window start, window end, new length) - the window is replaced by the same silence, shortened or lengthened
GAPS = [
    (4.83, 5.32, 0.34),    # after "damaged."            silence 0.55 s -> ~0.40 s
    (5.93, 6.29, 0.06),    # "deck ... empty"            silence 0.42 s -> ~0.12 s (unnatural mid-phrase gap)
    (6.79, 7.35, 0.36),    # after "empty."              silence 0.62 s -> ~0.42 s
    (8.20, 8.36, 0.04),    # "single ... person"         silence 0.22 s -> ~0.10 s
    (8.93, 9.20, 0.06),    # "person ... aboard."        silence 0.33 s -> ~0.12 s
    (29.44, 29.96, 1.24),  # "gone." -> "And the strangest part?"  silence 0.58 s -> ~1.30 s
]
# 1b) "Not a single person aboard." slightly faster (time only, pitch unchanged)
STRETCH = (7.36, 9.80, 1.05)   # (start, end, tempo factor)
# 3) "No one knows." slightly lower (pitch only, timing unchanged, formants kept)
PITCH = (54.68, 55.90, -1.25)  # (start, end, semitones)
PITCH_TESTS = [-1.0, -1.25, -1.5]
# 4) clarity: gentle EQ + de-esser + compression, then loudness matched to the original
CHAIN = ",".join([
    "highpass=f=75:poles=2",                       # remove rumble below the voice
    "equalizer=f=220:t=q:w=1.0:g=-1.5",           # a little less boom/mud
    "equalizer=f=3000:t=q:w=1.0:g=1.5",           # presence / consonants (gentle)
    "deesser=i=0.4:m=0.5:f=0.5:s=o",              # keep the s-sounds from getting sharper
    "acompressor=threshold=0.08:ratio=2.0:attack=15:release=180:knee=6:makeup=1",  # -22 dB, 2:1, gentle
])


def write_mono(path, x):
    """24-bit mono WAV (dsp.write_wav always writes stereo)."""
    import wave
    q = np.clip(np.round(np.asarray(x) * 8388607.0), -8388608, 8388607).astype("<i4")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(3)
        w.setframerate(SR)
        w.writeframes(q.view(np.uint8).reshape(-1, 4)[:, :3].tobytes())


def fade_edges(seg, n_in=True, n_out=True):
    n = min(int(FADE * SR), len(seg) // 2)
    seg = seg.copy()
    if n_in:
        seg[:n] *= np.linspace(0, 1, n)
    if n_out:
        seg[-n:] *= np.linspace(1, 0, n)
    return seg


def rubberband(seg, args, td):
    a, b = os.path.join(td, "rb_in.wav"), os.path.join(td, "rb_out.wav")
    write_mono(a, seg)
    subprocess.run(["rubberband", "-q", "-3", *args, a, b], check=True, capture_output=True)
    y, sr = read_wav(b)
    assert sr == SR
    return y[0]


def edit_gaps(x, gaps):
    """Replace silent windows by shorter/longer silence. Returns audio and a time map (old -> new breakpoints)."""
    out, bp, pos, tn = [], [(0.0, 0.0)], 0, 0.0
    for a, b, L in sorted(gaps):
        ia, ib, nn = int(a * SR), int(b * SR), int(L * SR)
        out.append(x[pos:ia])
        tn += (ia - pos) / SR
        bp.append((ia / SR, tn))
        sil = x[ia:ib]
        h = min(nn, len(sil)) // 2
        left, right = fade_edges(sil[:h], False, True), fade_edges(sil[len(sil) - (min(nn, len(sil)) - h):], True, False)
        mid = np.zeros(max(0, nn - len(left) - len(right)))
        piece = np.concatenate([left, mid, right])
        out.append(piece)
        tn += len(piece) / SR
        bp.append((ib / SR, tn))
        pos = ib
    out.append(x[pos:])
    tn += (len(x) - pos) / SR
    bp.append((len(x) / SR, tn))
    return np.concatenate(out), bp


def mapper(bp):
    o, n = np.array(bp).T
    return lambda t: np.interp(t, o, n)


def lufs(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    s = r[r.rfind("Summary:"):]
    get = lambda key: float(s.split(key)[1].split()[0])
    return get("I:"), get("Peak:")


def main():
    for p in ("voice_v2.wav", "words_v2.json"):
        if os.path.exists(os.path.join(HERE, p)) and "--force" not in sys.argv:
            sys.exit(f"{p} existiert schon - nichts ueberschrieben (zum Ersetzen --force).")
    x, sr = read_wav(os.path.join(HERE, "voice.wav"))
    assert sr == SR
    x = x[0]
    words = json.load(open(os.path.join(HERE, "words.json"), encoding="utf-8"))

    with tempfile.TemporaryDirectory() as td:
        # pass 1: pauses
        y, bp1 = edit_gaps(x, GAPS)
        m1 = mapper(bp1)
        # pass 2: tempo of "Not a single person aboard."
        s0, s1, tempo = STRETCH
        a, b = int(m1(s0) * SR), int(m1(s1) * SR)
        seg = fade_edges(rubberband(y[a:b], ["-T", f"{tempo:g}"], td))
        y = np.concatenate([fade_edges(y[:a], False, True), seg, fade_edges(y[b:], True, False)])
        bp2 = [(0.0, 0.0), (a / SR, a / SR), (b / SR, (a + len(seg)) / SR), (len(y) / SR + (b - a - len(seg)) / SR, len(y) / SR)]
        m2 = mapper(bp2)
        M = lambda t: m2(m1(t))
        # pass 3: pitch of "No one knows." (+ comparison clips)
        p0, p1, semis = PITCH
        a, b = int(M(p0) * SR), int(M(p1) * SR)
        tests = os.path.join(HERE, "v2_tests")
        os.makedirs(tests, exist_ok=True)
        ca, cb = int(M(53.20) * SR), int(M(57.00) * SR)   # context: "...sudden disaster? No one knows. The Mary..."
        write_mono(os.path.join(tests, "no_one_knows_pitch_0.0_unchanged.wav"), y[ca:cb])
        variants = {}
        for st in PITCH_TESTS:
            seg = rubberband(y[a:b], ["-F", "-p", f"{st:g}"], td)
            seg = np.pad(seg, (0, max(0, (b - a) - len(seg))))[: b - a]
            seg = fade_edges(seg)
            variants[st] = np.concatenate([fade_edges(y[:a], False, True), seg, fade_edges(y[b:], True, False)])
            write_mono(os.path.join(tests, f"no_one_knows_pitch_{st:+.2f}.wav"), variants[st][ca:cb])
        y = variants[semis]
        # pass 4: clarity chain + loudness match
        pre = os.path.join(td, "pre.wav")
        post = os.path.join(td, "post.wav")
        write_mono(pre, y)
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", pre, "-af", CHAIN,
                        "-c:a", "pcm_s24le", post], check=True)
        i_ref, _ = lufs(os.path.join(HERE, "voice.wav"))
        i_post, _ = lufs(post)
        z, _ = read_wav(post)
        z = z[0] * 10 ** ((i_ref - i_post) / 20)
        out = os.path.join(HERE, "voice_v2.wav")
        write_mono(out, z)
        i_out, tp_out = lufs(out)

    new_words = [{"w": w["w"], "s": round(float(M(w["s"])), 3), "e": round(float(M(w["e"])), 3)} for w in words]
    json.dump(new_words, open(os.path.join(HERE, "words_v2.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    log = {"source": "voice.wav", "gaps": GAPS, "stretch": STRETCH, "pitch": PITCH, "eq_comp_chain": CHAIN,
           "loudness_ref_LUFS": i_ref, "loudness_v2_LUFS": i_out, "true_peak_v2_dBTP": tp_out,
           "duration_v1_s": round(len(x) / SR, 3), "duration_v2_s": round(len(z) / SR, 3)}
    json.dump(log, open(os.path.join(HERE, "processing_v2.json"), "w", encoding="utf-8"), indent=2)
    print(json.dumps(log, indent=1))


if __name__ == "__main__":
    main()
