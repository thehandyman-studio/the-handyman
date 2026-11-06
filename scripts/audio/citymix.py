"""Sound for "The City Hidden Inside a Wall" (2026-11-06): own score (4-note celesta motif, 11 sections), miniature city
ambience, room tone, SFX and a LOOP-SAFE mix (everything is placed on a circle: what rings past the end continues at
the start; the limiter also runs on the circle). Plan: shorts/city-in-the-wall/SOUND_PLAN.md.

    .venv/bin/python scripts/audio/citymix.py shorts/city-in-the-wall

Writes shorts/<name>/audio/mix.wav (48 kHz stereo 24-bit, exact video length) + stems + mix_report.json.
Local and free. shortmix.py / sfx_gen.py are only imported (unchanged -> Mary Celeste unchanged).
"""
import json, math, os, re, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import SR, TAU, ns, tt, rng, lp, hp, bp, peq, colored, smooth_noise, ramp, fades, st, pan, widen, make_ir, convolve_st, \
    integrated, true_peak, read_wav, write_wav, dbg, momentary  # noqa: E402
from instruments import pad, pluck, musicbox, glock, timpani, cymbal, brass  # noqa: E402
from sfx_gen import whoosh, creak  # noqa: E402
from shortmix import amb_bed, boom, riser, speech_env, lufs  # noqa: E402
import sfx_city as C  # noqa: E402

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
        raise SystemExit(f"phrase not found: {phrase}")

    def s(self, phrase, nth=0):
        return self.w[self.i(phrase, nth)]["s"]

    def e(self, phrase, nth=0):
        p = phrase.split()
        return self.w[self.i(phrase, nth) + len(p) - 1]["e"]


class Ring:
    """stereo buffer on a circle (the loop)"""
    def __init__(self, n):
        self.n = n
        self.x = np.zeros((2, n))

    def add(self, y, t, g=1.0):
        y = st(y) * g
        i0 = ns(t) % self.n
        L = y.shape[1]
        pos = 0
        while pos < L:
            a = (i0 + pos) % self.n
            k = min(L - pos, self.n - a)
            self.x[:, a:a + k] += y[:, pos:pos + k]
            pos += k


# ======================================================================== score
def chord(root, kind, octs=(0,)):
    iv = {"min": [0, 3, 7], "maj": [0, 4, 7], "sus": [0, 5, 7], "min9": [0, 3, 7, 14], "maj7": [0, 4, 7, 11]}[kind]
    return [m(root, k + 12 * o) for o in octs for k in iv]


def score(W, D, n):
    r = rng(5)
    M = Ring(n)
    beat = D / 64.0                                   # 16 bars of 4/4 fill the loop exactly (83.78 BPM)
    grid = lambda a, b, step=1.0: [k * beat * step for k in range(int(math.ceil(a / (beat * step))), int(b / (beat * step)) + 1)
                                   if a <= k * beat * step < b]
    A4, D5, F5, E5 = 440.0, m(440, 5), m(440, 8), m(440, 7)
    MOT = [A4, D5, F5, E5]                            # the 4-note celesta motif (D minor: 5-1-3-2)
    MOT_MAJ = [A4, D5, m(440, 9), E5]                 # brighter colour (F#)

    def celesta(f, t, v):
        M.add(pan(musicbox(f, v, r, 2.2) * 0.8 + glock(f, v * 0.5, r, 2.2) * 0.35, r.uniform(-0.25, 0.25)), t)

    def motif(t0, notes, v, step=1.0):
        for k, f in enumerate(notes):
            celesta(f, t0 + k * beat * step, v * (1 - 0.1 * k))

    def padc(freqs, t0, t1, v, att=0.6, rel=0.9, warm=900.0):
        M.add(pad(freqs, max(0.2, t1 - t0), v, r, att, rel, warm), t0)

    def pizz(f, t, v):
        M.add(pan(pluck(f, v, r, 0.8, 0.35), r.uniform(-0.5, 0.5)), t)

    t = W.s
    # ---- A 0 - 7.47: mysterious, curious. Impact hit at 0.03 (the loop's goal) decays into a low drone
    M.add(timpani(D2, 1.0, r, 3.0), 0.03, 0.4)
    M.add(st(brass(D2, 0.6, 0.9, r, "stab", -10, 0.4)) * 0.3, 0.03)
    M.add(cymbal(0.7, r, 3.0, 0.8), 0.03, 0.2)
    padc([D2, m(D2, 7), m(D2, 12)], 0.0, 7.6, 0.32, att=0.02, rel=0.6, warm=500)
    for k, tb in enumerate(grid(1.4, 7.4)):
        pizz([m(D2, 12), m(D2, 19), m(D2, 15), m(D2, 19)][k % 4], tb, 0.32 + 0.04 * (k % 2 == 0))
    motif(t("discovered") + 0.25, MOT, 0.32)
    for w in ("insulation", "bricks", "pipes"):         # dry muted 'tock' for every red cross
        M.add(pluck(m(D2, 5), 0.9, r, 0.25, 0.1), t(w) + 0.02, 0.5)
    # ---- B 7.47 - 14.27: wonder, livelier
    tB, tC = t("It was") - 0.05, t("At first") - 0.07
    prog = [(m(D2, 8), "maj"), (m(D2, 3), "maj"), (m(D2, 10), "maj"), (D2, "min")]   # Bb F C Dm
    bar = beat * 4
    for k in range(int((tC - tB) / bar) + 1):
        a = tB + k * bar
        root, kind = prog[k % 4]
        padc(chord(root, kind, (1, 2)), a, min(tC, a + bar), 0.26 + 0.05 * k, att=0.35, rel=0.5, warm=1600)
    for k, tb in enumerate(grid(tB, tC, 0.5)):
        pizz(prog[int((tb - tB) / bar) % 4][0] * (4 if k % 2 else 2), tb, 0.28)
        M.add(st(hp(r.standard_normal(ns(0.05)), 6000) * np.exp(-tt(0.05) / 0.012)) * (0.09 if k % 2 else 0.05), tb)  # shaker
    motif(tB + 0.05, MOT_MAJ, 0.55)
    motif(t("glowing"), [m(f, 12) for f in MOT_MAJ], 0.35, 0.5)
    motif(t("thousands"), MOT_MAJ, 0.6)
    M.add(cymbal(0.4, r, 2.5, 1.2), tB - 0.4, 0.15)
    # ---- C 14.27 - 16.13: small, sly
    padc(chord(D2, "min", (1,)), tC, t("But then") - 0.05, 0.18, att=0.3, warm=800)
    motif(t("thought"), MOT, 0.3, 1.5)
    # ---- D 16.13 - 22.10: growing tension (ostinato, heartbeat)
    tD, tE = t("But then") - 0.07, t("Suddenly") - 0.07
    progD = [(D2, "min"), (m(D2, 8), "maj"), (m(D2, -2), "min"), (m(D2, 7), "maj")]  # Dm Bb Gm A
    for k in range(int((tE - tD) / bar) + 1):
        a = tD + k * bar
        root, kind = progD[k % 4]
        padc(chord(root, kind, (0, 1)), a, min(tE, a + bar), 0.3 + 0.04 * k, att=0.2, rel=0.4, warm=700)
    for k, tb in enumerate(grid(tD, tE, 0.5)):
        pizz(progD[int((tb - tD) / bar) % 4][0] * 2, tb, 0.3 + 0.1 * (tb - tD) / (tE - tD))
    for tb in grid(tD, tE, 1.0):                          # heartbeat (lub-dub)
        if int(round(tb / beat)) % 2 == 0:
            M.add(timpani(D2 * 0.75, 0.55, r, 0.8), tb, 0.5)
            M.add(timpani(D2 * 0.75, 0.35, r, 0.8), tb + 0.22, 0.4)
    tsc = W.e("screaming") - 0.05
    M.add(st(brass(m(D2, 13), 0.25, 0.8, r, "stab", -15, 0.15)) * 0.45, tsc)          # string-ish stab on the scream
    motif(t("looked up"), [m(f, -12) for f in MOT], 0.3)
    # ---- E 22.10 - 26.13: everything stops; a high string; swell on 'Then they all looked up'
    tst = t("stopped")
    M.add(pad([m(D2, 31)], tst - tE + 2.2, 0.12, r, 0.05, 0.6, 3000), tE)                   # high A held
    M.add(pad([D2 * 0.5], 26.2 - tE, 0.25, r, 0.3, 0.6, 200), tE)                            # sub drone
    tal = t("Then they all")
    padc(chord(m(D2, 3), "maj", (1, 2)), tal, t("He slowly"), 0.17, att=1.2, rel=0.6, warm=1200)
    # ---- F 26.13 - 29.70: warm but uncertain
    tF, tG = t("He slowly") - 0.07, t("But one") - 0.07
    padc(chord(m(D2, 3), "maj7", (1,)), tF, tG, 0.2, att=0.5, warm=1000)
    motif(t("raised"), MOT_MAJ, 0.2, 1.25)
    motif(t("waved"), [m(f, 12) for f in MOT_MAJ][:3], 0.28, 0.75)
    # ---- G 29.70 - 35.13: dark, threatening
    tH = t("The handyman froze") - 0.07
    for k, a in enumerate(np.arange(tG, tH, bar)):
        f = [D2 * 0.5, m(D2 * 0.5, -2), m(D2 * 0.5, -4), m(D2 * 0.5, 1)][k % 4]
        M.add(st(brass(f * 2, min(bar, tH - a) - 0.1, 0.55, r, "tuba", -20, 0.3)) * 0.38, a)
        M.add(pad([f, f * 2], min(bar, tH - a), 0.22, r, 0.4, 0.5, 300), a)
    for tb in grid(tG, tH, 2.0):
        M.add(lp(timpani(D2 * 0.6, 0.5, r, 1.0), 500), tb, 0.6)                          # muffled drum
    M.add(timpani(D2, 0.6, r, 1.5), t("held") + 0.07, 0.55)
    for k, f in enumerate([m(f, -24) for f in MOT]):                                      # motif in the low brass
        M.add(st(brass(f, beat * 0.9, 0.5, r, "horn", -15, 0.2)) * 0.35, t("It read") + k * beat)
    tn = t("NEXT")
    M.add(boom(r, 0.22), tn - 0.02)
    M.add(st(brass(D2 * 0.5, 0.5, 1.0, r, "stab", -10, 0.5)) * 0.3, tn)
    # ---- H 35.13 - 36.30: held breath
    M.add(pad([m(D2, 31), m(D2, 34)], t("Then came") - tH, 0.1, r, 0.1, 0.4, 3500), tH)
    # ---- I 36.30 - 38.83: three knocks doubled, accelerating heartbeat
    tJ = t("A tiny voice") - 0.07
    for k, w in enumerate(("three", "loud", "knocks")):
        v = 0.6 + 0.2 * k
        M.add(timpani(D2 * 0.75, v, r, 1.4), t(w), 0.8)
        M.add(st(brass(m(D2, 1 + k), 0.18, v, r, "stab", -12, 0.2)) * 0.4, t(w))
    a, gap = W.e("knocks") + 0.15, 0.42
    while a < tJ - 0.1:
        M.add(timpani(D2 * 0.75, 0.45, r, 0.6), a, 0.35)
        M.add(timpani(D2 * 0.75, 0.3, r, 0.6), a + gap * 0.3, 0.27)
        a += gap
        gap = max(0.22, gap * 0.88)
    M.add(pad([D2, m(D2, 1)], tJ - t("Then came"), 0.22, r, 0.8, 0.4, 600), t("Then came"))
    # ---- J 38.83 - 42.00: eerie, very quiet; nearly only drone under the whisper
    tK = t("The handyman stepped") - 0.07
    M.add(pad([D2 * 0.5, D2, m(D2, 1)], tK - tJ, 0.22, r, 0.6, 0.6, 350), tJ)
    hs, he = t("He's found") - 0.1, W.e("again") + 0.1
    for tb in grid(tJ, tK, 1.0):
        if not hs <= tb <= he:
            M.add(pluck(D2, 0.45, r, 0.9, 0.2), tb, 0.6)
    # ---- K 42.00 - end: climax into the loop
    progK = [(D2, "min"), (m(D2, 8), "maj"), (m(D2, -2), "min"), (m(D2, 7), "maj")]
    for k, a in enumerate(np.arange(tK, D - 0.1, bar / 2)):
        root, kind = progK[k % 4]
        padc(chord(root, kind, (0, 1, 2)), a, min(D - 0.1, a + bar / 2), 0.14 + 0.025 * k, att=0.1, rel=0.3, warm=900 + 300 * k)
    for k, tb in enumerate(grid(tK, D - 0.1, 0.5)):
        pizz(progK[int((tb - tK) / (bar / 2)) % 4][0] * 2, tb, 0.28 + 0.15 * (tb - tK) / (D - tK))
    for k, f in enumerate(MOT):                                                            # the motif as a big statement
        M.add(st(brass(m(f, -12), beat * 0.95, 0.75, r, "horn", -18, 0.2)) * 0.35, tK + 0.1 + k * beat)
        celesta(f, tK + 0.1 + k * beat, 0.35)
    th = t("hammer")
    M.add(timpani(D2, 0.9, r, 1.6), th, 0.55)
    M.add(st(brass(D2, 0.3, 1.0, r, "stab", -10, 0.3)) * 0.5, th)
    # roll + cymbal swell + riser into the loop point, 0.1 s breath before it
    ts = t("struck")
    a, tw = ts, W.w[-1]["e"]                                   # roll stays low under 'struck the wall.', erupts after it
    while a < D - 0.12:
        u = (a - ts) / (D - ts)
        M.add(timpani(D2, (0.15 + 0.1 * u) if a < tw else 0.75, r, 0.5), a, 0.5)
        a += 0.11 - 0.05 * u
    sw = cymbal(0.8, r, D - 0.1 - (ts - 0.3), 1.0)[::-1]                               # reversed cymbal swell
    sw *= np.linspace(0, 1, len(sw)) ** 3
    M.add(sw * 0.45, ts - 0.3)
    rz = riser(r, D - 0.1 - ts)
    rz *= np.linspace(0, 1, rz.shape[1]) ** 2
    M.add(rz, ts, 1.0)
    return M.x


# ======================================================================== ambience
def ambience(W, D, n, places):
    r = rng(21)
    city = np.zeros((2, n))
    city += C.tiny_crowd(D, r, 14) * 1.0
    city += st(lp(colored(n, r, 1.0), 600)) * 0.25                                        # soft city hum
    tcar = 0.6
    while tcar < D - 2:                                                                      # tiny traffic
        d = r.uniform(2.0, 3.2)
        sd = r.choice([-1.0, 1.0])
        y = C.tiny_car(d, r, sd, -sd)
        p = np.zeros((2, n)); i = ns(tcar); k = min(n - i, y.shape[1]); p[:, i:i + k] = y[:, :k]
        city += p * r.uniform(0.25, 0.5)
        tcar += r.uniform(2.5, 5.0)
    for tm in r.uniform(1, D - 1, 5):
        i = ns(tm); h = C.tiny_horn(r); city[:, i:i + len(h)] += pan(h, r.uniform(-0.8, 0.8))[:, :n - i] * 0.25
    for tm in r.uniform(1, D - 1, 4):
        i = ns(tm); h = C.bell(r); city[:, i:i + len(h)] += pan(h, r.uniform(-0.8, 0.8))[:, :n - i] * 0.2
    city += pan(C.cafe(D, r, 0.9), 0.5) * 0.25 + pan(C.tiny_steps(D, r, 9), -0.3) * 0.3
    # place envelope: 1 in city shots, 0.22 + muffled through the hole in room shots
    g_city, g_room = np.zeros(n), np.zeros(n)
    xf = ns(0.12)
    for a, b, pl in places:
        ia, ib = ns(a), ns(b)
        (g_city if pl == "city" else g_room)[ia:ib] = 1.0
    sm = lambda g: np.convolve(g, np.ones(xf) / xf, "same")
    g_city, g_room = sm(g_city), sm(g_room)
    # story automation of the city
    T = np.arange(n) / SR
    auto = np.ones(n)
    ts, tl = W.s("stopped"), W.s("Then they all")
    auto *= np.interp(T, [0, ts - 0.02, ts + 0.06, tl, tl + 0.01, D], [1, 1, 0.0, 0.0, 0.0, 0.0]) + \
        np.interp(T, [0, tl, tl + 0.01, W.s("waved"), W.s("But one"), W.s("A tiny voice"), W.s("A tiny voice") + 0.3,
                      W.s("The handyman stepped"), W.s("struck"), D], [0, 0, 0.15, 0.25, 0.5, 0.5, 0.08, 0.08, 0.35, 0.35]) * (T > tl)
    auto[T < ts] = 1.0
    auto *= np.interp(T, [0, 0.03, 0.3, 1.5, D], [0.35, 0.35, 1.2, 1.0, 1.0])                # start: lifts after the impact
    muff = lp(city, 1400) * 0.22
    amb = city * (g_city * auto) + muff * (g_room * auto)
    # room: tone, distant street, clock (only in room shots)
    room = amb_bed("interior", D, rng(30)) * 0.6 + st(C.clock_ticks(D, r)) * 0.15 + st(lp(colored(n, r, 1.5), 250)) * 0.3
    amb += room * g_room
    return amb, g_city, g_room


# ======================================================================== sfx
def effects(W, D, n):
    r = rng(41)
    X = Ring(n)
    t = W.s
    # 1 breach (0.03) + falling plaster + panic
    X.add(widen(C.plaster_break(r, 1.0), r, 9, 0.4), 0.03, 0.7)
    X.add(widen(C.debris(1.5, r, 7, 1.0, 0.1), r, 7, 0.6), 0.03, 0.4)
    for tm in r.uniform(0.25, 1.3, 6):
        X.add(pan(C.tiny_yelp(r), r.uniform(-0.8, 0.8)), tm, 0.22)
    # 2 room: plaster settles, a chunk on the floor
    X.add(widen(C.debris(1.0, r, 2, 0.6, 0.0), r, 7, 0.5), t("and discovered") - 0.05, 0.3)
    # 5 into the city, 7 window, 8 car
    X.add(widen(whoosh(0.8, r, 0.5, 300, 3000), r, 10, 0.6), t("It was") - 0.45, 0.45)
    X.add(C.tiny_car(1.2, r, -1.0, 1.0, 230), t("little cars") - 0.25, 0.8)
    X.add(pan(C.tiny_horn(r), 0.5), t("little cars") + 0.3, 0.1)
    X.add(pan(C.bell(r), -0.5), t("glowing") + 0.2, 0.25)
    # 11 tiny man looks up / points: cloth accents
    X.add(st(C.rustle(0.25, r, 0.4)), t("looked up"), 0.25)
    X.add(st(C.rustle(0.25, r, 0.4)), t("pointed"), 0.25)
    # 12b tiny scream (in the gap after 'screaming') + 2 more far away
    tsc = W.e("screaming") - 0.02
    X.add(pan(C.tiny_scream(r), 0.15), tsc, 0.35)
    for k in range(2):
        X.add(pan(C.tiny_scream(r, d=0.4), r.choice([-0.7, 0.7])), tsc + 0.12 + 0.1 * k, 0.25)
    # 13 Leo leans: floor creak
    X.add(st(creak(0.7, r, 50, 90)), t("The handyman leaned") + 0.1, 0.25)
    # 15 thousands turn their heads
    X.add(widen(C.rustle(1.0, r, 2.0), r, 9, 0.8), t("looked", 1) - 0.1, 0.12)
    # 17 waving: tiny murmur
    X.add(C.tiny_crowd(1.4, r, 8, 0.6, 6.0), t("waved") - 0.1, 0.25)
    # 18 climbing, roof steps, the sign
    X.add(pan(C.pipe_climb(t("rooftop") - t("climbed") + 0.2, r), 0.2), t("climbed") - 0.25, 0.5)
    for k in range(4):
        X.add(pan(C.tile_step(r), 0.2 - 0.1 * k), t("rooftop") + 0.12 + k * 0.17, 0.45)
    X.add(pan(C.sign_lift(r), 0.1), t("held") + 0.02, 0.45)
    # 21 three knocks (louder each time) + plaster trickle + lamp
    for k, w in enumerate(("three", "loud", "knocks")):
        v = 0.75 + 0.2 * k
        X.add(C.knock(r, v), t(w), 0.8)
        X.add(widen(C.debris(0.6, r, 1, 0.5, 0.05), r, 6, 0.5), t(w) + 0.03, 0.18 * v)
        X.add(pan(C.lamp_jingle(r, v), -0.3), t(w) + 0.02, 0.3)
    # 22 whisper: tiny frightened whispers under John
    tw = t("A tiny voice")
    X.add(C.tiny_whispers(W.e("again") - tw + 0.6, r, 4), tw + 0.2, 0.1)
    X.add(pan(C.tiny_yelp(r), -0.4), t("again") + 0.3, 0.12)
    # 23 Leo steps back
    for k in range(2):
        X.add(pan(C.floor_step(r, 0.8), 0.1), t("stepped") + 0.05 + 0.38 * k, 0.4)
    # 24a blow on the opposite wall + crack
    th = t("hammer")
    X.add(C.knock(r, 1.3), th, 0.75)
    X.add(widen(C.debris(0.9, r, 3, 0.7, 0.05), r, 7, 0.5), th + 0.03, 0.35)
    X.add(pan(C.lamp_jingle(r, 1.2), -0.3), th + 0.03, 0.35)
    # 24b cracks crackle, light hums through the gaps, the hammer swings (the hit itself is the loop start)
    ts = t("struck")
    X.add(widen(C.crack_spread(D - 0.1 - ts, r), r, 8, 0.6), ts, 0.45)
    X.add(st(C.light_hum(D - 0.1 - ts, r)), ts, 0.06)
    X.add(widen(whoosh(0.4, r, 0.32, 200, 1800, 0.8, 0.06, 0.1), r, 8, 0.4), D - 0.42, 0.5)
    return X.x


# ======================================================================== mix
def main():
    sdir = os.path.abspath(sys.argv[1])
    story = json.load(open(os.path.join(sdir, "story.json"), encoding="utf-8"))
    words = json.load(open(os.path.join(sdir, story["words"]), encoding="utf-8"))
    W = Words(words)
    frames = math.ceil((words[-1]["e"] + story.get("tail_s", 0.45)) * FPS)
    D = frames / FPS
    n = ns(D)
    out = os.path.join(sdir, "audio")
    os.makedirs(out, exist_ok=True)

    v, sr = read_wav(os.path.join(sdir, story["voice"]))
    assert sr == SR, sr
    vm = v[0] if v.shape[0] == 1 else v.mean(0)
    voice = np.zeros((2, n))
    voice[:, :min(n, len(vm))] = st(vm)[:, :n]

    # places from the picture's shot list (same words, same rule: a shot starts `lead` frames before its word)
    src = open(os.path.join(os.path.dirname(sdir), "..", "src/videos/city-in-the-wall/story.ts"), encoding="utf-8").read()
    defs = src[src.index("const DEFS"):src.index("export const SHOTS")]
    shots = []
    for mm in re.finditer(r'\{ name: "([^"]+)", place: "(\w+)", start: (null|"[^"]+")(.*?)\n', defs):
        name, place, start, rest = mm.groups()
        lead = int(re.search(r"lead: (\d+)", rest).group(1)) if re.search(r"lead: (\d+)", rest) else 2
        a = 0 if start == "null" else max(0, round(W.s(start.strip('"')) * FPS) - lead)
        shots.append([a / FPS, place])
    places = [(a, shots[i + 1][0] if i + 1 < len(shots) else D, p) for i, (a, p) in enumerate(shots)]

    music = score(W, D, n)
    amb, g_city, g_room = ambience(W, D, n, places)
    sfx = effects(W, D, n)

    # levels: music/ambience ducked under speech + a small dip in the voice band; voice untouched
    duck = speech_env(words, n)
    music, amb = hp(music, 38, 4), hp(amb, 70, 4)                    # no constant sub rumble (only hits/booms go deep, via sfx)
    music *= dbg(-18.5 - lufs(music))
    amb *= dbg(-26.0 - lufs(amb))
    sfx *= dbg(-25.0 - lufs(sfx))
    T = np.arange(n) / SR
    calm = dbg(np.interp(T, [0, 0.09, 0.2, 1.4, 1.8], [0, 0, -7, -7, 0]))     # the impact stays, its tail gives way to 'He broke a hole...'
    music *= calm; sfx *= calm
    sfx = sfx * dbg(-3.0 * duck)
    music = (music - (1 - dbg(-4.0)) * bp(music, 1000, 4000) * duck) * dbg(-10.0 * duck)
    amb = (amb - (1 - dbg(-3.0)) * bp(amb, 1000, 4000) * duck) * dbg(-6.0 * duck)
    mix = voice + music + amb + sfx
    g = dbg(-14.0 - lufs(mix))
    mix *= g
    for x, name in ((voice * g, "voice"), (music * g, "music"), (amb * g, "amb"), (sfx * g, "sfx")):
        write_wav(os.path.join(out, f"stem_{name}.wav"), x)
    # loop-safe limiter: run it on [last 2 s | mix | first 2 s] and keep the middle
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
    # loop seam: level step from the last 20 ms to the first 20 ms vs typical 20 ms steps
    blk = ns(0.02)
    rms = lambda a: 20 * np.log10(np.sqrt(np.mean(a ** 2)) + 1e-9)
    ring = np.concatenate([fx[:, -blk * 50:], fx[:, :blk * 50]], axis=1)
    steps = [abs(rms(ring[:, (k + 1) * blk:(k + 2) * blk]) - rms(ring[:, k * blk:(k + 1) * blk])) for k in range(99)]
    rep = {"duration_s": round(n / SR, 4), "frames": frames, "lufs": round(lufs(fx), 2), "true_peak_dbtp": round(float(true_peak(fx)), 2),
           "voice_lufs_in_mix": round(lufs(voice * g), 2), "music_lufs": round(lufs(music * g), 2), "amb_lufs": round(lufs(amb * g), 2),
           "sfx_lufs": round(lufs(sfx * g), 2), "loop_seam_step_db": round(steps[49], 2), "median_step_db": round(float(np.median(steps)), 2),
           "max_step_db_near_seam": round(float(max(steps)), 2), "places": [(round(a, 2), round(b, 2), p) for a, b, p in places]}
    json.dump(rep, open(os.path.join(out, "mix_report.json"), "w"), indent=1)
    print(json.dumps({k: rep[k] for k in rep if k != "places"}, indent=1))


if __name__ == "__main__":
    main()
