"""Sound effects for THE HANDYMAN Episode 7 "The Elevator Had a Floor That Didn't Exist" (2026-11-09).
All synthesised locally from the project's own DSP kit (dsp.py, instruments.py, sfx_gen.py are only imported, never
changed). Every function returns mono (1-D) or stereo (2, n) float arrays at 48 kHz.
"""
import numpy as np
from dsp import SR, TAU, ns, tt, lp, hp, bp, colored, smooth_noise, fades, st, widen, make_ir, convolve_st, modal, phase
from instruments import glock
from sfx_gen import creak, rattle, clink


# ---------------------------------------------------------------- the panel and the button
def button_click(r, vel=1.0):
    """an old bakelite elevator button: plastic tick + spring"""
    d = 0.12
    t = tt(d)
    y = hp(r.standard_normal(len(t)), 1800) * np.exp(-t / 0.0025) * 1.2
    y += modal(d, [(2300, 0.4, 0.012), (3900, 0.25, 0.008), (5200, 0.15, 0.006)], r)
    y += np.exp(-np.maximum(t - 0.035, 0) / 0.002) * (t > 0.035) * hp(r.standard_normal(len(t)), 2500) * 0.5
    return fades(y * vel, 0.0005, 0.01)


def button13_on(r):
    """THE sound of the 13: a click, an electric 'thunk' into a low hum, and a faint bell overtone (stereo)"""
    d = 1.6
    t = tt(d)
    c = np.pad(button_click(r, 1.1), (0, ns(d) - ns(0.12)))
    zap = bp(r.standard_normal(len(t)), 900, 6000) * np.exp(-t / 0.025) * 0.5
    hum = sum(np.sin(TAU * 55 * k * t) / k for k in (1, 2, 3, 5)) * np.exp(-t / 0.7) * 0.35 * (1 - np.exp(-t / 0.01))
    bell = glock(1318.5, 0.35, r, d)[:len(t)] * 0.6                    # E6: the top of the series motif
    y = c + zap + lp(hum, 900) + bell
    wet = convolve_st(np.pad(y, (0, ns(0.5))), make_ir(0.7, 13, hf=1.5))
    return np.pad(st(y), ((0, 0), (0, ns(0.5)))) + wet * 0.25


def screw_turn(dur, r):
    """screwdriver squeaking a stiff old screw: stick-slip ticks in bursts"""
    n = ns(dur)
    y = np.zeros(n)
    tm = 0.0
    while tm < dur - 0.02:
        L = 0.006
        k = hp(r.standard_normal(ns(L)), 3000) * np.exp(-tt(L) / 0.0012)
        i = ns(tm); y[i:i + len(k)] += k[:max(0, n - i)] * r.uniform(0.3, 0.9)
        tm += r.uniform(0.012, 0.03) if (tm * 3) % 1 < 0.7 else r.uniform(0.06, 0.1)
    return y + creak(dur, r, 300, 420) * 0.15


def cover_open(r):
    """the brass cover plate swings open: metal scrape + hinge creak + a light clank"""
    d = 0.8
    y = creak(0.55, r, 200, 320) * 0.5
    y = np.pad(y, (0, ns(d) - len(y)))
    y += bp(colored(ns(d), r, 0.5), 1500, 7000) * np.exp(-tt(d) / 0.15) * 0.15
    y[ns(0.5):ns(0.5) + ns(0.12)] += clink(r, 1400, 0.12)[:ns(0.12)] * 0.5
    return y


def cover_close(r):
    d = 0.4
    t = tt(d)
    y = modal(d, [(620, 1.0, 0.05), (1450, 0.6, 0.03), (2800, 0.3, 0.02)], r) * 0.8
    y += lp(r.standard_normal(len(t)), 2500) * np.exp(-t / 0.004) * 0.8
    return y


# ---------------------------------------------------------------- doors, motor, cables
def doors_slide(dur, r, close=True):
    """sliding car doors: rollers rumble on a track, a rattle, and a solid meeting clunk (close) or end stop (open)"""
    n = ns(dur + 0.6)
    t = np.arange(n) / SR
    env = np.clip(t / 0.08, 0, 1) * np.clip((dur - t) / 0.12, 0, 1)
    roll = lp(colored(n, r, 1.2), 400) * (0.6 + 0.4 * smooth_noise(n, r, 12)) * env
    rat = rattle(dur, r, 18.0, None, heavy=True)
    rat = np.pad(rat, (0, n - len(rat))) * 0.18
    y = roll * 0.8 + rat
    end = ns(dur)
    hit = modal(0.5, [(110, 1.0, 0.12), (240, 0.7, 0.07), (530, 0.4, 0.04), (1180, 0.2, 0.02)], r)
    hit += lp(r.standard_normal(ns(0.5)), 1800) * np.exp(-tt(0.5) / 0.006)
    y[end:end + len(hit)] += hit[:n - end] * (1.2 if close else 0.5)
    return y


def motor_start(dur, r):
    """the hoist motor spins up: a rising whine + relay clack + low growl (stereo)"""
    n = ns(dur)
    t = np.arange(n) / SR
    u = np.clip(t / dur, 0, 1)
    f = 45 + 70 * u ** 0.6
    whine = np.sin(phase(f * 4)) * 0.25 + np.sin(phase(f * 8.02)) * 0.1
    growl = lp(colored(n, r, 1.6), 160) * 0.9
    y = (whine + growl) * np.clip(t / 0.25, 0, 1)
    rel = modal(0.15, [(900, 1, 0.01), (2100, 0.5, 0.006)], r) * 0.6
    y[:len(rel)] += rel
    return widen(y, r, 9, 0.5)


def descent(dur, r, accel=1.0):
    """the fall: cable hiss, rail rumble getting faster, rhythmic guide-shoe clacks speeding up, sub rumble (stereo)"""
    n = ns(dur)
    t = np.arange(n) / SR
    u = t / dur
    sub = lp(colored(n, r, 2.0), 70) * (0.5 + 0.7 * u) * 1.4
    c = colored(n, r, 1.3)
    rumble = (lp(c, 300) * (1 - u) + lp(c, 800) * u) * (0.4 + 0.6 * u)
    hiss = bp(colored(n, r, 0.5), 1800, 7000) * (0.05 + 0.25 * u ** 1.5)
    y = sub + rumble + hiss
    # rail joints: clack-clack, interval from 0.55 s to 0.09 s
    tm, gap = 0.2, 0.55
    while tm < dur - 0.05:
        k = modal(0.18, [(180, 1.0, 0.04), (420, 0.6, 0.025), (1100, 0.3, 0.012)], r) + lp(r.standard_normal(ns(0.18)), 3000) * np.exp(-tt(0.18) / 0.004) * 0.6
        i = ns(tm); L = min(len(k), n - i); y[i:i + L] += k[:L] * (0.5 + 0.5 * tm / dur)
        tm += gap
        gap = max(0.09, gap * (0.9 - 0.04 * accel))
    return widen(y, r, 12, 0.7)


def metal_shake(r, vel=1.0):
    """the whole car rattles once (a jolt)"""
    d = 0.9
    y = rattle(d, r, 60, np.exp(-np.linspace(0, 5, ns(d))), heavy=True) * 0.6
    y = np.pad(y, (0, max(0, ns(d) - len(y))))[:ns(d)]
    y += modal(d, [(95, 1.0, 0.2), (210, 0.6, 0.12), (460, 0.35, 0.06)], r) * 0.8
    return widen(y * vel, r, 8, 0.6)


def flicker(dur, r):
    """fluorescent / old bulb flicker: buzz bursts with dropouts (mono)"""
    n = ns(dur)
    t = np.arange(n) / SR
    buzz = sum(np.sin(TAU * 120 * k * t) / k ** 1.2 for k in range(1, 9)) * 0.3
    gate = (smooth_noise(n, r, 9.0) > -0.1).astype(float)
    gate = np.convolve(gate, np.ones(ns(0.004)) / ns(0.004), "same")
    ticks = hp(r.standard_normal(n), 3000) * (r.uniform(0, 1, n) < 0.0015) * 3
    return lp(buzz, 4000) * gate + ticks * (1 - gate)


def hard_stop(r):
    """the brakes bite: a screech, a deep slam that shakes everything, then a settling creak (stereo)"""
    d = 2.6
    t = tt(d)
    scr = bp(np.sin(phase(1900 - 900 * np.clip(t / 0.5, 0, 1))) + 0.4 * r.standard_normal(len(t)), 900, 4000) * np.exp(-t / 0.18) * 0.35
    slam = np.sin(phase(48 * (1 + 0.8 * np.exp(-t / 0.03)))) * np.exp(-t / 0.5) * 1.6
    slam += modal(d, [(85, 0.8, 0.35), (190, 0.6, 0.2), (420, 0.4, 0.1), (900, 0.2, 0.05)], r)
    slam += lp(r.standard_normal(len(t)), 1500) * np.exp(-t / 0.02) * 0.8
    y = scr + slam
    c = creak(1.2, r, 60, 40) * 0.25
    i = ns(0.9); y[i:i + len(c)] += c[:len(y) - i]
    wet = convolve_st(np.pad(y, (0, ns(1.0))), make_ir(1.6, 31, hf=1.8))
    return np.pad(st(y), ((0, 0), (0, ns(1.0)))) + wet * 0.35


def ding(r, vel=1.0):
    """the arrival bell: an old two-tone chime, slightly out of tune (stereo, with the cave's echo)"""
    d = 2.4
    y = glock(1046.5, 0.7 * vel, r, d)[:ns(d)] * 0.8
    y2 = glock(830.6, 0.6 * vel, r, d)[:ns(d - 0.18)]
    y[ns(0.18):ns(0.18) + len(y2)] += y2
    y = lp(y, 5000)
    return y


# ---------------------------------------------------------------- the cave
def cave_air(dur, r):
    """the empty city: distant wind through streets, a very low pressure drone, far water drips, a far metallic
    groan now and then (stereo, no voices, nothing alive)"""
    n = ns(dur)
    t = np.arange(n) / SR
    wind = bp(colored(n, r, 1.0), 180, 1400) * (0.5 + 0.5 * smooth_noise(n, r, 0.25)) * 0.8
    whistle = bp(colored(n, r, 0.3), 700, 900) * np.clip(smooth_noise(n, r, 0.12), 0, 1) * 0.12
    drone = lp(colored(n, r, 2.0), 90) * 0.6 + np.sin(TAU * 36.7 * t) * 0.05
    y = widen(wind + whistle, r, 17, 0.9) + st(drone)
    for tm in np.arange(r.uniform(0.3, 1.0), dur, 1.1):           # far drips with long echoes
        d = modal(0.4, [(r.uniform(1600, 2600), 1.0, 0.02)], r) * 0.08
        wet = convolve_st(np.pad(d, (0, ns(2.5))), make_ir(3.5, int(tm * 100) % 97 + 3, hf=1.4))
        i = ns(tm); L = min(wet.shape[1], n - i)
        if L > 0:
            y[:, i:i + L] += wet[:, :L] * 0.8
    for tm in r.uniform(1.0, max(1.5, dur - 2), max(1, int(dur / 9))):  # far groans of old steel
        g = creak(1.8, r, 30, 22) * 0.12
        wet = convolve_st(np.pad(g, (0, ns(3.0))), make_ir(4.0, 77, hf=1.8))
        i = ns(tm); L = min(wet.shape[1], n - i)
        if L > 0:
            y[:, i:i + L] += wet[:, :L]
    return y


def tension_high(dur, r):
    """thin high string-like tension tone with a slow tremolo (for 'he saw himself')"""
    t = tt(dur)
    f = 2793.0
    y = (np.sin(TAU * f * t) + 0.5 * np.sin(TAU * f * 1.003 * t)) * (0.7 + 0.3 * np.sin(TAU * 5.5 * t))
    y += bp(colored(len(t), r, 0.3), 2500, 3200) * 0.3
    return fades(y * 0.25, min(0.6, dur * 0.4), min(0.4, dur * 0.3))


def footstep(r, vel=1.0, hard=True):
    d = 0.3
    t = tt(d)
    y = lp(r.standard_normal(len(t)), 1800 if hard else 900) * np.exp(-t / 0.012) * 0.9
    y += np.sin(TAU * 95 * t) * np.exp(-t / 0.03) * 0.5
    y += bp(r.standard_normal(len(t)), 2500, 6000) * np.exp(-np.maximum(t - 0.03, 0) / 0.02) * (t > 0.03) * 0.15
    return y * vel


def hall_tone(dur, r):
    """the 12th-floor hall: soft room tone, a distant radio murmur, the building's hum"""
    n = ns(dur)
    t = np.arange(n) / SR
    y = lp(colored(n, r, 1.3), 500) * 0.5
    y += bp(colored(n, r, 0.5), 300, 2500) * (0.5 + 0.5 * np.sin(TAU * 3.1 * t + smooth_noise(n, r, 1) * 3)) * 0.04
    y += lp(np.sin(TAU * 60 * t) * 0.03, 400)
    return widen(y, r, 11, 0.6)
