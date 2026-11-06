# Prüfbericht: Pausenkorrektur ausgehend von `words.json`

Datum: 2026-11-05 · Verfahren `snap_from_words.py` (Testordner) · nur Kopien, keine Produktionsdateien · keine API, keine Kosten

## A) Young Storyteller – v3-Kurzaufnahme (eleven_v3, 14 Wörter, 7,5 s)

**1. Vollständigkeit:** 14 Wörter · gleiche Wörter/Reihenfolge wie `words.json`: **ja** · wie `narration.txt`: **ja** · fehlend/doppelt: **keine** · ohne Überlappung, fortlaufend: **ja**

**2. Bisher gegen korrigiert:** Wort „läuft“ während Stille: **2.71 s → 0.12 s** · Wortanfänge verschoben: Median 47 ms, max 520 ms („The“)
- Vor der Zuordnung auf plausible Sprechdauer begrenzt: „The“ 0.48 → 0.40 s, „seaworthy…“ 1.44 → 1.20 s, „lifeboat…“ 1.20 → 1.07 s, „gone.“ 1.57 → 0.54 s
- **Vergleich mit dem zeichengenauen Verfahren** (Maßstab aus dem letzten Test): Abweichung Wortanfang Median **34 ms**, max **241 ms**; Wortende max 226 ms (bisherige v3-Zeiten: Anfang Median 79 ms, max 520 ms daneben)

| Wort | bisher v3 | korrigiert (aus words.json) | Maßstab (zeichengenau) |
|---|---|---|---|
| And | 0.07–0.08 | 0.05–0.07 | 0.05–0.07 |
| the | 0.10–0.16 | 0.08–0.15 | 0.09–0.16 |
| strangest | 0.22–0.64 | 0.21–0.67 | 0.22–0.72 |
| part? | 0.72–1.12 | 0.76–1.19 | 0.81–1.19 |
| The | 1.28–1.76 | 1.80–2.06 | 1.80–2.20 |
| ship | 1.82–2.08 | 2.15–2.31 | 2.25–2.46 |
| was | 2.12–2.24 | 2.34–2.42 | 2.50–2.60 |
| still | 2.28–2.48 | 2.44–2.57 | 2.63–2.79 |
| seaworthy… | 2.56–4.00 | 2.62–3.39 | 2.86–3.39 |
| But | 4.11–4.17 | 4.14–4.19 | 4.14–4.21 |
| the | 4.21–4.33 | 4.22–4.31 | 4.25–4.39 |
| lifeboat… | 4.41–5.61 | 4.37–5.19 | 4.47–5.19 |
| was | 5.67–5.85 | 5.73–5.91 | 5.73–5.93 |
| gone. | 5.96–7.53 | 6.02–6.54 | 6.05–6.54 |

**3. Pausen und Satzenden:** 3 Pausen gefunden, 3 zugeordnet, 0 nicht zugeordnet · Längen 0,15–0,3 s: 0, 0,3–0,6 s: 1, ≥ 0,6 s: 2 (längste 0.75 s) · Wortkanten exakt an der gemessenen Stille: **ja**
- Pausen ohne Satzzeichen: 0
- Satzzeichen ohne Pause (fließend gesprochen): 0
- Satzenden: 2, davon an einer Pause bzw. am Aufnahmeende: 2 · letztes Wort endet 6.54 s (bisher 7.53 s, Sprache endet 6.54 s)

**4. Atem, Ausklang, leise Wörter:** Wortanfänge ≥ 120 ms vor dem deutlichen Einsatz (Einatmen/leiser Anlaut): **0** · leiser Ausklang/Atem am Wortende mitgezählt (bis ~0,1 s Nachlauf): 4 Wörter · Wörter > 12 dB leiser als der Median: 1 („And“ -41 dB)

**5. Wortgrenzen innerhalb von Sätzen** (10, geschätzt): Abstand zum Pegeltal (±150 ms) Median bisher 92 ms → korrigiert 58 ms; näher am Tal: korrigiert 8×, bisher 2×, gleich 0×

**6. Einblendung und Pausen:** Gesprochene Wörter < 2 Bilder: 3 („And“, „the“, „But“) · längste Wortdauer 0.82 s („lifeboat…“)
- Mit der Regel der Anleitung (Wort bleibt bis zum nächsten Wort; erst ab 0,6 s Pause Ausblenden 0,15 s nach dem Wort) ist in 1.90 s Pausen insgesamt **0.84 s** ein Untertitel sichtbar; bei 1 von 3 Pausen bleibt das Wort stehen (Pause < 0,6 s).
- Blendet man den Untertitel an jedem korrigierten Wortende aus, ist in Pausen **0,00 s** etwas sichtbar.

## B) Mary-Celeste-Hauptfassung (Wyman v3, von Hand geschnitten, 156 Wörter, 60,2 s)

**1. Vollständigkeit:** 156 Wörter · gleiche Wörter/Reihenfolge wie `words.json`: **ja** · wie `narration.txt`: **ja** · fehlend/doppelt: **keine** · ohne Überlappung, fortlaufend: **ja**

**2. Bisher gegen korrigiert:** Wort „läuft“ während Stille: **4.25 s → 0.65 s** · Wortanfänge verschoben: Median 31 ms, max 111 ms („And“)
- Vor der Zuordnung auf plausible Sprechdauer begrenzt: „now,“ 0.57 → 0.39 s, „gone.“ 0.54 → 0.52 s, „gone.“ 0.54 → 0.52 s, „again.“ 0.67 → 0.65 s

**3. Pausen und Satzenden:** 31 Pausen gefunden, 31 zugeordnet, 0 nicht zugeordnet · Längen 0,15–0,3 s: 4, 0,3–0,6 s: 25, ≥ 0,6 s: 2 (längste 1.24 s) · Wortkanten exakt an der gemessenen Stille: **ja**
- Pausen ohne Satzzeichen: 3 (nach „Gratia“, nach „alcohol“, nach „aboard“)
- Satzzeichen ohne Pause (fließend gesprochen): 3 („4th,“, „Briggs,“, „disaster?“)
- Satzenden: 22, davon an einer Pause bzw. am Aufnahmeende: 21 · letztes Wort endet 60.00 s (bisher 60.23 s, Sprache endet 60.00 s)

**4. Atem, Ausklang, leise Wörter:** Wortanfänge ≥ 120 ms vor dem deutlichen Einsatz (Einatmen/leiser Anlaut): **0** · leiser Ausklang/Atem am Wortende mitgezählt (bis ~0,1 s Nachlauf): 8 Wörter · Wörter > 12 dB leiser als der Median: 2 („of“ -36 dB, „the“ -29 dB)

**5. Wortgrenzen innerhalb von Sätzen** (124, geschätzt): Abstand zum Pegeltal (±150 ms) Median bisher 62 ms → korrigiert 78 ms; näher am Tal: korrigiert 40×, bisher 65×, gleich 19×

**6. Einblendung und Pausen:** Gesprochene Wörter < 2 Bilder: 21 („a“, „in“, „the“, „a“, „of“, „a“, „the“, „the“, „had“, „the“, „of“, „of“ …) · längste Wortdauer 1.16 s („1872,“)
- Mit der Regel der Anleitung (Wort bleibt bis zum nächsten Wort; erst ab 0,6 s Pause Ausblenden 0,15 s nach dem Wort) ist in 13.05 s Pausen insgesamt **11.48 s** ein Untertitel sichtbar; bei 29 von 31 Pausen bleibt das Wort stehen (Pause < 0,6 s).
- Blendet man den Untertitel an jedem korrigierten Wortende aus, ist in Pausen **0,00 s** etwas sichtbar.
