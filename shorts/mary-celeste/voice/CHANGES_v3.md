# Mary Celeste – Sprachaufnahme v3: Änderungsprotokoll

Datum: 2026-11-05 · kein ElevenLabs-Aufruf, 0 Credits · Skript: `edit_v3.py` · Messwerte: `processing_v3.json`

**v3 = v2 ohne die Tonhöhenabsenkung bei „No one knows.“**

## Änderung gegenüber v2
- „No one knows.“ wieder in Wymans normaler Tonhöhe: gemessen 100,8 Hz, genau wie in v1 (v2: 93,8 Hz = −1,26 Halbtöne).

## Unverändert aus v2 übernommen (siehe CHANGES_v2.md)
- gekürzte Pausen und +5 % Tempo bei „Its sails damaged … Not a single person aboard.“ („Not a single person aboard.“: 2,45 → 2,02 s)
- längere Pause vor „And the strangest part?“ (1,29 s)
- EQ, De-Esser, Kompression, Lautheit wie v1 (−20,3 LUFS)

## Prüfung
- Dauer: 60,235 s (wie v2)
- `words_v3.json`: 156 Wörter wie in `narration.txt`, identisch mit `words_v2.json`, weil sich das Timing nicht geändert hat
- Audio bis kurz vor „No one knows.“ bitgenau identisch mit v2, ebenso ab 1 s danach
