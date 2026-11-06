# Prüfbericht: Wortzeit-Korrektur an der vollständigen Mary-Celeste-Aufnahme

Datum: 2026-11-05 · Aufnahme: Kopie von **v1 (Wyman, automatisch erzeugt)**, 60,6 s, 156 Wörter · Verfahren: `snap_words.py` unverändert · Schwelle -59.5 dBFS, Pausen ab 0.15 s

## 1. Vollständigkeit
- Wörter: 156 (vorher 156, Referenz `narration.txt` 156)
- Gleiche Wörter in gleicher Reihenfolge wie vorher: **ja** · wie `narration.txt`: **ja**
- Fehlende oder doppelte Wörter: **keine** · Zeiten fortlaufend ohne Überlappung: **ja**

## 2. Alt gegen korrigiert
- Zeit, in der ein Wort „läuft“, obwohl das Audio still ist: **3.18 s → 0.22 s**
- Verschiebung der Wortanfänge: Median 31 ms, 95 % unter 72 ms, max 100 ms

| Wort (#) | alt | korrigiert | Verschiebung Anfang |
|---|---|---|---|
| 1872, (#24) | 10.97–12.18 | 11.07–12.11 | +94 ms |
| now, (#67) | 27.09–27.66 | 27.18–27.53 | +84 ms |
| of (#90) | 37.38–37.42 | 37.46–37.51 | +85 ms |
| industrial (#91) | 37.46–37.87 | 37.55–37.96 | +87 ms |
| alcohol (#92) | 37.92–38.44 | 38.02–38.55 | +100 ms |
| found. (#147) | 56.99–57.46 | 57.07–57.46 | +77 ms |

## 3. Pausen
- Gefunden 33, zugeordnet 33, nicht zugeordnet 0
- Längen: kurz 0,15–0,30 s: 6 · mittel 0,30–0,60 s: 26 · lang ≥ 0,60 s: 1 (längste 0.61 s)
- Pausen **ohne** Satzzeichen davor: 6: nach „deck“ (#14, 0.39 s), nach „single“ (#18, 0.15 s), nach „person“ (#19, 0.27 s), nach „Gratia“ (#31, 0.27 s), nach „alcohol“ (#92, 0.23 s), nach „aboard“ (#152, 0.16 s)
- Satzzeichen **ohne** messbare Pause (fließend gesprochen): 4: „4th,“ (#23), „York,“ (#50), „Briggs,“ (#56), „disaster?“ (#139)
- Satzenden (. ? !): 22, davon mit Pause bzw. Aufnahmeende: 21; Wortende = Beginn der gemessenen Stille bei allen zugeordneten Pausen: ja
- Letztes Wort endet 60.36 s, Sprache endet 60.36 s (vorher 60.59 s)

## 4. Atemgeräusche
- Grenze „deutlich gesprochen“: -39.6 dBFS (Median der Sprache − 18 dB)
- Wörter nach einer Pause, deren korrigierter Anfang **≥ 120 ms vor** dem deutlich hörbaren Einsatz liegt (wahrscheinlich Einatmen oder leiser Anlaut): **0**
- Längere leise Abschnitte (≥ 150 ms über der Stilleschwelle, aber unter der Sprachgrenze): 0

## 5. Leise gesprochene Wörter
- Median-Pegel der Wörter -16.5 dBFS; Wörter mehr als 12 dB leiser: **1**: „a“ (#131, -54 dB, 0 ms in Stille)

## 6. Einblendedauer der Untertitel
- Gesprochene Wortdauer: Median 231 ms, max 1.04 s („1872,“)
- Einblendedauer nach der Regel der Anleitung (bis zum nächsten Wort; bei Pausen ≥ 0,6 s Ausblenden 0,15 s nach dem Wort): Median 288 ms, max 1.36 s
- Einblendungen **> 1,0 s**: 8: „damaged.“ (#12, 1.04 s), „empty.“ (#15, 1.06 s), „1872,“ (#24, 1.36 s), „Azores.“ (#37, 1.07 s), „seaworthy.“ (#80, 1.02 s), „1,701“ (#88, 1.09 s), „25th.“ (#121, 1.09 s), „silence.“ (#124, 1.09 s)
- Gesprochene Wörter **kürzer als 2 Bilder** (67 ms): 19: „a“ (#3, 45 ms), „in“ (#7, 46 ms), „a“ (#17, 22 ms), „of“ (#27, 45 ms), „a“ (#33, 24 ms), „the“ (#40, 63 ms), „had“ (#47, 66 ms), „the“ (#73, 65 ms), „of“ (#87, 57 ms), „of“ (#90, 46 ms), „a“ (#104, 23 ms), „the“ (#107, 65 ms), „in“ (#114, 43 ms), „the“ (#115, 66 ms), „the“ (#126, 66 ms), „in“ (#130, 43 ms), „a“ (#131, 23 ms), „in“ (#136, 44 ms), „a“ (#137, 22 ms)

## 7. Wortgrenzen innerhalb eines Satzes (geschätzt, nicht gemessen)
- 122 Grenzen ohne Pause · Abstand zum nächsten Pegeltal: Median 40 ms, 75 % unter 60 ms, max 80 ms
- Größte Abstände: „Celeste | was“ (#145, 80 ms), „disaster? | No“ (#139, 80 ms), „Were | they“ (#133, 80 ms), „After | that,“ (#122, 80 ms), „entry | in“ (#113, 80 ms)

## 8. Nachprüfung (manuell ergänzt)
- **Atem/Ausklang am Wortende:** Bei 22 Wörtern liegt am Wortende ein leiser Ausklang (−40 bis −50 dB) über der
  Stilleschwelle. Er wird dem Wort zugerechnet. Beispiel „alcohol“ (#92): Sprache endet ca. 38,43 s, danach Atem/Ausklang
  bis 38,53 s, Wortende jetzt 38,55 s. Folge: Das Wort bleibt bis ca. 0,1 s länger stehen. Für Untertitel unkritisch
  (auch die alten Zeiten liefen hier bis in die Pause), bei langen Pausen blendet der Untertitel etwas später aus.
- **Atem vor Wortanfängen:** Kein Wort beginnt ≥ 120 ms vor dem deutlich hörbaren Einsatz. Einatmen verschiebt die
  Untertitel also nicht nach vorn.
- **Restliche 0,22 s „Wort in Stille“:** verteilt auf viele Wörter mit je ≤ 45 ms (größte: „carrying“ #51 45 ms,
  „of“ #103 35 ms, „1872,“ #24 30 ms), entstanden durch kurze Pegeleinbrüche im Wort, keine echten Pausen.
- **Grenzen innerhalb von Sätzen:** Gegenüber den ursprünglichen ElevenLabs-Zeiten weder besser noch schlechter
  (Abstand zum Pegeltal ±150 ms: Median 65 → 60 ms; 52× näher, 59× weiter, 11× gleich). Die Verbesserung liegt
  ausschließlich an Pausen und Satzenden. Hinweis: Der Wert „max 80 ms“ in Abschnitt 7 ist durch das Suchfenster
  ±80 ms begrenzt.
- **Bewertung der Auffälligkeiten aus Abschnitt 3:** Die 6 Pausen ohne Satzzeichen sind echte Sprechpausen von Wyman
  (u. a. die bekannte Pause in „deck … empty“) und richtig erkannt. Die 4 Satzzeichen ohne Pause sind fließend
  gesprochen (z. B. „disaster? No one knows“ mit nur 0,14 s Lücke), richtig ohne Pause behandelt.
