# Prüfbericht: Pausenkorrektur ausgehend von `words.json` (Lauf 2)

Datum: 2026-11-05 · Verfahren `snap_from_words.py` (Testordner) · nur Kopien, keine Produktionsdateien · keine API, keine Kosten

## A) Young Storyteller – v3-Kurzaufnahme (eleven_v3, 14 Wörter, 7,5 s)

**1. Vollständigkeit:** 14 Wörter · gleiche Wörter/Reihenfolge wie `words.json`: **ja** · wie `narration.txt`: **ja** · fehlend/doppelt: **keine** · ohne Überlappung, fortlaufend: **ja**

**2. Bisher gegen korrigiert:** Wort „läuft“ während Stille: **2.71 s → 0.06 s** · Wortanfänge verschoben: Median 114 ms, max 520 ms („The“)
- Vor der Zuordnung auf plausible Sprechdauer begrenzt: „part?“ 0.40 → 0.28 s, „The“ 0.48 → 0.40 s, „seaworthy…“ 1.44 → 0.63 s, „lifeboat…“ 1.20 → 0.56 s, „gone.“ 1.57 → 0.28 s
- **Vergleich mit dem zeichengenauen Verfahren** (Maßstab aus dem letzten Test): Abweichung Wortanfang Median **5 ms**, max **95 ms**; Wortende max 62 ms (bisherige v3-Zeiten: Anfang Median 79 ms, max 520 ms daneben)

| Wort | bisher v3 | korrigiert (aus words.json) | Maßstab (zeichengenau) |
|---|---|---|---|
| And | 0.07–0.08 | 0.05–0.07 | 0.05–0.07 |
| the | 0.10–0.16 | 0.09–0.16 | 0.09–0.16 |
| strangest | 0.22–0.64 | 0.23–0.75 | 0.22–0.72 |
| part? | 0.72–1.12 | 0.85–1.19 | 0.81–1.19 |
| The | 1.28–1.76 | 1.80–2.13 | 1.80–2.20 |
| ship | 1.82–2.08 | 2.25–2.47 | 2.25–2.46 |
| was | 2.12–2.24 | 2.50–2.60 | 2.50–2.60 |
| still | 2.28–2.48 | 2.63–2.80 | 2.63–2.79 |
| seaworthy… | 2.56–4.00 | 2.87–3.39 | 2.86–3.39 |
| But | 4.11–4.17 | 4.14–4.21 | 4.14–4.21 |
| the | 4.21–4.33 | 4.26–4.41 | 4.25–4.39 |
| lifeboat… | 4.41–5.61 | 4.51–5.19 | 4.47–5.19 |
| was | 5.67–5.85 | 5.73–5.99 | 5.73–5.93 |
| gone. | 5.96–7.53 | 6.14–6.54 | 6.05–6.54 |

**3. Pausen und Satzenden:** 3 Pausen gefunden, 3 zugeordnet, 0 nicht zugeordnet · Längen 0,15–0,3 s: 0, 0,3–0,6 s: 1, ≥ 0,6 s: 2 (längste 0.75 s) · Wortkanten exakt an der gemessenen Stille: **ja**
- Pausen ohne Satzzeichen: 0
- Satzzeichen ohne Pause (fließend gesprochen): 0
- Satzenden: 2, davon an einer Pause bzw. am Aufnahmeende: 2 · letztes Wort endet 6.54 s (bisher 7.53 s, Sprache endet 6.54 s)

**4. Atem, Ausklang, leise Wörter:** Wortanfänge ≥ 120 ms vor dem deutlichen Einsatz (Einatmen/leiser Anlaut): **0** · leiser Ausklang/Atem am Wortende mitgezählt (bis ~0,1 s Nachlauf): 4 Wörter · Wörter > 12 dB leiser als der Median: 1 („And“ -41 dB)

**5. Wortgrenzen innerhalb von Sätzen** (10, geschätzt): Abstand zum Pegeltal (±150 ms) Median bisher 92 ms → korrigiert 58 ms; näher am Tal: korrigiert 6×, bisher 3×, gleich 1×

**6. Einblendung und Pausen:** Gesprochene Wörter < 2 Bilder: 1 („And“) · längste Wortdauer 0.68 s („lifeboat…“)
- Mit der Regel der Anleitung (Wort bleibt bis zum nächsten Wort; erst ab 0,6 s Pause Ausblenden 0,15 s nach dem Wort) ist in 1.90 s Pausen insgesamt **0.84 s** ein Untertitel sichtbar; bei 1 von 3 Pausen bleibt das Wort stehen (Pause < 0,6 s).
- Blendet man den Untertitel an jedem korrigierten Wortende aus, ist in Pausen **0,00 s** etwas sichtbar.
- Alternative Regel „ausblenden am Wortende, wenn die Pause danach mindestens X s lang ist“:

  | X | Untertitel sichtbar in Pausen | Anzahl Ausblendungen | kürzeste Lücke ohne Untertitel |
  |---|---|---|---|
  | 0.15 s | 0.00 s von 1.90 s | 3 | 0.54 s |
  | 0.25 s | 0.00 s von 1.90 s | 3 | 0.54 s |
  | 0.30 s | 0.00 s von 1.90 s | 3 | 0.54 s |
  | 0.40 s | 0.00 s von 1.90 s | 3 | 0.54 s |
  | 0.60 s | 0.54 s von 1.90 s | 2 | 0.61 s |

**7. Vergleich mit Lauf 1:** Wort in Stille Lauf 1 0.12 s → Lauf 2 0.06 s · Grenzen in Sätzen (Abstand Pegeltal, Median) bisher 92 / Lauf 1 58 / Lauf 2 58 ms · Abweichung vom zeichengenauen Maßstab: Lauf 1 Median 34 / max 241 ms → Lauf 2 Median 5 / max 95 ms · Abschnitte: 0 innere Zeiten behalten, 4 neu verteilt

## B) Mary-Celeste-Hauptfassung (Wyman v3, von Hand geschnitten, 156 Wörter, 60,2 s)

**1. Vollständigkeit:** 156 Wörter · gleiche Wörter/Reihenfolge wie `words.json`: **ja** · wie `narration.txt`: **ja** · fehlend/doppelt: **keine** · ohne Überlappung, fortlaufend: **ja**

**2. Bisher gegen korrigiert:** Wort „läuft“ während Stille: **4.25 s → 0.51 s** · Wortanfänge verschoben: Median 0 ms, max 156 ms („Azores.“)
- Vor der Zuordnung auf plausible Sprechdauer begrenzt: „Atlantic.“ 0.58 → 0.54 s, „damaged.“ 0.66 → 0.47 s, „empty.“ 0.59 → 0.34 s, „aboard.“ 0.59 → 0.41 s, „Azores.“ 0.73 → 0.41 s, „Celeste.“ 0.58 → 0.47 s, „members.“ 0.54 → 0.47 s, „now,“ 0.57 → 0.39 s, „gone.“ 0.54 → 0.27 s, „part?“ 0.40 → 0.27 s, „seaworthy.“ 0.70 → 0.61 s, „remained.“ 0.65 → 0.54 s, „bodies.“ 0.58 → 0.41 s, „gone.“ 0.54 → 0.27 s, „silence.“ 0.69 → 0.47 s, „panic?“ 0.49 → 0.34 s, „disaster?“ 0.64 → 0.54 s, „knows.“ 0.53 → 0.34 s, „found.“ 0.47 → 0.34 s, „again.“ 0.67 → 0.34 s

**3. Pausen und Satzenden:** 31 Pausen gefunden, 31 zugeordnet, 0 nicht zugeordnet · Längen 0,15–0,3 s: 4, 0,3–0,6 s: 25, ≥ 0,6 s: 2 (längste 1.24 s) · Wortkanten exakt an der gemessenen Stille: **ja**
- Pausen ohne Satzzeichen: 3 (nach „Gratia“, nach „alcohol“, nach „aboard“)
- Satzzeichen ohne Pause (fließend gesprochen): 3 („4th,“, „Briggs,“, „disaster?“)
- Satzenden: 22, davon an einer Pause bzw. am Aufnahmeende: 21 · letztes Wort endet 60.00 s (bisher 60.23 s, Sprache endet 60.00 s)

**4. Atem, Ausklang, leise Wörter:** Wortanfänge ≥ 120 ms vor dem deutlichen Einsatz (Einatmen/leiser Anlaut): **0** · leiser Ausklang/Atem am Wortende mitgezählt (bis ~0,1 s Nachlauf): 10 Wörter · Wörter > 12 dB leiser als der Median: 1 („a“ -32 dB)

**5. Wortgrenzen innerhalb von Sätzen** (124, geschätzt): Abstand zum Pegeltal (±150 ms) Median bisher 62 ms → korrigiert 68 ms; näher am Tal: korrigiert 6×, bisher 8×, gleich 110×

**6. Einblendung und Pausen:** Gesprochene Wörter < 2 Bilder: 15 („a“, „in“, „the“, „a“, „of“, „a“, „of“, „of“, „a“, „in“, „in“, „a“ …) · längste Wortdauer 1.15 s („1872,“)
- Mit der Regel der Anleitung (Wort bleibt bis zum nächsten Wort; erst ab 0,6 s Pause Ausblenden 0,15 s nach dem Wort) ist in 13.05 s Pausen insgesamt **11.48 s** ein Untertitel sichtbar; bei 29 von 31 Pausen bleibt das Wort stehen (Pause < 0,6 s).
- Blendet man den Untertitel an jedem korrigierten Wortende aus, ist in Pausen **0,00 s** etwas sichtbar.
- Alternative Regel „ausblenden am Wortende, wenn die Pause danach mindestens X s lang ist“:

  | X | Untertitel sichtbar in Pausen | Anzahl Ausblendungen | kürzeste Lücke ohne Untertitel |
  |---|---|---|---|
  | 0.15 s | 0.00 s von 13.05 s | 31 | 0.16 s |
  | 0.25 s | 0.59 s von 13.05 s | 28 | 0.29 s |
  | 0.30 s | 0.88 s von 13.05 s | 27 | 0.30 s |
  | 0.40 s | 5.22 s von 13.05 s | 15 | 0.41 s |
  | 0.60 s | 11.18 s von 13.05 s | 2 | 0.63 s |

**7. Vergleich mit Lauf 1:** Wort in Stille Lauf 1 0.65 s → Lauf 2 0.51 s · Grenzen in Sätzen (Abstand Pegeltal, Median) bisher 62 / Lauf 1 78 / Lauf 2 68 ms · Abschnitte: 28 innere Zeiten behalten, 4 neu verteilt

## C) Nachprüfung und Fazit (manuell ergänzt)
- **Lauf 1 → Lauf 2:** Wörter mit Pausenzeichen am Ende werden strenger auf eine plausible Sprechdauer begrenzt (Faktor 1,3
  statt 2,5). Abschnitte, die schon passen (Ränder weniger als 0,15 s daneben), behalten ihre inneren Wortzeiten. Lauf 1 ist
  als `*_lauf1.*` erhalten.
- **Restliche 0,51 s „Wort in Stille“ (Mary-Hauptfassung):** verteilt auf viele Wörter, meist 20–30 ms; größter Fall „deck“
  (80 ms) ist der Verschluss vor dem hörbaren „k“, also Teil des Wortes und keine Pause.
- **Young Storyteller:** Abweichung vom zeichengenauen Maßstab Median 5 ms, max 95 ms („gone.“ beginnt 90 ms später als
  im Maßstab). Das sind knapp 3 Bilder bei 30 fps, im Rest unter 2 Bildern.
- **Mary-Hauptfassung (Wyman):** 28 von 32 Satzabschnitten behalten ihre inneren Zeiten, 4 werden neu verteilt.
  Innerhalb von Sätzen sind 110 von 124 Grenzen unverändert.
- **Untertitel in Pausen:** Das hängt von der Einblende-Regel ab, nicht von den Wortzeiten. Die Regel der Anleitung
  (erst ab 0,6 s ausblenden) lässt bei Mary 11,5 von 13,1 s Pausenzeit einen Untertitel stehen. Mit „ausblenden ab 0,25 s
  Pause“ sind es 0,6 s, mit 0,15 s gar keine.
- **Grenzen des Tests:** Young Storyteller wurde nur an einer Kurzaufnahme (14 Wörter, 3 Pausen) geprüft. Eine vollständige
  Young-Storyteller-Aufnahme existiert noch nicht.
