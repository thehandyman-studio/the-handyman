"""Check report for snap_words.py on the Mary Celeste v1 copy (test folder only; read-only on all inputs).

    .venv/bin/python -I voice-lab/2026-11-05_snap-mary-celeste/check_snap.py   -> PRUEFBERICHT.md
"""
import json
import os
import re
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(PROJECT, "shorts", "bridge", "audio"))
from dsp import read_wav  # noqa: E402

T = os.path.join(HERE, "voice", "takes", "v1_wyman")
FPS = 30
old = json.load(open(os.path.join(T, "words.json")))
new = json.load(open(os.path.join(T, "words_snapped.json")))
rep = json.load(open(os.path.join(T, "snap_report.json")))
ref = open(os.path.join(HERE, "voice", "narration.txt")).read().split()
x, sr = read_wav(os.path.join(T, "voice.wav"))
x = x[0]
h = sr // 100
env = 20 * np.log10(np.sqrt((x[: len(x) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-9)
thr = rep["threshold_dbfs"]
silent = env < thr
fr = lambda t: int(round(t * 100))
L = []
P = L.append


def in_sil(w):
    return silent[fr(w["s"]):fr(w["e"])].sum() / 100


def level(w):
    seg = env[fr(w["s"]):max(fr(w["e"]), fr(w["s"]) + 1)]
    return float(np.percentile(seg, 90))


# ---------------------------------------------------------------- 1 integrity
nrm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())
same_words = [w["w"] for w in new] == [w["w"] for w in old]
same_ref = [nrm(w["w"]) for w in new] == [nrm(t) for t in ref]
mono = all(a["s"] < a["e"] <= b["s"] + 1e-9 for a, b in zip(new, new[1:]))
overl = [(a["w"], b["w"]) for a, b in zip(new, new[1:]) if a["e"] > b["s"] + 1e-9]
P("# Prüfbericht: Wortzeit-Korrektur an der vollständigen Mary-Celeste-Aufnahme\n")
P("Datum: 2026-11-05 · Aufnahme: Kopie von **v1 (Wyman, automatisch erzeugt)**, 60,6 s, 156 Wörter · "
  f"Verfahren: `snap_words.py` unverändert · Schwelle {thr} dBFS, Pausen ab {rep['min_pause_s']} s\n")
P("## 1. Vollständigkeit")
P(f"- Wörter: {len(new)} (vorher {len(old)}, Referenz `narration.txt` {len(ref)})")
P(f"- Gleiche Wörter in gleicher Reihenfolge wie vorher: **{'ja' if same_words else 'NEIN'}** · "
  f"wie `narration.txt`: **{'ja' if same_ref else 'NEIN'}**")
P(f"- Fehlende oder doppelte Wörter: **{'keine' if same_ref else 'siehe oben'}** · Zeiten fortlaufend ohne Überlappung: "
  f"**{'ja' if mono else 'NEIN ' + str(overl)}**\n")

# ---------------------------------------------------------------- 2 old vs new
sil_old, sil_new = sum(in_sil(w) for w in old), sum(in_sil(w) for w in new)
shift_s = np.array([n["s"] - o["s"] for o, n in zip(old, new)])
P("## 2. Alt gegen korrigiert")
P(f"- Zeit, in der ein Wort „läuft“, obwohl das Audio still ist: **{sil_old:.2f} s → {sil_new:.2f} s**")
P(f"- Verschiebung der Wortanfänge: Median {np.median(np.abs(shift_s))*1000:.0f} ms, "
  f"95 % unter {np.percentile(np.abs(shift_s), 95)*1000:.0f} ms, max {np.abs(shift_s).max()*1000:.0f} ms")
top = sorted(range(len(new)), key=lambda i: -abs(shift_s[i]))[:6]
P("\n| Wort (#) | alt | korrigiert | Verschiebung Anfang |\n|---|---|---|---|")
for i in sorted(top):
    P(f"| {new[i]['w']} (#{i+1}) | {old[i]['s']:.2f}–{old[i]['e']:.2f} | {new[i]['s']:.2f}–{new[i]['e']:.2f} | {shift_s[i]*1000:+.0f} ms |")

# ---------------------------------------------------------------- 3 pauses
placed = {int(k.split("#")[1].rstrip(")")) - 1: v for k, v in rep["pause_after_word"].items()}
punct = lambda w: bool(re.search(r"[.?!,:;…—]$", w))
no_punct_pause = [(i, placed[i]) for i in sorted(placed) if not punct(new[i]["w"])]
punct_no_pause = [i for i in range(len(new) - 1) if punct(new[i]["w"]) and i not in placed]
durs = np.array([b - a for a, b in placed.values()])
P("\n## 3. Pausen")
P(f"- Gefunden {len(rep['pauses'])}, zugeordnet {len(placed)}, nicht zugeordnet {len(rep['pauses_not_placed'])}")
P(f"- Längen: kurz 0,15–0,30 s: {int(((durs>=.15)&(durs<.3)).sum())} · mittel 0,30–0,60 s: {int(((durs>=.3)&(durs<.6)).sum())} · "
  f"lang ≥ 0,60 s: {int((durs>=.6).sum())} (längste {durs.max():.2f} s)")
P(f"- Pausen **ohne** Satzzeichen davor: {len(no_punct_pause)}" + (": " + ", ".join(
    f"nach „{new[i]['w']}“ (#{i+1}, {b-a:.2f} s)" for i, (a, b) in no_punct_pause) if no_punct_pause else ""))
P(f"- Satzzeichen **ohne** messbare Pause (fließend gesprochen): {len(punct_no_pause)}" + (": " + ", ".join(
    f"„{new[i]['w']}“ (#{i+1})" for i in punct_no_pause) if punct_no_pause else ""))
ends = [i for i in range(len(new)) if re.search(r"[.?!]$", new[i]["w"])]
ok_end = [i for i in ends if i in placed or i == len(new) - 1]
P(f"- Satzenden (. ? !): {len(ends)}, davon mit Pause bzw. Aufnahmeende: {len(ok_end)}; "
  f"Wortende = Beginn der gemessenen Stille bei allen zugeordneten Pausen: "
  f"{'ja' if all(abs(new[i]['e'] - placed[i][0]) < 0.011 for i in placed) else 'NEIN'}")
last = new[-1]
P(f"- Letztes Wort endet {last['e']:.2f} s, Sprache endet {rep['speech_end_s']:.2f} s (vorher {old[-1]['e']:.2f} s)")

# ---------------------------------------------------------------- 4 breathing
# low-level, non-silent stretches before a word that follows a pause: the caption would appear on the breath
P("\n## 4. Atemgeräusche")
loud_thr = np.percentile(env[~silent], 50) - 18     # clearly voiced level
breath = []
for i in placed:
    j = i + 1
    s = fr(new[j]["s"])
    k = s
    while k < len(env) and env[k] < loud_thr and k - s < 60:
        k += 1
    pre = (k - s) / 100
    if pre >= 0.12:
        breath.append((j, pre, float(env[s:k].max()) if k > s else None))
# breaths that are long enough to be "speech" inside a pause region: low-level runs between thr and loud_thr
runs, st = [], None
quiet_but_not_silent = (~silent) & (env < loud_thr)
for i_, q in enumerate(np.append(quiet_but_not_silent, False)):
    if q and st is None:
        st = i_
    if not q and st is not None:
        if (i_ - st) >= 15:
            runs.append((st / 100, i_ / 100))
        st = None
P(f"- Grenze „deutlich gesprochen“: {loud_thr:.1f} dBFS (Median der Sprache − 18 dB)")
P(f"- Wörter nach einer Pause, deren korrigierter Anfang **≥ 120 ms vor** dem deutlich hörbaren Einsatz liegt "
  f"(wahrscheinlich Einatmen oder leiser Anlaut): **{len(breath)}**")
if breath:
    P("\n| Wort (#) | korrigierter Anfang | Vorlauf bis deutlicher Einsatz | Pegel im Vorlauf |\n|---|---|---|---|")
    for j, pre, mx in breath:
        P(f"| {new[j]['w']} (#{j+1}) | {new[j]['s']:.2f} s | {pre*1000:.0f} ms | max {mx:.0f} dBFS |")
P(f"- Längere leise Abschnitte (≥ 150 ms über der Stilleschwelle, aber unter der Sprachgrenze): {len(runs)}"
  + (": " + ", ".join(f"{a:.2f}–{b:.2f} s" for a, b in runs[:12]) if runs else ""))

# ---------------------------------------------------------------- 5 quiet words
lv = np.array([level(w) for w in new])
med = np.median(lv)
quiet_w = [i for i in range(len(new)) if lv[i] < med - 12]
P("\n## 5. Leise gesprochene Wörter")
P(f"- Median-Pegel der Wörter {med:.1f} dBFS; Wörter mehr als 12 dB leiser: **{len(quiet_w)}**"
  + (": " + ", ".join(f"„{new[i]['w']}“ (#{i+1}, {lv[i]:.0f} dB, {in_sil(new[i])*1000:.0f} ms in Stille)" for i in quiet_w) if quiet_w else ""))

# ---------------------------------------------------------------- 6 durations / display
d = np.array([w["e"] - w["s"] for w in new])
nxt = [new[i + 1]["s"] if i + 1 < len(new) else new[i]["e"] for i in range(len(new))]
# display rule from the skill: word stays until the next word starts; in pauses >= 0.6 s it clears 0.15 s after its end
disp = np.array([(new[i]["e"] + 0.15 - new[i]["s"]) if nxt[i] - new[i]["e"] >= 0.6 else (nxt[i] - new[i]["s"])
                 for i in range(len(new))])
P("\n## 6. Einblendedauer der Untertitel")
P(f"- Gesprochene Wortdauer: Median {np.median(d)*1000:.0f} ms, max {d.max():.2f} s („{new[int(d.argmax())]['w']}“)")
P(f"- Einblendedauer nach der Regel der Anleitung (bis zum nächsten Wort; bei Pausen ≥ 0,6 s Ausblenden 0,15 s nach dem Wort): "
  f"Median {np.median(disp)*1000:.0f} ms, max {disp.max():.2f} s")
long_disp = [i for i in range(len(new)) if disp[i] > 1.0]
short = [i for i in range(len(new)) if d[i] < 2 / FPS]
P(f"- Einblendungen **> 1,0 s**: {len(long_disp)}" + (": " + ", ".join(
    f"„{new[i]['w']}“ (#{i+1}, {disp[i]:.2f} s)" for i in long_disp) if long_disp else ""))
P(f"- Gesprochene Wörter **kürzer als 2 Bilder** (67 ms): {len(short)}" + (": " + ", ".join(
    f"„{new[i]['w']}“ (#{i+1}, {d[i]*1000:.0f} ms)" for i in short) if short else ""))

# ---------------------------------------------------------------- 7 inner boundaries
inner = [i for i in range(len(new) - 1) if i not in placed]
dist = []
for i in inner:
    c = fr(new[i]["e"])
    lo, hi = max(0, c - 8), c + 9
    dist.append((abs(lo + int(np.argmin(env[lo:hi])) - c) * 10, i))
dv = np.array([a for a, _ in dist])
P("\n## 7. Wortgrenzen innerhalb eines Satzes (geschätzt, nicht gemessen)")
P(f"- {len(inner)} Grenzen ohne Pause · Abstand zum nächsten Pegeltal: Median {np.median(dv):.0f} ms, "
  f"75 % unter {np.percentile(dv, 75):.0f} ms, max {dv.max():.0f} ms")
worst = sorted(dist, reverse=True)[:5]
P("- Größte Abstände: " + ", ".join(f"„{new[i]['w']} | {new[i+1]['w']}“ (#{i+1}, {a} ms)" for a, i in worst))

out = os.path.join(HERE, "PRUEFBERICHT.md")
with open(out, "x", encoding="utf-8") as f:
    f.write("\n".join(L) + "\n")
print("\n".join(L))
