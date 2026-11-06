"""Sounds for "The City Hidden Inside a Wall" (2026-11-06): miniature city, plaster breach, knocks, tiny voices.
Built only from the existing local building blocks (dsp / sfx_gen / instruments); sfx_gen.py itself is unchanged,
so Mary Celeste's sound stays identical. All functions return mono numpy arrays at 48 kHz unless noted (stereo = (2, n)).
"""
import numpy as np
from dsp import SR, TAU, ns, tt, lp, hp, bp, peq, colored, smooth_noise, fades, phase, modal, pan, st, widen, make_ir, convolve_st
from sfx_gen import vox, vowel_track, _track, _place_mono, babble, clink, rattle, creak, whoosh, hammer_hit, wood_crack, WOOD, TIMBER

TINY = 1.65  # formant scale of the miniature people (small heads -> higher formants)


# ---------------------------------------------------------------- tiny people
def tiny_voice(r, segs, fpts, d, base, amp_pts=None, breath=0.25, scale=TINY):
    n = ns(d)
    t = np.arange(n) / SR
    f0 = base * _track(n, fpts, t)
    amp = _track(n, amp_pts or [(0, 0), (0.03, 1), (d * 0.75, 0.8), (d, 0)], t)
    return vox(f0, vowel_track(n, segs), amp, r, scale, tilt=1.0, breath=breath, fmax=9000)


def tiny_scream(r, base=None, d=None):
    """small, high, panicked 'aaah!' (rises, wobbles, falls)"""
    base, d = base or r.uniform(560, 700), d or r.uniform(0.45, 0.6)
    vib = lambda k: [(k * d / 6, 1.0 + 0.04 * (-1) ** k) for k in range(1, 6)]
    y = tiny_voice(r, [(0, "a"), (d * 0.6, "ae"), (d, "a")], [(0, 0.85), (0.06, 1.15)] + vib(1)[1:] + [(d, 0.8)], d, base,
                   [(0, 0), (0.02, 1), (d * 0.7, 0.9), (d, 0)], breath=0.4)
    return fades(hp(y, 300), 0.002, 0.03)


def tiny_yelp(r):
    kind = r.integers(3)
    d = r.uniform(0.16, 0.32)
    base = r.uniform(420, 640)
    segs = [[(0, "E"), (d, "i")], [(0, "o"), (d, "U")], [(0, "a"), (d, "A")]][kind]
    return fades(hp(tiny_voice(r, segs, [(0, 1.1), (d * 0.3, 1.3), (d, 0.85)], d, base, breath=0.45), 300), 0.002, 0.02)


def tiny_crowd(dur, r, voices=14, active=0.75, rate=5.0):
    """stereo babble of tiny townspeople"""
    out = np.zeros((2, ns(dur)))
    for v in range(voices):
        y = babble(dur, r, r.uniform(260, 420), TINY * r.uniform(0.92, 1.08), rate * r.uniform(0.85, 1.2), active, fmax=7000)
        y = hp(y, 250)
        out += pan(y * r.uniform(0.4, 1.0), r.uniform(-0.95, 0.95))
    return out / np.sqrt(voices)


def tiny_whispers(dur, r, voices=4):
    """breathy tiny whispers: noise through moving formants with syllable bursts (no pitch)"""
    n = ns(dur)
    out = np.zeros((2, n))
    for v in range(voices):
        t = np.arange(n) / SR
        syl = np.clip(np.sin(TAU * r.uniform(3.5, 5.5) * t + r.uniform(0, TAU)), 0, None) ** 1.5
        gate = (smooth_noise(n, r, 0.8) > -0.2).astype(float)
        nz = colored(n, r, 0.3)
        y = sum(g * bp(nz, f * TINY * 0.9, f * TINY * 1.15, 2) for f, g in ((700, 0.6), (1200, 1.0), (2500, 0.7), (3300, 0.4)))
        y = lp(y * syl * lp(gate, 8), 9000)
        out += pan(y * r.uniform(0.5, 1.0), r.uniform(-0.7, 0.7))
    return out / np.sqrt(voices)


def rustle(dur, r, density=1.0):
    """many tiny bodies turning: soft cloth swish cloud"""
    n = ns(dur)
    y = np.zeros(n)
    for k in range(int(40 * dur * density)):
        L = r.uniform(0.08, 0.25)
        tl = tt(L)
        g = bp(r.standard_normal(len(tl)), r.uniform(1500, 3000), r.uniform(5000, 9000), 1) * np.sin(np.pi * tl / L) ** 2
        _place_mono(y, g * r.uniform(0.2, 1.0), r.uniform(0, max(0.01, dur - L)))
    return y


# ---------------------------------------------------------------- miniature traffic & street
def tiny_car(dur, r, p0=-1.0, p1=1.0, f0=None):
    """small engine buzzing past (doppler, stereo movement)"""
    n = ns(dur)
    t = np.arange(n) / SR
    u = t / dur
    f0 = f0 or r.uniform(190, 260)
    f = f0 * (1.06 - 0.12 * (1 / (1 + np.exp(-(u - 0.5) * 10))))           # doppler drop when passing
    ph = phase(f)
    y = sum(np.sin(k * ph) / k ** 0.8 for k in range(1, 18))
    y = bp(y * (1 + 0.3 * np.sin(TAU * 24 * t)), 300, 5000, 1) + 0.25 * bp(r.standard_normal(n), 2000, 7000, 1)
    env = np.exp(-((u - 0.5) / 0.22) ** 2)
    m = y * env
    p = p0 + (p1 - p0) * u
    th = (np.clip(p, -1, 1) + 1) * np.pi / 4
    return np.stack([m * np.cos(th), m * np.sin(th)]) * np.sqrt(2)


def tiny_horn(r):
    out = np.zeros(ns(0.4))
    for k, (a, b) in enumerate([(0.0, 0.09), (0.14, 0.26)]):
        tl = tt(b - a)
        sq = np.sign(np.sin(TAU * 1250 * tl)) * 0.5 + np.sign(np.sin(TAU * 1580 * tl)) * 0.5
        _place_mono(out, lp(sq, 6000) * np.sin(np.pi * tl / (b - a)) ** 0.3, a)
    return out


def bell(r):
    out = np.zeros(ns(0.8))
    for k in range(2):
        _place_mono(out, modal(0.6, [(3600, 1, 0.25), (3600 * 2.4, 0.4, 0.1), (3600 * 3.9, 0.2, 0.05)], r), k * 0.12)
    return out


def cafe(dur, r, rate=1.2):
    y = np.zeros(ns(dur))
    tm = r.uniform(0, 0.5)
    while tm < dur - 0.2:
        _place_mono(y, clink(r, r.uniform(3500, 7000), 0.12, 0.7) * r.uniform(0.3, 1.0), tm)
        tm += r.exponential(1 / rate)
    return y


def tiny_steps(dur, r, rate=7.0):
    """light patter of many tiny feet on paving"""
    y = np.zeros(ns(dur))
    tm = 0.0
    while tm < dur - 0.05:
        L = 0.04
        tl = tt(L)
        s = bp(r.standard_normal(len(tl)), 1500, 7000, 1) * np.exp(-tl / 0.006)
        _place_mono(y, s * r.uniform(0.2, 1.0), tm)
        tm += r.exponential(1 / rate)
    return y


# ---------------------------------------------------------------- the wall
def plaster_break(r, big=1.0):
    """hammer through plaster: steel hit, crunch of breaking plaster and lath, low body (mono)"""
    d = 1.6
    t = tt(d)
    y = hammer_hit(r, 0.8)
    y = np.pad(y, (0, ns(d) - len(y)))
    crunch = np.zeros(ns(d))
    for i in range(60):
        tm = abs(r.normal(0, 0.05)) + (0.0 if i < 3 else r.uniform(0, 0.25))
        L = r.uniform(0.01, 0.04)
        g = bp(r.standard_normal(ns(L)), r.uniform(800, 2500), r.uniform(3500, 9000), 1) * np.exp(-tt(L) / (L / 3))
        _place_mono(crunch, g * r.uniform(0.3, 1.0) * np.exp(-tm / 0.15), tm)
    body = np.exp(-t / 0.25) * np.sin(phase(48 * (1 + 0.6 * np.exp(-t / 0.02)))) * 1.4
    wc = wood_crack(r)[: ns(d)] * 0.45
    return fades((y * 0.9 + crunch * 1.3 + body + np.pad(wc, (0, ns(d) - len(wc)))) * big, 0.0, 0.2)


def debris(dur, r, chunks=6, trickle=1.0, t0=0.0):
    """falling plaster: a few chunks hitting stone + a fine sand/crumb trickle that thins out (mono)"""
    n = ns(dur)
    y = np.zeros(n)
    for k in range(chunks):
        tm = t0 + r.uniform(0.05, dur * 0.6)
        c = modal(0.25, [(r.uniform(700, 1400), 1, 0.012), (r.uniform(1800, 3200), 0.6, 0.008), (r.uniform(180, 320), 0.7, 0.03)], r)
        c += bp(r.standard_normal(ns(0.25)), 600, 6000, 1) * np.exp(-tt(0.25) / 0.006) * 0.6
        _place_mono(y, c * r.uniform(0.4, 1.0), tm)
        for b in range(r.integers(1, 3)):                                    # small bounce
            _place_mono(y, c * r.uniform(0.15, 0.35), tm + r.uniform(0.06, 0.15) * (b + 1))
    t = np.arange(n) / SR
    env = np.exp(-np.maximum(t - t0, 0) / (dur * 0.35)) * (t >= t0)
    crumbs = hp(r.standard_normal(n), 2500) * (r.uniform(0, 1, n) < 0.004) * 6
    sand = bp(colored(n, r, 0.5), 2000, 9000, 1) * 0.25
    return y + (crumbs + sand) * env * trickle


def knock(r, vel=1.0):
    """a heavy fist knock heard THROUGH a wall: muffled, low, with a short room (stereo)"""
    d = 0.7
    t = tt(d)
    thump = np.exp(-t / 0.09) * np.sin(phase(72 * (1 + 0.5 * np.exp(-t / 0.012)))) * 1.6
    wood = modal(d, [(168, 1.0, 0.07), (390, 0.7, 0.04), (760, 0.4, 0.025), (1250, 0.2, 0.015)], r, glide=0.02)
    hit = lp(r.standard_normal(len(t)), 1800) * np.exp(-t / 0.006) * 1.1
    y = lp(thump + wood * 0.9 + hit, 2600) * vel
    s = st(y)
    wet = convolve_st(np.pad(y, (0, ns(0.6))), make_ir(0.45, 7, hf=2.0))
    return np.pad(s, ((0, 0), (0, ns(0.6)))) + wet * 0.25


def lamp_jingle(r, vel=1.0):
    return rattle(0.35, r, 40, np.exp(-np.linspace(0, 4, ns(0.35))), heavy=False) * 0.4 * vel


def crack_spread(dur, r):
    """plaster cracking: sparse sharp ticks getting denser + a low groan (mono)"""
    n = ns(dur)
    y = np.zeros(n)
    tm = 0.0
    while tm < dur:
        u = tm / dur
        L = 0.012
        c = hp(r.standard_normal(ns(L)), 2000) * np.exp(-tt(L) / 0.002)
        _place_mono(y, c * r.uniform(0.3, 1.0) * (0.4 + 0.6 * u), tm)
        tm += r.exponential(0.09 * (1.2 - u))
    g = creak(dur, r, 35, 70, TIMBER, [(0, 0), (0.3, 0.6), (1.0, 1.0)], 0.2, 0.05)
    return y + g * 0.6


def light_hum(dur, r):
    t = tt(dur)
    h = sum(np.sin(TAU * 100 * k * t + r.uniform(0, TAU)) / k ** 1.3 for k in range(1, 12))
    return lp(h, 3000) * (0.8 + 0.2 * smooth_noise(len(t), r, 6.0))


# ---------------------------------------------------------------- the climber & room
def pipe_climb(dur, r):
    y = np.zeros(ns(dur))
    tm = 0.05
    while tm < dur - 0.1:
        _place_mono(y, clink(r, r.uniform(1100, 2000), 0.12, 0.6) * r.uniform(0.5, 1.0), tm)          # hand on the pipe
        L = r.uniform(0.08, 0.16)
        sc = bp(r.standard_normal(ns(L)), 1500, 6000, 1) * np.sin(np.pi * tt(L) / L) ** 2 * 0.35          # shoe scrape
        _place_mono(y, sc, tm + r.uniform(0.04, 0.1))
        tm += r.uniform(0.18, 0.3)
    return y


def tile_step(r):
    d = 0.18
    t = tt(d)
    clack = modal(d, [(r.uniform(1600, 2400), 1, 0.012), (r.uniform(3500, 4800), 0.5, 0.006)], r)
    thud = np.exp(-t / 0.02) * np.sin(TAU * r.uniform(260, 340) * t) * 0.5
    return fades(clack + thud + bp(r.standard_normal(len(t)), 2000, 8000, 1) * np.exp(-t / 0.004) * 0.3, 0.0, 0.03)


def sign_lift(r):
    y = np.pad(whoosh(0.35, r, 0.12, 900, 4500, 0.7, 0.12, 0.2) * 0.6, (0, ns(0.2)))
    board = modal(0.3, [(420, 1, 0.03), (980, 0.6, 0.02), (1900, 0.3, 0.01)], r)
    _place_mono(y, board * 0.8, 0.16)
    return y


def floor_step(r, vel=1.0):
    d = 0.35
    t = tt(d)
    heel = np.exp(-t / 0.035) * np.sin(phase(r.uniform(85, 110) * (1 + 0.2 * np.exp(-t / 0.01))))
    plank = modal(d, [(r.uniform(160, 220), 0.6, 0.04), (r.uniform(380, 520), 0.35, 0.02)], r)
    return fades((heel + plank) * vel, 0.0, 0.05)


def clock_ticks(dur, r):
    y = np.zeros(ns(dur))
    for k, tm in enumerate(np.arange(0.2, dur, 1.0)):
        c = modal(0.05, [(2600 if k % 2 else 3100, 1, 0.006), (5200, 0.4, 0.003)], r)
        _place_mono(y, c, tm)
    return y
