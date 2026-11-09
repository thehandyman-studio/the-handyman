"""Sound for THE HANDYMAN Episode 7 "The Elevator Had a Floor That Didn't Exist" (2026-11-09): own score (the series'
4-note celesta motif A-D-F-E in D minor), hall / car / shaft / cave ambience, synthesised SFX, and a LOOP-SAFE mix
(everything on a circle: what rings past the end continues at the start; the limiter runs on the circle too).
Plan: shorts/elevator-13/SOUND_PLAN.md. Pattern: scripts/audio/citymix.py (only read, not changed).

    .venv/bin/python scripts/audio/elevatormix.py shorts/elevator-13

story.json: "words" (words_timed.json), "voice" (voice_timed.wav or null = preview without narration), "tail_s".
Writes shorts/<name>/audio/mix.wav (48 kHz stereo 24-bit, exact video length) + stems + mix_report.json.
Local and free. shortmix.py / sfx_gen.py / dsp.py / instruments.py are only imported (unchanged).
"""
import json, math, os, re, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import SR, ns, tt, lp, hp, bp, colored, st, pan, widen, true_peak, read_wav, write_wav, dbg  # noqa: E402
from instruments import pad, pluck, musicbox, glock, timpani, cymbal, brass  # noqa: E402
from sfx_gen import whoosh, creak  # noqa: E402
from shortmix import boom, riser, speech_env, lufs  # noqa: E402
import sfx_elevator as E  # noqa: E402

FPS = 30
D2 = 73.42
m = lambda f, k: f * 2 ** (k / 12)


def norm(t):
    return re.sub(r"[^a-z0-9]", "", t.lower())


class Words:
    def __init__(self, w):
        self.w = w

    def i(self, phrase, nth=0):
        p = [norm(x) for x in phrase.split()]
        h = 0
        for i in range(len(self.w) - len(p) + 1):
            if all(norm(self.w[i + k]["w"]) == q for k, q in enumerate(p)):
                if h == nth:
                    return i
                h += 1
        raise SystemExit(f"phrase not found: {phrase} #{nth}")

    def s(self, phrase, nth=0):
        return self.w[self.i(phrase, nth)]["s"]

    def e(self, phrase, nth=0):
        return self.w[self.i(phrase, nth) + len(phrase.split()) - 1]["e"]


class Ring:
    """stereo buffer on a circle (the loop)"""
    def __init__(self, n):
        self.n = n
        self.x = np.zeros((2, n))

    def add(self, y, t, g=1.0):
        y = st(y) * g
        i0 = ns(t) % self.n
        L, pos = y.shape[1], 0
        while pos < L:
            a = (i0 + pos) % self.n
            k = min(L - pos, self.n - a)
            self.x[:, a:a + k] += y[:, pos:pos + k]
            pos += k


def chord(root, kind, octs=(0,)):
    iv = {"min": [0, 3, 7], "maj": [0, 4, 7], "sus": [0, 5, 7], "min9": [0, 3, 7, 14], "dim": [0, 3, 6], "maj7": [0, 4, 7, 11]}[kind]
    return [m(root, k + 12 * o) for o in octs for k in iv]


# ======================================================================== score
def score(W, D, n):
    r = np.random.default_rng(7)
    M = Ring(n)
    t = W.s
    MOT = [440.0, m(440, 5), m(440, 8), m(440, 7)]              # A D F E: the series motif

    def celesta(f, tm, v):
        M.add(pan(musicbox(f, v, r, 2.4) * 0.8 + glock(f, v * 0.45, r, 2.4) * 0.3, r.uniform(-0.3, 0.3)), tm)

    def motif(t0, notes, v, step):
        for k, f in enumerate(notes):
            celesta(f, t0 + k * step, v * (1 - 0.08 * k))

    def padc(freqs, t0, t1, v, att=0.6, rel=0.9, warm=900.0):
        if t1 > t0:
            M.add(pad(freqs, max(0.2, t1 - t0), v, r, att, rel, warm), t0)

    # ---- A 0 - "Leo was": the impossible button. Low D drone, the motif slow and music-box thin (eerie)
    tB = t("Leo was") - 0.05
    padc([D2, m(D2, 7), m(D2, 12)], 0.0, tB + 0.6, 0.3, att=0.02, rel=0.8, warm=450)
    padc([m(D2, 27), m(D2, 34)], 0.0, tB, 0.08, att=0.02, rel=0.6, warm=3000)        # glassy high F + C
    motif(0.35, MOT, 0.42, 0.55)
    celesta(m(440, 7) * 2, t("thirteen") + 0.02, 0.4)                                    # E an octave up on "thirteen"
    # ---- B "Leo was" - "Then the button": curious, light, on tiptoe (pizzicato), then it turns on "felt wrong"
    tC = t("Then the button") - 0.05
    beat = 60 / 92.0
    k, tb = 0, tB
    seq = [D2 * 2, m(D2, 7) * 2, m(D2, 3) * 2, m(D2, 7) * 2, m(D2, -2) * 2, m(D2, 5) * 2, m(D2, 1) * 2, m(D2, 7) * 2]
    while tb < t("felt") - 0.1:
        M.add(pan(pluck(seq[k % 8], 0.34, r, 0.7, 0.35), r.uniform(-0.4, 0.4)), tb)
        k += 1; tb += beat / 2
    padc(chord(D2, "min", (1,)), tB, t("felt"), 0.14, att=0.4, warm=900)
    padc([m(D2, 1), m(D2, 13), m(D2, 18)], t("felt") - 0.1, tC + 0.3, 0.22, att=0.3, rel=0.4, warm=700)   # bII: wrong
    M.add(st(brass(m(D2, 1), 0.4, 0.6, r, "horn", -14, 0.3)) * 0.25, t("wrong") - 0.02)
    # ---- C "Then the button" - stop: the fall. Pulse that speeds up, low brass, rising cluster, riser into the slam
    tdn, tstop = t("down"), W.e("allow") + 0.45
    padc([D2 * 0.5, D2, m(D2, 1)], tC, tdn, 0.24, att=0.2, rel=0.3, warm=500)
    tb, gap = t("closed"), 0.62
    while tb < tstop - 0.08:                                                              # heartbeat getting faster
        M.add(timpani(D2 * 0.75, 0.45 + 0.35 * (tb - tC) / (tstop - tC), r, 0.7), tb, 0.5)
        tb += gap
        gap = max(0.17, gap * (0.95 if tb < tdn else 0.9))
    for k, a in enumerate(np.arange(tdn, tstop - 0.3, 1.3)):                                # low brass steps down (chromatic)
        M.add(st(brass(m(D2 * 0.5, -k), 1.2, 0.5 + 0.08 * k, r, "tuba", -18, 0.3)) * 0.4, a)
    cl = [m(D2, 12), m(D2, 13), m(D2, 15), m(D2, 18)]
    for k, f in enumerate(cl):                                                            # string cluster piling up
        M.add(pad([f, f * 2], tstop - tdn - 0.15 * k, 0.07 + 0.02 * k, r, 1.4, 0.05, 2500), tdn + 0.15 * k)
    rz = riser(r, tstop - t("Much"))
    rz *= np.linspace(0, 1, rz.shape[1]) ** 2
    M.add(rz, t("Much"), 0.9)
    M.add(boom(r, 0.5), tstop - 0.02)
    # then: silence (only the settling car); "When the doors opened" starts in near silence
    # ---- D "When" - "Then he noticed": the reveal. Deep swell, choir-like pad, the motif high and slow
    tW, tE_ = t("When"), t("Then he noticed") - 0.05
    padc([D2 * 0.5, D2], tW + 0.3, tE_ + 0.5, 0.32, att=1.8, rel=1.2, warm=220)                 # sub drone
    padc(chord(m(D2, 3), "maj", (1, 2)), t("An entire"), t("Empty") + 0.3, 0.26, att=0.25, rel=0.8, warm=1800)  # F major: the size of it
    padc(chord(m(D2, 10), "maj", (1, 2)), t("Empty"), t("Thousands"), 0.22, att=0.3, rel=0.6, warm=1600)      # C
    padc(chord(m(D2, 8), "maj7", (1, 2)), t("Thousands"), t("And lights"), 0.24, att=0.3, rel=0.6, warm=1600)  # Bb maj7
    padc(chord(D2, "min9", (1, 2)), t("And lights"), tE_ + 0.4, 0.22, att=0.4, rel=1.0, warm=1400)             # Dm9: still glowing
    M.add(timpani(D2, 0.8, r, 2.8), t("An entire") - 0.02, 0.6)
    M.add(cymbal(0.5, r, 3.0, 0.7), t("An entire") - 0.02, 0.18)
    motif(t("An entire") + 0.35, [m(f, 12) for f in MOT], 0.42, 0.62)
    motif(t("And lights") + 0.1, MOT, 0.32, 0.5)
    # ---- E "Then he noticed" - "himself": music thins; a high tension tone grows; SILENCE when he looks up
    tH = t("himself")
    padc([D2, m(D2, 1)], tE_, tH, 0.16, att=0.6, rel=0.05, warm=420)
    for k, f in enumerate(MOT[:3]):                                                      # motif broken off (no 4th note)
        celesta(m(f, -12), t("familiar") + k * 0.55, 0.3)
    tb = t("One of the buildings")
    while tb < tH - 0.2:                                                                  # muted pulse
        M.add(lp(timpani(D2 * 0.75, 0.3, r, 0.6), 500), tb, 0.45)
        tb += 0.5
    M.add(st(E.tension_high(tH - t("And in one") + 0.15, r)), t("And in one"), 0.5)
    M.add(st(brass(D2 * 0.5, 0.35, 0.8, r, "stab", -10, 0.4)) * 0.3, tH + 0.05)             # one dull hit on "himself"
    # ---- F "Suddenly" - end: the loop. Drone, the motif complete on "glowing again", swell into the 13
    tS, T13 = t("Suddenly"), D - 7 / FPS
    padc([D2 * 0.5, D2, m(D2, 7)], tS, D - 0.9, 0.24, att=0.8, rel=0.6, warm=300)
    motif(t("glowing", 1) - 0.05, MOT, 0.4, 0.42)
    padc([m(D2, 27), m(D2, 28)], t("And this"), D - 0.6, 0.1, att=0.8, rel=0.4, warm=3500)  # high F/F#: unresolved
    M.add(timpani(D2, 0.55, r, 1.5), t("waiting"), 0.5)
    sw = cymbal(0.7, r, D - 0.3 - t("waiting"), 1.0)[::-1]
    sw *= np.linspace(0, 1, len(sw)) ** 3
    M.add(sw * 0.35, t("waiting"))
    M.add(timpani(D2, 0.9, r, 2.6), T13, 0.55)                                            # the 13 switches on: the loop hit
    M.add(st(brass(D2, 0.5, 0.9, r, "stab", -10, 0.5)) * 0.3, T13)
    return M.x


# ======================================================================== ambience
def ambience(W, D, n):
    r = np.random.default_rng(23)
    T = np.arange(n) / SR
    t = W.s
    tclose, tstop, tW = t("closed"), W.e("allow") + 0.45, t("When")
    tshut = t("for", 2) + 0.75
    hall = E.hall_tone(D, r)
    g_hall = np.interp(T, [0, tclose, tclose + 0.6, D], [1, 1, 0.15, 0.15])
    car = st(E.flicker(D, r)) * 0.05 + st(lp(colored(n, r, 1.5), 200)) * 0.35
    g_car = np.interp(T, [0, tW, tW + 1.5, tshut - 0.2, tshut, D], [1, 1, 0.3, 0.3, 1, 1])
    cave = E.cave_air(D, r)
    g_cave = np.interp(T, [0, tW + 0.2, tW + 1.8, tshut - 0.3, tshut + 0.2, D], [0, 0, 1, 1, 0.12, 0.0])
    # the cave is muffled while the doors are only half open / after they shut
    cave = cave * g_cave
    amb = hall * g_hall + car * g_car + cave
    # silence after the stop: only a faint hum
    amb *= np.interp(T, [0, tstop - 0.05, tstop + 0.1, tW - 0.2, tW + 0.6, D], [1, 1, 0.35, 0.35, 1, 1])
    return amb


# ======================================================================== sfx
def effects(W, D, n):
    r = np.random.default_rng(41)
    X = Ring(n)
    t = W.s
    T13 = D - 7 / FPS
    X.add(E.button13_on(r), T13 - 0.03, 0.9)                                              # loop: rings over the seam
    X.add(st(E.screw_turn(0.55, r)), t("broken") - 0.15, 0.5)
    X.add(st(E.cover_open(r)), t("broken") + 0.3, 0.6)
    X.add(st(E.cover_close(r)), t("wrong") + 0.02, 0.5)
    X.add(E.button13_on(r), t("lit") - 0.06, 1.0)                                         # it lights by itself
    X.add(st(E.doors_slide(0.55, r, True)), t("closed") - 0.15, 0.8)
    X.add(E.motor_start(1.2, r), t("started") - 0.1, 0.6)
    tdn, tstop = t("down"), W.e("allow") + 0.45
    X.add(E.descent(tstop - tdn + 0.05, r), tdn - 0.05, 1.0)
    for w in ("down", "basement", "foundations", "deeper", "should"):
        X.add(E.metal_shake(r, 0.8), t(w) - 0.03, 0.5)
    X.add(st(E.flicker(tstop - t("Past"), r)), t("Past"), 0.12)
    X.add(widen(whoosh(0.9, r, 0.45, 200, 2500), r, 10, 0.7), t("Past", 1) - 0.35, 0.6)  # the car falls past the camera
    for k in range(10):                                                                   # he hammers the buttons
        X.add(st(E.button_click(r, 0.9)), t("Much") + 0.05 + k * 0.17, 0.6)
    X.add(E.hard_stop(r), tstop - 0.05, 1.1)
    X.add(st(E.doors_slide(1.9, r, False)), t("When") + 0.2, 0.55)
    for k in range(4):                                                                    # cautious steps out
        X.add(pan(E.footstep(r, 0.6), 0.1 - 0.05 * k), t("Empty") - 0.2 + k * 0.48, 0.5)
    X.add(st(E.doors_slide(0.7, r, True)), t("One of the") + 0.1, 0.18)                          # far behind him, they close
    X.add(E.ding(r, 1.0), t("Suddenly") - 0.12, 0.8)
    X.add(st(E.doors_slide(0.7, r, False)), t("Suddenly") + 0.3, 0.6)
    X.add(st(creak(0.8, r, 70, 50)), t("himself") + 0.6, 0.15)
    for k in range(3):                                                                    # steps backward into the car
        X.add(pan(E.footstep(r, 0.5), 0.0), t("waiting") + 0.2 + k * 0.45, 0.45)
    X.add(st(E.doors_slide(0.85, r, True)), t("for", 2) - 0.15, 0.85)
    X.add(st(E.button_click(r, 0.6)), T13 - 0.6, 0.3)
    return X.x


# ======================================================================== mix
def main():
    sdir = os.path.abspath(sys.argv[1])
    story = json.load(open(os.path.join(sdir, "story.json"), encoding="utf-8"))
    words = json.load(open(os.path.join(sdir, story["words"]), encoding="utf-8"))
    W = Words(words)
    frames = math.ceil((words[-1]["e"] + story.get("tail_s", 1.6)) * FPS)
    D = frames / FPS
    n = ns(D)
    out = os.path.join(sdir, "audio")
    os.makedirs(out, exist_ok=True)
    voice = np.zeros((2, n))
    if story.get("voice"):
        v, sr = read_wav(os.path.join(sdir, story["voice"]))
        assert sr == SR, sr
        vm = v[0] if v.shape[0] == 1 else v.mean(0)
        voice[:, :min(n, len(vm))] = st(vm)[:, :n]
    music, amb, sfx = score(W, D, n), ambience(W, D, n), effects(W, D, n)
    duck = speech_env(words, n)
    music, amb = hp(music, 38, 4), hp(amb, 70, 4)
    music *= dbg(-18.5 - lufs(music))
    amb *= dbg(-26.0 - lufs(amb))
    sfx *= dbg(-25.0 - lufs(sfx))
    sfx = sfx * dbg(-3.0 * duck)
    music = (music - (1 - dbg(-4.0)) * bp(music, 1000, 4000) * duck) * dbg(-10.0 * duck)
    amb = (amb - (1 - dbg(-3.0)) * bp(amb, 1000, 4000) * duck) * dbg(-6.0 * duck)
    has_voice = bool(story.get("voice"))
    mix = voice + music + amb + sfx
    # with the voice: whole mix to -14 LUFS. Without (preview): the gain the voice would have needed (voice at -15 LUFS
    # pre-mix lands about 1 dB under the -14 target), so the bed keeps its final level
    g = dbg(-14.0 - lufs(mix)) if has_voice else dbg(1.0)
    mix *= g
    for x, name in ((voice * g, "voice"), (music * g, "music"), (amb * g, "amb"), (sfx * g, "sfx")):
        write_wav(os.path.join(out, f"stem_{name}.wav"), x)
    pad_s = ns(2.0)
    circ = np.concatenate([mix[:, -pad_s:], mix, mix[:, :pad_s]], axis=1)
    pre, lim = os.path.join(out, "_pre.wav"), os.path.join(out, "_lim.wav")
    write_wav(pre, circ)
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", pre, "-af",
                    "aresample=192000,alimiter=limit=0.861:attack=2:release=60:level=disabled,aresample=48000",
                    "-c:a", "pcm_s24le", "-ac", "2", lim], check=True)
    fx, _ = read_wav(lim)
    fx = fx[:, pad_s:pad_s + n]
    os.remove(pre); os.remove(lim)
    write_wav(os.path.join(out, "mix.wav"), fx)
    blk = ns(0.02)
    rms = lambda a: 20 * np.log10(np.sqrt(np.mean(a ** 2)) + 1e-9)
    ring = np.concatenate([fx[:, -blk * 50:], fx[:, :blk * 50]], axis=1)
    steps = [abs(rms(ring[:, (k + 1) * blk:(k + 2) * blk]) - rms(ring[:, k * blk:(k + 1) * blk])) for k in range(99)]
    # word by word: voice minus the rest (median), the standard asks >= 12 dB
    rest = fx - voice * g
    vr = [rms(voice[:, ns(w["s"]):ns(w["e"])] * g) - rms(rest[:, ns(w["s"]):ns(w["e"])]) for w in words if w["e"] - w["s"] > 0.05] if has_voice else []
    rep = {"duration_s": round(n / SR, 4), "frames": frames, "with_voice": has_voice, "lufs": round(lufs(fx), 2),
           "true_peak_dbtp": round(float(true_peak(fx)), 2), "music_lufs": round(lufs(music * g), 2), "amb_lufs": round(lufs(amb * g), 2),
           "sfx_lufs": round(lufs(sfx * g), 2), "voice_lufs_in_mix": round(lufs(voice * g), 2) if has_voice else None,
           "voice_minus_rest_median_db": round(float(np.median(vr)), 1) if vr else None,
           "loop_seam_step_db": round(steps[49], 2), "median_step_db": round(float(np.median(steps)), 2)}
    json.dump(rep, open(os.path.join(out, "mix_report.json"), "w"), indent=1)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
