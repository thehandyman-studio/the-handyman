# Mary Celeste – Sprachaufnahme v2: Änderungsprotokoll

Datum: 2026-11-05 · Werkzeuge: Python/NumPy, Rubber Band 4.0 (R3), FFmpeg 9.0.2 · **kein ElevenLabs-Aufruf, 0 Credits**
Skript (reproduzierbar): `edit_v2.py` · Messwerte: `processing_v2.json`

## Dateien
| Datei | Status |
|---|---|
| `raw/elevenlabs.mp3`, `raw/alignment.json`, `raw/request.json` | Original, **unverändert** |
| `voice.wav`, `words.json`, `processing.json` | v1, **unverändert** (Prüfsummen identisch) |
| `_backup/2026-11-05_before-v2/` | Sicherungskopie von v1 + `originals.md5` |
| `voice_v2.wav` | **neu:** optimierte Fassung (48 kHz, 24 Bit, mono) |
| `words_v2.json` | **neu:** Wortzeiten passend zu v2 |
| `v2_tests/` | **neu:** Hörproben „No one knows.“ mit 0 / −1,0 / −1,25 / −1,5 Halbtönen |

## Änderungen (Zeiten = Position in v1)
1. **„Its sails damaged. Its deck empty. Not a single person aboard.“** (Passage 6,13 s → 5,05 s)
   - Pause nach „damaged.“: 0,55 → 0,40 s
   - Pause *in* „deck … empty“: 0,42 → 0,12 s (wirkte unnatürlich)
   - Pause nach „empty.“: 0,62 → 0,42 s
   - „single … person“: 0,22 → 0,10 s · „person … aboard“: 0,33 → 0,12 s
   - „Not a single person aboard.“ zusätzlich 5 % schneller (Rubber Band R3, Tonhöhe unverändert): 2,45 → 2,02 s
2. **Vor „And the strangest part?“**: Pause nach „gone.“ 0,58 → 1,29 s
3. **„No one knows.“**: −1,25 Halbtöne, mit Formant-Erhalt, damit es nicht dumpf klingt. Timing unverändert.
   Gemessen: 100,8 → 93,8 Hz = −1,26 Halbtöne. Der Folgesatz ist unverändert (±0,04).
4. **Gesamte Stimme (Klarheit):**
   - Hochpass 75 Hz (Rumpeln)
   - −1,5 dB bei 220 Hz (Dröhnen)
   - +1,5 dB bei 3 kHz (Präsenz)
   - De-Esser (Intensität 0,4)
   - Kompressor 2:1 ab −22 dB (Attack 15 ms, Release 180 ms)
   - danach Lautheit exakt auf v1 angeglichen
   - Ergebnis: Präsenz +2,9 dB, Zischlaute +2,3 dB, Rumpeln −2,4 dB, Sprach-Dynamik 18,9 → 15,4 dB

## Ergebnis
| | v1 | v2 |
|---|---|---|
| Dauer | 60,60 s | **60,24 s** |
| Lautheit | −20,3 LUFS | −20,3 LUFS |
| True Peak | | −1,6 dBTP |
| Wörter | 156 | 156 (gleiche Reihenfolge) |

## Prüfungen
- Alle Schnitte liegen in Stille, mit 10-ms-Blenden. Der Knackser-Test über alle Pausen fand nur zwei leise Atemgeräusche, die schon im Original vorkommen (nach „1872,“ und „alcohol“, etwa −55 dBFS).
- Wortzeiten v2 gegen die echten Pausen: mittlere Abweichung 112 ms (v1: 110 ms). Die Genauigkeit ist also gleich geblieben. Die Restabweichung stammt aus den ElevenLabs-Zeitangaben, deshalb gilt weiterhin: vor dem Schnitt von Hand nachbessern.
- Prüfsummen aller Originale und der v1-Dateien vorher und nachher identisch.

## Hinweis
Das Mischprogramm liest standardmäßig `voice.wav` und `words.json`. v2 wird erst verwendet, wenn wir das
ausdrücklich festlegen (z. B. v2 zur Hauptfassung machen).
