# Voice-Design-Test (2026-11-05) – nur Vorbereitung, noch nichts ausgeführt

Ziel: junge amerikanische männliche Erzählstimme (20–25 J.), warm, leicht rau, mittlere bis etwas höhere Stimmlage,
charismatisch, lebendig, fesselnd. Kein Dokumentarfilmsprecher, keine monotone KI-Stimme.

| Datei | Inhalt |
|---|---|
| `test_text.txt` | gemeinsamer Testtext (195 Zeichen, wörtlich aus `shorts/mary-celeste/voice/narration.txt`) |
| `variants.json` | 3 Stimmbeschreibungen + Parameter (Modell `eleven_ttv_v3`, Seed 1872) |
| `design_voices.py` | Testskript: ohne `--confirm` nur Probelauf; mit `--confirm` genau 3 Design-Aufrufe |
| `previews/<variante>/` | entsteht erst beim echten Lauf: `preview_N.mp3` + `design.json` |

Varianten: 1 Warm & Mysterious · 2 Warm & Energetic · 3 Warm & Cinematic

Sicherheitsregeln des Skripts:
- Es wird **nur** `POST /v1/text-to-voice/design` aufgerufen. Keine Stimme wird dauerhaft gespeichert.
- Bereits vorhandene Ergebnisse werden nie überschrieben, sondern übersprungen.
- Beim ersten Berechtigungsfehler bricht das Skript ab. Solche Fehler kosten nichts.
- Der Produktions-Workflow (`scripts/voice/`, `shorts/`) und Wyman werden nicht berührt.

Benötigte Berechtigung des API-Schlüssels: **`voice_generation`**. Erst zum späteren dauerhaften Speichern
einer gewählten Stimme zusätzlich `voices_write`.
