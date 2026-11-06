"""Check report for snap_from_words.py (young + mary_main). Read-only on all inputs; writes PRUEFBERICHT.md once."""
import json
import os
import re
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(PROJECT, "shorts", "bridge", "audio"))
from dsp import read_wav  # noqa: E402

FPS = 30
L = []
P = L.append
nrm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())
punct = lambda w: bool(re.search(r"[.?!,:;…—]$", w))


def analyse(name, title):
    F = os.path.join(HERE, name)
    old = json.load(open(os.path.join(F, "words.json")))
    new = json.load(open(os.path.join(F, "words_snapped.json")))
    rep = json.load(open(os.path.join(F, "snap_report.json")))
    ref = open(os.path.join(F, "narration.txt")).read().split()
    x, sr = read_wav(os.path.join(F, "voice.wav"))
    x = x[0]
    h = sr // 200                                   # 5 ms frames
    env = 20 * np.log10(np.sqrt((x[: len(x) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-9)
    thr = rep["threshold_dbfs"]
    silent = env < thr
    f = lambda t: int(round(t * 200))
    in_sil = lambda w: silent[f(w["s"]):f(w["e"])].sum() / 200
    placed = {int(k.split("#")[1].rstrip(")")) - 1: v for k, v in rep["pause_after_word"].items()}
    res = {}

    P(f"\n## {title}\n")
    # 1 completeness
    same = [w["w"] for w in new] == [w["w"] for w in old]
    sref = [nrm(w["w"]) for w in new] == [nrm(t) for t in ref]
    mono = all(a["s"] < a["e"] <= b["s"] + 1e-9 for a, b in zip(new, new[1:]))
    res["ok"] = same and sref and mono
    P(f"**1. Vollständigkeit:** {len(new)} Wörter · gleiche Wörter/Reihenfolge wie `words.json`: **{'ja' if same else 'NEIN'}** · "
      f"wie `narration.txt`: **{'ja' if sref else 'NEIN'}** · fehlend/doppelt: **{'keine' if sref else '?'}** · "
      f"ohne Überlappung, fortlaufend: **{'ja' if mono else 'NEIN'}**")
    # 2 old vs new
    so, sn = sum(in_sil(w) for w in old), sum(in_sil(w) for w in new)
    res["sil"] = (so, sn)
    ds = np.array([n["s"] - o["s"] for o, n in zip(old, new)])
    P(f"\n**2. Bisher gegen korrigiert:** Wort „läuft“ während Stille: **{so:.2f} s → {sn:.2f} s** · "
      f"Wortanfänge verschoben: Median {np.median(np.abs(ds))*1000:.0f} ms, max {np.abs(ds).max()*1000:.0f} ms "
      f"(„{new[int(np.abs(ds).argmax())]['w']}“)")
    if rep["capped_words"]:
        P(f"- Vor der Zuordnung auf plausible Sprechdauer begrenzt: " + ", ".join(
            f"„{c['w']}“ {c['from_s']:.2f} → {c['to_s']:.2f} s" for c in rep["capped_words"]))
    # reference (young only)
    rp = os.path.join(F, "reference_charlevel.json")
    if os.path.exists(rp):
        rf = json.load(open(rp))
        es = np.array([abs(a["s"] - b["s"]) for a, b in zip(new, rf)])
        ee = np.array([abs(a["e"] - b["e"]) for a, b in zip(new, rf)])
        eo = np.array([abs(a["s"] - b["s"]) for a, b in zip(old, rf)])
        res["ref"] = (float(np.median(es)), float(es.max()), float(ee.max()), float(np.median(eo)), float(eo.max()))
        P(f"- **Vergleich mit dem zeichengenauen Verfahren** (Maßstab aus dem letzten Test): Abweichung Wortanfang "
          f"Median **{np.median(es)*1000:.0f} ms**, max **{es.max()*1000:.0f} ms**; Wortende max {ee.max()*1000:.0f} ms "
          f"(bisherige v3-Zeiten: Anfang Median {np.median(eo)*1000:.0f} ms, max {eo.max()*1000:.0f} ms daneben)")
        P("\n| Wort | bisher v3 | korrigiert (aus words.json) | Maßstab (zeichengenau) |\n|---|---|---|---|")
        for o, n, r in zip(old, new, rf):
            P(f"| {n['w']} | {o['s']:.2f}–{o['e']:.2f} | {n['s']:.2f}–{n['e']:.2f} | {r['s']:.2f}–{r['e']:.2f} |")
    # 3 pauses / sentence ends
    durs = np.array([b - a for a, b in placed.values()]) if placed else np.array([0.0])
    nop = [i for i in sorted(placed) if not punct(new[i]["w"])]
    pnp = [i for i in range(len(new) - 1) if punct(new[i]["w"]) and i not in placed]
    ends = [i for i in range(len(new)) if re.search(r"[.?!]$", new[i]["w"])]
    end_ok = [i for i in ends if i in placed or i == len(new) - 1]
    edge_ok = all(abs(new[i]["e"] - placed[i][0]) < 0.011 and abs(new[i + 1]["s"] - placed[i][1]) < 0.011 for i in placed)
    P(f"\n**3. Pausen und Satzenden:** {len(rep['pauses'])} Pausen gefunden, {len(placed)} zugeordnet, "
      f"{len(rep['pauses_not_placed'])} nicht zugeordnet · Längen 0,15–0,3 s: {int(((durs>=.15)&(durs<.3)).sum())}, "
      f"0,3–0,6 s: {int(((durs>=.3)&(durs<.6)).sum())}, ≥ 0,6 s: {int((durs>=.6).sum())} (längste {durs.max():.2f} s) · "
      f"Wortkanten exakt an der gemessenen Stille: **{'ja' if edge_ok else 'NEIN'}**")
    P(f"- Pausen ohne Satzzeichen: {len(nop)}" + (" (" + ", ".join(f"nach „{new[i]['w']}“" for i in nop) + ")" if nop else ""))
    P(f"- Satzzeichen ohne Pause (fließend gesprochen): {len(pnp)}" + (" (" + ", ".join(f"„{new[i]['w']}“" for i in pnp) + ")" if pnp else ""))
    P(f"- Satzenden: {len(ends)}, davon an einer Pause bzw. am Aufnahmeende: {len(end_ok)} · letztes Wort endet "
      f"{new[-1]['e']:.2f} s (bisher {old[-1]['e']:.2f} s, Sprache endet {rep['speech_end_s']:.2f} s)")
    # 4 breath / tails / quiet
    loud = np.percentile(env[~silent], 50) - 18
    pre = []
    for i in placed:
        j = i + 1
        s = f(new[j]["s"])
        k = s
        while k < len(env) and env[k] < loud and k - s < 120:
            k += 1
        if (k - s) / 200 >= 0.12:
            pre.append((j, (k - s) / 200))
    tails = [i for i, w in enumerate(new) if f(w["e"]) - f(w["s"]) >= 40
             and env[f(w["e"]) - 24:f(w["e"])].mean() < -40 and np.percentile(env[f(w["s"]):f(w["e"])], 90) > -30]
    lv = np.array([np.percentile(env[f(w["s"]):max(f(w["e"]), f(w["s"]) + 1)], 90) for w in new])
    quiet = [i for i in range(len(new)) if lv[i] < np.median(lv) - 12]
    P(f"\n**4. Atem, Ausklang, leise Wörter:** Wortanfänge ≥ 120 ms vor dem deutlichen Einsatz (Einatmen/leiser Anlaut): "
      f"**{len(pre)}**" + (" (" + ", ".join(f"„{new[j]['w']}“ {d*1000:.0f} ms" for j, d in pre) + ")" if pre else "")
      + f" · leiser Ausklang/Atem am Wortende mitgezählt (bis ~0,1 s Nachlauf): {len(tails)} Wörter · "
      f"Wörter > 12 dB leiser als der Median: {len(quiet)}" + (" (" + ", ".join(f"„{new[i]['w']}“ {lv[i]:.0f} dB" for i in quiet) + ")" if quiet else ""))
    # 5 in-sentence boundaries
    inner = [i for i in range(len(new) - 1) if i not in placed]

    def dip(t):
        c = f(t)
        lo, hi = max(0, c - 30), c + 31
        return abs(lo + int(np.argmin(env[lo:hi])) - c) * 5
    if inner:
        dn = np.array([dip((new[i]["e"] + new[i + 1]["s"]) / 2) for i in inner])
        do = np.array([dip((old[i]["e"] + old[i + 1]["s"]) / 2) for i in inner])
        P(f"\n**5. Wortgrenzen innerhalb von Sätzen** ({len(inner)}, geschätzt): Abstand zum Pegeltal (±150 ms) Median "
          f"bisher {np.median(do):.0f} ms → korrigiert {np.median(dn):.0f} ms; näher am Tal: korrigiert {int((dn<do).sum())}×, "
          f"bisher {int((do<dn).sum())}×, gleich {int((do==dn).sum())}×")
    # 6 display during pauses
    d = np.array([w["e"] - w["s"] for w in new])
    short = [i for i in range(len(new)) if d[i] < 2 / FPS]
    nxt = [new[i + 1]["s"] if i + 1 < len(new) else new[i]["e"] for i in range(len(new))]
    rule = [(new[i]["e"] + 0.15) if nxt[i] - new[i]["e"] >= 0.6 else nxt[i] for i in range(len(new))]
    vis_pause_rule = sum(max(0.0, min(rule[i], b) - a) for i, (a, b) in placed.items())
    total_pause = sum(b - a for a, b in placed.values())
    res["vis"] = (vis_pause_rule, total_pause)
    stays = [i for i in placed if nxt[i] - new[i]["e"] < 0.6]
    P(f"\n**6. Einblendung und Pausen:** Gesprochene Wörter < 2 Bilder: {len(short)}"
      + (" (" + ", ".join(f"„{new[i]['w']}“" for i in short[:12]) + (" …" if len(short) > 12 else "") + ")" if short else "")
      + f" · längste Wortdauer {d.max():.2f} s („{new[int(d.argmax())]['w']}“)")
    P(f"- Mit der Regel der Anleitung (Wort bleibt bis zum nächsten Wort; erst ab 0,6 s Pause Ausblenden 0,15 s nach dem Wort) "
      f"ist in {total_pause:.2f} s Pausen insgesamt **{vis_pause_rule:.2f} s** ein Untertitel sichtbar; "
      f"bei {len(stays)} von {len(placed)} Pausen bleibt das Wort stehen (Pause < 0,6 s).")
    P(f"- Blendet man den Untertitel an jedem korrigierten Wortende aus, ist in Pausen **0,00 s** etwas sichtbar.")
    return res


P("# Prüfbericht: Pausenkorrektur ausgehend von `words.json`\n")
P("Datum: 2026-11-05 · Verfahren `snap_from_words.py` (Testordner) · nur Kopien, keine Produktionsdateien · keine API, keine Kosten")
r1 = analyse("young", "A) Young Storyteller – v3-Kurzaufnahme (eleven_v3, 14 Wörter, 7,5 s)")
r2 = analyse("mary_main", "B) Mary-Celeste-Hauptfassung (Wyman v3, von Hand geschnitten, 156 Wörter, 60,2 s)")
out = os.path.join(HERE, "PRUEFBERICHT.md")
with open(out, "x", encoding="utf-8") as fh:
    fh.write("\n".join(L) + "\n")
print("\n".join(L))
